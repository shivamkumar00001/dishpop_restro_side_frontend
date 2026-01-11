/**
 * Enterprise Thermal Printer Service - FIXED VERSION
 * Supports ESC/POS, Star, and web-based printing
 * FIXES: Paper width selection, proper initialization, print preview
 */

class ThermalPrinterService {
  constructor() {
    this.printerType = 'web'; // 'thermal', 'web'
    this.printerWidth = 80; // mm (58mm or 80mm)
    this.connection = null;
    this.isConnected = false;
    
    // Initialize on construction
    this.initializePrinter();
  }

  /**
   * Detect and initialize printer
   */
  async initializePrinter() {
    try {
      // Get saved printer settings FIRST
      const savedSettings = await this.getPrinterSettings();
      if (savedSettings) {
        this.printerWidth = savedSettings.width || 80;
        this.printerType = savedSettings.type || 'web';
        console.log(`📋 Loaded saved settings: ${this.printerType} (${this.printerWidth}mm)`);
      }

      // Check available APIs
      if ('bluetooth' in navigator) {
        console.log('🔵 Bluetooth API available');
      }

      if ('usb' in navigator) {
        console.log('🔌 USB API available');
      }

      if ('serial' in navigator) {
        console.log('📡 Serial API available');
      }

      console.log(`✅ Printer initialized: ${this.printerType} (${this.printerWidth}mm)`);
      return true;
    } catch (error) {
      console.error('❌ Printer initialization failed:', error);
      return false;
    }
  }

  /**
   * Connect to Bluetooth thermal printer
   */
  async connectBluetooth() {
    try {
      if (!('bluetooth' in navigator)) {
        throw new Error('Bluetooth not supported');
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      });

      const server = await device.gatt.connect();
      console.log('✅ Connected to Bluetooth printer:', device.name);
      
      this.connection = { type: 'bluetooth', device, server };
      this.isConnected = true;
      
      await this.savePrinterSettings({
        type: 'thermal',
        connection: 'bluetooth',
        deviceName: device.name,
        width: this.printerWidth,
      });

      return true;
    } catch (error) {
      console.error('❌ Bluetooth connection failed:', error);
      return false;
    }
  }

  /**
   * Connect to USB thermal printer
   */
  async connectUSB() {
    try {
      if (!('usb' in navigator)) {
        throw new Error('USB not supported');
      }

      const device = await navigator.usb.requestDevice({ filters: [] });
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      console.log('✅ Connected to USB printer:', device.productName);
      
      this.connection = { type: 'usb', device };
      this.isConnected = true;

      await this.savePrinterSettings({
        type: 'thermal',
        connection: 'usb',
        deviceName: device.productName,
        width: this.printerWidth,
      });

      return true;
    } catch (error) {
      console.error('❌ USB connection failed:', error);
      return false;
    }
  }

  /**
   * Connect to Serial thermal printer
   */
  async connectSerial() {
    try {
      if (!('serial' in navigator)) {
        throw new Error('Serial not supported');
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      console.log('✅ Connected to Serial printer');
      
      this.connection = { type: 'serial', port };
      this.isConnected = true;

      await this.savePrinterSettings({
        type: 'thermal',
        connection: 'serial',
        width: this.printerWidth,
      });

      return true;
    } catch (error) {
      console.error('❌ Serial connection failed:', error);
      return false;
    }
  }

  /**
   * Generate ESC/POS commands for thermal printer
   */
  generateESCPOS(bill, restaurantName) {
    const commands = [];
    
    // Initialize printer
    commands.push(0x1B, 0x40); // ESC @

    // Set character size
    commands.push(0x1B, 0x21, 0x00); // Normal size

    // Center align
    commands.push(0x1B, 0x61, 0x01);

    // Restaurant name (bold, large)
    commands.push(0x1B, 0x21, 0x30); // Double height & width
    this.addText(commands, restaurantName || 'Restaurant');
    commands.push(0x0A); // Line feed

    // Reset to normal
    commands.push(0x1B, 0x21, 0x00);
    
    // Bill number
    this.addText(commands, `Bill: ${bill.billNumber}`);
    commands.push(0x0A);

    // Date & time
    const date = new Date(bill.createdAt).toLocaleString('en-IN');
    this.addText(commands, date);
    commands.push(0x0A);

    // Dashed line
    commands.push(0x1B, 0x61, 0x00); // Left align
    this.addText(commands, '-'.repeat(this.getCharWidth()));
    commands.push(0x0A);

    // Customer details
    this.addText(commands, `Table: ${bill.tableNumber}`);
    commands.push(0x0A);
    this.addText(commands, `Customer: ${bill.customerName}`);
    commands.push(0x0A);
    this.addText(commands, `Phone: ${bill.phoneNumber}`);
    commands.push(0x0A);

    if (bill.status === 'FINALIZED' && bill.paymentMethod) {
      this.addText(commands, `Payment: ${bill.paymentMethod}`);
      commands.push(0x0A);
    }

    // Dashed line
    this.addText(commands, '-'.repeat(this.getCharWidth()));
    commands.push(0x0A);

    // Items header
    this.addText(commands, this.formatLine('Item', 'Qty', 'Amount'));
    this.addText(commands, '-'.repeat(this.getCharWidth()));
    commands.push(0x0A);

    // Items
    bill.items.forEach(item => {
      const name = this.truncate(item.name, this.printerWidth === 58 ? 15 : 20);
      const qty = item.qty.toString();
      const price = `Rs${item.totalPrice.toFixed(2)}`;
      
      this.addText(commands, this.formatLine(name, qty, price));
      commands.push(0x0A);

      if (item.variant?.name) {
        const variantText = `  ${item.variant.name} @ Rs${item.unitPrice}`;
        this.addText(commands, variantText);
        commands.push(0x0A);
      }
    });

    // Dashed line
    this.addText(commands, '-'.repeat(this.getCharWidth()));
    commands.push(0x0A);

    // Totals
    this.addText(commands, this.formatTotal('Subtotal:', `Rs${bill.subtotal.toFixed(2)}`));
    commands.push(0x0A);

    // Discount
    const discountAmount = bill.discountType === 'PERCENTAGE'
      ? (bill.subtotal * bill.discount) / 100
      : bill.discountType === 'FIXED' ? bill.discount : 0;

    if (discountAmount > 0) {
      const discountLabel = bill.discountType === 'PERCENTAGE' 
        ? `Discount (${bill.discount}%):`
        : 'Discount:';
      this.addText(commands, this.formatTotal(discountLabel, `- Rs${discountAmount.toFixed(2)}`));
      commands.push(0x0A);
    }

    // Service charge
    if (bill.serviceCharge?.enabled) {
      this.addText(commands, this.formatTotal(
        `Service (${bill.serviceCharge.rate}%):`,
        `Rs${bill.serviceCharge.amount.toFixed(2)}`
      ));
      commands.push(0x0A);
    }

    // Taxes
    bill.taxes?.forEach(tax => {
      this.addText(commands, this.formatTotal(
        `${tax.name} (${tax.rate}%):`,
        `Rs${tax.amount.toFixed(2)}`
      ));
      commands.push(0x0A);
    });

    // Grand total (bold, large)
    commands.push(0x1B, 0x21, 0x30); // Double height & width
    this.addText(commands, this.formatTotal('GRAND TOTAL:', `Rs${bill.grandTotal.toFixed(2)}`));
    commands.push(0x0A);
    commands.push(0x1B, 0x21, 0x00); // Reset to normal

    // Dashed line
    this.addText(commands, '='.repeat(this.getCharWidth()));
    commands.push(0x0A);

    // Center align for footer
    commands.push(0x1B, 0x61, 0x01);
    
    this.addText(commands, 'Thank you for your visit!');
    commands.push(0x0A);
    this.addText(commands, 'Please visit again');
    commands.push(0x0A);

    if (bill.status === 'FINALIZED') {
      commands.push(0x0A);
      commands.push(0x1B, 0x21, 0x20); // Bold
      this.addText(commands, 'PAID');
      commands.push(0x1B, 0x21, 0x00); // Reset
      commands.push(0x0A);
    }

    // Cut paper
    commands.push(0x0A, 0x0A, 0x0A); // Feed lines
    commands.push(0x1D, 0x56, 0x00); // Full cut

    return new Uint8Array(commands);
  }

  /**
   * Helper: Add text to command array
   */
  addText(commands, text) {
    for (let i = 0; i < text.length; i++) {
      commands.push(text.charCodeAt(i));
    }
  }

  /**
   * Helper: Get character width for current paper
   */
  getCharWidth() {
    return this.printerWidth === 58 ? 32 : 48;
  }

  /**
   * Helper: Format line with three columns
   */
  formatLine(col1, col2, col3) {
    const width = this.getCharWidth();
    const col2Width = 5;
    const col3Width = 10;
    const col1Width = width - col2Width - col3Width - 2;

    const c1 = this.truncate(col1, col1Width).padEnd(col1Width);
    const c2 = col2.padStart(col2Width);
    const c3 = col3.padStart(col3Width);

    return `${c1} ${c2} ${c3}`;
  }

  /**
   * Helper: Format total line
   */
  formatTotal(label, value) {
    const width = this.getCharWidth();
    const labelWidth = width - value.length - 1;
    return label.padEnd(labelWidth) + ' ' + value;
  }

  /**
   * Helper: Truncate text
   */
  truncate(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  }

  /**
   * Print bill to thermal printer
   */
  async printThermal(bill, restaurantName) {
    try {
      if (!this.isConnected) {
        throw new Error('Printer not connected');
      }

      const data = this.generateESCPOS(bill, restaurantName);

      if (this.connection.type === 'bluetooth') {
        await this.printBluetooth(data);
      } else if (this.connection.type === 'usb') {
        await this.printUSB(data);
      } else if (this.connection.type === 'serial') {
        await this.printSerial(data);
      }

      console.log('✅ Thermal print successful');
      return true;
    } catch (error) {
      console.error('❌ Thermal print failed:', error);
      throw error;
    }
  }

  /**
   * Print via Bluetooth
   */
  async printBluetooth(data) {
    const service = await this.connection.server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
    const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
    
    // Send data in chunks
    const chunkSize = 20;
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      await characteristic.writeValue(chunk);
    }
  }

  /**
   * Print via USB
   */
  async printUSB(data) {
    await this.connection.device.transferOut(1, data);
  }

  /**
   * Print via Serial
   */
  async printSerial(data) {
    const writer = this.connection.port.writable.getWriter();
    await writer.write(data);
    writer.releaseLock();
  }

  /**
   * Print via web (regular printer) - FIXED VERSION
   */
  async printWeb(bill, restaurantName) {
    try {
      // Just trigger window.print - the PrintBill component handles the rest
      window.print();
      console.log('✅ Web print triggered');
      return true;
    } catch (error) {
      console.error('❌ Web print failed:', error);
      throw error;
    }
  }

  /**
   * Main print function - routes to appropriate method
   */
  async print(bill, restaurantName) {
    try {
      if (this.printerType === 'thermal' && this.isConnected) {
        return await this.printThermal(bill, restaurantName);
      } else {
        return await this.printWeb(bill, restaurantName);
      }
    } catch (error) {
      console.error('❌ Print failed:', error);
      // Fallback to web print
      return await this.printWeb(bill, restaurantName);
    }
  }

  /**
   * Save printer settings to localStorage (simplified)
   */
  async savePrinterSettings(settings) {
    try {
      localStorage.setItem('printerSettings', JSON.stringify(settings));
      // Update instance variables immediately
      this.printerWidth = settings.width || this.printerWidth;
      this.printerType = settings.type || this.printerType;
      console.log('💾 Printer settings saved:', settings);
    } catch (error) {
      console.error('❌ Failed to save printer settings:', error);
    }
  }

  /**
   * Get printer settings from localStorage (simplified)
   */
  async getPrinterSettings() {
    try {
      const settings = localStorage.getItem('printerSettings');
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('❌ Failed to get printer settings:', error);
      return null;
    }
  }

  /**
   * Disconnect printer
   */
  async disconnect() {
    try {
      if (this.connection) {
        if (this.connection.type === 'bluetooth') {
          await this.connection.device.gatt.disconnect();
        } else if (this.connection.type === 'usb') {
          await this.connection.device.close();
        } else if (this.connection.type === 'serial') {
          await this.connection.port.close();
        }
      }

      this.connection = null;
      this.isConnected = false;
      console.log('✅ Printer disconnected');
    } catch (error) {
      console.error('❌ Disconnect failed:', error);
    }
  }
}

// Singleton instance
const thermalPrinter = new ThermalPrinterService();

export default thermalPrinter;