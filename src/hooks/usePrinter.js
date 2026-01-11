import { useState, useEffect } from 'react';
import thermalPrinter from '../services/thermalPrinter';

/**
 * Custom hook for printer management
 * @returns {Object} Printer state and utilities
 */
export function usePrinter() {
  const [isConnected, setIsConnected] = useState(false);
  const [printerType, setPrinterType] = useState('web');
  const [paperWidth, setPaperWidth] = useState(80);
  const [deviceName, setDeviceName] = useState('');

  useEffect(() => {
    loadPrinterSettings();
  }, []);

  const loadPrinterSettings = async () => {
    try {
      await thermalPrinter.initializePrinter();
      const settings = await thermalPrinter.getPrinterSettings();
      
      if (settings) {
        setPrinterType(settings.type || 'web');
        setPaperWidth(settings.width || 80);
        setDeviceName(settings.deviceName || '');
        setIsConnected(thermalPrinter.isConnected);
      }
    } catch (error) {
      console.error('Failed to load printer settings:', error);
    }
  };

  const connectBluetooth = async () => {
    try {
      const success = await thermalPrinter.connectBluetooth();
      if (success) {
        setIsConnected(true);
        setPrinterType('thermal');
        await loadPrinterSettings();
      }
      return success;
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      throw error;
    }
  };

  const connectUSB = async () => {
    try {
      const success = await thermalPrinter.connectUSB();
      if (success) {
        setIsConnected(true);
        setPrinterType('thermal');
        await loadPrinterSettings();
      }
      return success;
    } catch (error) {
      console.error('USB connection failed:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await thermalPrinter.disconnect();
      setIsConnected(false);
      setDeviceName('');
    } catch (error) {
      console.error('Disconnect failed:', error);
      throw error;
    }
  };

  const print = async (bill, restaurantName) => {
    try {
      return await thermalPrinter.print(bill, restaurantName);
    } catch (error) {
      console.error('Print failed:', error);
      throw error;
    }
  };

  const setPaperSize = async (width) => {
    try {
      setPaperWidth(width);
      thermalPrinter.printerWidth = width;
      
      const settings = await thermalPrinter.getPrinterSettings();
      await thermalPrinter.savePrinterSettings({
        ...settings,
        width,
      });
    } catch (error) {
      console.error('Failed to set paper size:', error);
      throw error;
    }
  };

  return {
    isConnected,
    printerType,
    paperWidth,
    deviceName,
    connectBluetooth,
    connectUSB,
    disconnect,
    print,
    setPaperSize,
    reload: loadPrinterSettings,
  };
}

export default usePrinter;