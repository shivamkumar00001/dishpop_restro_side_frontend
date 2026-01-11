import React, { useState, useEffect } from 'react';
import { Printer, Bluetooth, Usb, Wifi, X, Check, Settings } from 'lucide-react';
import thermalPrinter from '../../services/thermalPrinter';

export default function PrinterSettings({ onClose }) {
  const [connecting, setConnecting] = useState(false);
  const [printerType, setPrinterType] = useState('web');
  const [paperWidth, setPaperWidth] = useState(80);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [testPrinting, setTestPrinting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await thermalPrinter.getPrinterSettings();
    if (settings) {
      setPrinterType(settings.type || 'web');
      setPaperWidth(settings.width || 80);
      setDeviceName(settings.deviceName || '');
      setIsConnected(thermalPrinter.isConnected);
    } else {
      // Set defaults
      setPaperWidth(thermalPrinter.printerWidth || 80);
    }
  };

  const handleConnect = async (type) => {
    setConnecting(true);
    try {
      let success = false;
      
      if (type === 'bluetooth') {
        success = await thermalPrinter.connectBluetooth();
      } else if (type === 'usb') {
        success = await thermalPrinter.connectUSB();
      } else if (type === 'serial') {
        success = await thermalPrinter.connectSerial();
      }

      if (success) {
        setPrinterType('thermal');
        setIsConnected(true);
        const settings = await thermalPrinter.getPrinterSettings();
        if (settings?.deviceName) {
          setDeviceName(settings.deviceName);
        }
        alert('✅ Printer connected successfully!');
      } else {
        alert('❌ Failed to connect printer. Please try again.');
      }
    } catch (error) {
      console.error('Printer connection error:', error);
      alert('❌ Failed to connect printer: ' + error.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await thermalPrinter.disconnect();
      setIsConnected(false);
      setDeviceName('');
      alert('✅ Printer disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handlePaperWidthChange = async (width) => {
    console.log('📏 Changing paper width to:', width);
    
    // Update local state
    setPaperWidth(width);
    
    // Update service immediately
    thermalPrinter.printerWidth = width;
    
    // Get current settings
    const currentSettings = await thermalPrinter.getPrinterSettings() || {};
    
    // Save updated settings
    await thermalPrinter.savePrinterSettings({
      ...currentSettings,
      width,
      type: printerType,
    });
    
    console.log('✅ Paper width updated to:', width);
  };

  const handleTestPrint = async () => {
    setTestPrinting(true);
    try {
      const testBill = {
        billNumber: 'TEST-001',
        createdAt: new Date().toISOString(),
        tableNumber: 1,
        customerName: 'Test Customer',
        phoneNumber: '1234567890',
        items: [
          {
            name: 'Test Item 1',
            qty: 2,
            unitPrice: 100,
            totalPrice: 200,
          },
          {
            name: 'Test Item 2',
            qty: 1,
            unitPrice: 150,
            totalPrice: 150,
            variant: { name: 'Large', price: 150 },
          },
        ],
        subtotal: 350,
        discount: 0,
        discountType: 'NONE',
        taxes: [
          { name: 'CGST', rate: 2.5, amount: 8.75 },
          { name: 'SGST', rate: 2.5, amount: 8.75 },
        ],
        serviceCharge: { enabled: false, rate: 0, amount: 0 },
        grandTotal: 368,
        status: 'DRAFT',
      };

      await thermalPrinter.print(testBill, 'Test Restaurant');
      alert('✅ Test print sent successfully!');
    } catch (error) {
      console.error('Test print error:', error);
      alert('❌ Test print failed: ' + error.message);
    } finally {
      setTestPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-xl w-full max-w-md border border-gray-800 animate-slideUp shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-400" />
            Printer Settings
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-800 rounded-lg transition-all hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Current Status */}
          {isConnected && deviceName && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-semibold">Connected</p>
                    <p className="text-xs opacity-75">{deviceName}</p>
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}

          {/* Paper Width */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Paper Width (Current: {paperWidth}mm)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePaperWidthChange(58)}
                disabled={connecting}
                className={`px-4 py-2.5 rounded-lg border transition-all ${
                  paperWidth === 58
                    ? 'bg-cyan-500 text-black border-cyan-500 font-semibold scale-105'
                    : 'bg-gray-800 border-gray-700 hover:border-cyan-500 text-gray-300'
                }`}
              >
                58mm
              </button>
              <button
                onClick={() => handlePaperWidthChange(80)}
                disabled={connecting}
                className={`px-4 py-2.5 rounded-lg border transition-all ${
                  paperWidth === 80
                    ? 'bg-cyan-500 text-black border-cyan-500 font-semibold scale-105'
                    : 'bg-gray-800 border-gray-700 hover:border-cyan-500 text-gray-300'
                }`}
              >
                80mm
              </button>
            </div>
          </div>

          {/* Connection Type */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Printer Connection
            </label>
            <div className="space-y-2">
              <button
                onClick={() => handleConnect('bluetooth')}
                disabled={connecting || isConnected}
                className="w-full px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Bluetooth className="w-5 h-5" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm">Bluetooth Printer</p>
                  <p className="text-xs opacity-75">Wireless thermal printer</p>
                </div>
              </button>

              <button
                onClick={() => handleConnect('usb')}
                disabled={connecting || isConnected}
                className="w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Usb className="w-5 h-5" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm">USB Printer</p>
                  <p className="text-xs opacity-75">Wired thermal printer</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setPrinterType('web');
                  setIsConnected(false);
                }}
                className="w-full px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg flex items-center gap-3 transition-all"
              >
                <Wifi className="w-5 h-5" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm">Web Print</p>
                  <p className="text-xs opacity-75">Regular printer (default)</p>
                </div>
              </button>
            </div>
          </div>

          {/* Test Print */}
          <div>
            <button
              onClick={handleTestPrint}
              disabled={testPrinting}
              className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              {testPrinting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Printing...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>Test Print</span>
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Settings className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-400">
                <p className="font-semibold text-cyan-400 mb-1">Requirements:</p>
                <ul className="space-y-1">
                  <li>• HTTPS required for Bluetooth/USB</li>
                  <li>• Chrome/Edge browsers only</li>
                  <li>• Enable printer permissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}