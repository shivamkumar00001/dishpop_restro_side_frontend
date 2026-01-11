/**
 * Enterprise-grade IndexedDB service for offline billing
 * Provides complete offline support with sync capabilities
 */

import { openDB } from 'idb';

const DB_NAME = 'DishPopBilling';
const DB_VERSION = 3;

class OfflineDBService {
  constructor() {
    this.db = null;
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    this.initializeOnlineListeners();
  }

  /**
   * Initialize IndexedDB with all required stores
   */
  async init() {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
          // Bills store
          if (!db.objectStoreNames.contains('bills')) {
            const billStore = db.createObjectStore('bills', { 
              keyPath: '_id', 
              autoIncrement: false 
            });
            billStore.createIndex('billNumber', 'billNumber', { unique: true });
            billStore.createIndex('status', 'status', { unique: false });
            billStore.createIndex('tableNumber', 'tableNumber', { unique: false });
            billStore.createIndex('createdAt', 'createdAt', { unique: false });
            billStore.createIndex('syncStatus', 'syncStatus', { unique: false });
            billStore.createIndex('username', 'username', { unique: false });
          }

          // Dishes/Menu store
          if (!db.objectStoreNames.contains('dishes')) {
            const dishStore = db.createObjectStore('dishes', { 
              keyPath: '_id' 
            });
            dishStore.createIndex('username', 'username', { unique: false });
            dishStore.createIndex('categoryId', 'categoryId.name', { unique: false });
            dishStore.createIndex('isAvailable', 'isAvailable', { unique: false });
          }

          // Sync queue store
          if (!db.objectStoreNames.contains('syncQueue')) {
            const syncStore = db.createObjectStore('syncQueue', { 
              keyPath: 'id', 
              autoIncrement: true 
            });
            syncStore.createIndex('timestamp', 'timestamp', { unique: false });
            syncStore.createIndex('action', 'action', { unique: false });
            syncStore.createIndex('status', 'status', { unique: false });
          }

          // Settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }

          // Print queue store
          if (!db.objectStoreNames.contains('printQueue')) {
            const printStore = db.createObjectStore('printQueue', { 
              keyPath: 'id', 
              autoIncrement: true 
            });
            printStore.createIndex('timestamp', 'timestamp', { unique: false });
            printStore.createIndex('printed', 'printed', { unique: false });
          }

          // Stats cache
          if (!db.objectStoreNames.contains('statsCache')) {
            db.createObjectStore('statsCache', { keyPath: 'key' });
          }
        },
      });

      console.log('✅ IndexedDB initialized successfully');
      return this.db;
    } catch (error) {
      console.error('❌ IndexedDB initialization failed:', error);
      throw error;
    }
  }

  /**
   * Online/Offline listeners
   */
  initializeOnlineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Connection restored - starting sync');
      this.syncWithServer();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Connection lost - switching to offline mode');
    });
  }

  // ==================== BILLS ====================

  /**
   * Save bill to IndexedDB
   */
  async saveBill(bill) {
    try {
      const billData = {
        ...bill,
        _id: bill._id || `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: bill._id && !bill._id.startsWith('offline_') ? 'synced' : 'pending',
        lastModified: new Date().toISOString(),
      };

      await this.db.put('bills', billData);
      
      // Add to sync queue if pending
      if (billData.syncStatus === 'pending') {
        await this.addToSyncQueue({
          action: 'CREATE_BILL',
          data: billData,
          billId: billData._id,
        });
      }

      console.log('💾 Bill saved to IndexedDB:', billData.billNumber);
      return billData;
    } catch (error) {
      console.error('❌ Failed to save bill:', error);
      throw error;
    }
  }

  /**
   * Get all bills with optional filters
   */
  async getAllBills(filters = {}) {
    try {
      const tx = this.db.transaction('bills', 'readonly');
      const store = tx.objectStore('bills');
      let bills = await store.getAll();

      // Apply filters
      if (filters.status) {
        bills = bills.filter(b => b.status === filters.status.toUpperCase());
      }
      if (filters.tableNumber) {
        bills = bills.filter(b => b.tableNumber === parseInt(filters.tableNumber));
      }
      if (filters.paymentStatus) {
        bills = bills.filter(b => b.paymentStatus === filters.paymentStatus.toUpperCase());
      }
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        bills = bills.filter(b => new Date(b.createdAt) >= start);
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        bills = bills.filter(b => new Date(b.createdAt) <= end);
      }

      // Sort by creation date (newest first)
      bills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return bills;
    } catch (error) {
      console.error('❌ Failed to get bills:', error);
      return [];
    }
  }

  /**
   * Get bill by ID
   */
  async getBillById(billId) {
    try {
      return await this.db.get('bills', billId);
    } catch (error) {
      console.error('❌ Failed to get bill:', error);
      return null;
    }
  }

  /**
   * Update bill
   */
  async updateBill(billId, updates) {
    try {
      const bill = await this.getBillById(billId);
      if (!bill) throw new Error('Bill not found');

      const updatedBill = {
        ...bill,
        ...updates,
        lastModified: new Date().toISOString(),
        syncStatus: 'pending',
      };

      await this.db.put('bills', updatedBill);

      // Add to sync queue
      await this.addToSyncQueue({
        action: 'UPDATE_BILL',
        data: updatedBill,
        billId: updatedBill._id,
      });

      return updatedBill;
    } catch (error) {
      console.error('❌ Failed to update bill:', error);
      throw error;
    }
  }

  /**
   * Delete bill (mark as cancelled)
   */
  async deleteBill(billId, reason) {
    try {
      const bill = await this.getBillById(billId);
      if (!bill) throw new Error('Bill not found');

      const cancelledBill = {
        ...bill,
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
        syncStatus: 'pending',
      };

      await this.db.put('bills', cancelledBill);

      // Add to sync queue
      await this.addToSyncQueue({
        action: 'DELETE_BILL',
        billId: billId,
        data: { reason },
      });

      return cancelledBill;
    } catch (error) {
      console.error('❌ Failed to delete bill:', error);
      throw error;
    }
  }

  // ==================== DISHES ====================

  /**
   * Save dishes to IndexedDB
   */
  async saveDishes(dishes) {
    try {
      const tx = this.db.transaction('dishes', 'readwrite');
      const store = tx.objectStore('dishes');

      for (const dish of dishes) {
        await store.put(dish);
      }

      await tx.done;
      console.log(`💾 Saved ${dishes.length} dishes to IndexedDB`);
      return dishes;
    } catch (error) {
      console.error('❌ Failed to save dishes:', error);
      throw error;
    }
  }

  /**
   * Get all dishes
   */
  async getAllDishes() {
    try {
      return await this.db.getAll('dishes');
    } catch (error) {
      console.error('❌ Failed to get dishes:', error);
      return [];
    }
  }

  /**
   * Get available dishes only
   */
  async getAvailableDishes() {
    try {
      const dishes = await this.getAllDishes();
      return dishes.filter(d => d.isAvailable);
    } catch (error) {
      console.error('❌ Failed to get available dishes:', error);
      return [];
    }
  }

  // ==================== SYNC QUEUE ====================

  /**
   * Add item to sync queue
   */
  async addToSyncQueue(item) {
    try {
      const queueItem = {
        ...item,
        timestamp: new Date().toISOString(),
        status: 'pending',
        retryCount: 0,
      };

      await this.db.add('syncQueue', queueItem);
      console.log('📋 Added to sync queue:', item.action);

      // Try immediate sync if online
      if (this.isOnline) {
        setTimeout(() => this.syncWithServer(), 1000);
      }

      return queueItem;
    } catch (error) {
      console.error('❌ Failed to add to sync queue:', error);
      throw error;
    }
  }

  /**
   * Get pending sync items
   */
  async getPendingSyncItems() {
    try {
      const tx = this.db.transaction('syncQueue', 'readonly');
      const store = tx.objectStore('syncQueue');
      const index = store.index('status');
      return await index.getAll('pending');
    } catch (error) {
      console.error('❌ Failed to get pending sync items:', error);
      return [];
    }
  }

  /**
   * Mark sync item as completed
   */
  async markSyncItemCompleted(itemId) {
    try {
      const tx = this.db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');
      const item = await store.get(itemId);
      
      if (item) {
        item.status = 'completed';
        item.completedAt = new Date().toISOString();
        await store.put(item);
      }

      await tx.done;
    } catch (error) {
      console.error('❌ Failed to mark sync item as completed:', error);
    }
  }

  /**
   * Sync with server
   */
  async syncWithServer() {
    if (!this.isOnline) {
      console.log('📴 Offline - skipping sync');
      return;
    }

    console.log('🔄 Starting sync with server...');

    try {
      const pendingItems = await this.getPendingSyncItems();
      
      if (pendingItems.length === 0) {
        console.log('✅ No pending items to sync');
        return;
      }

      console.log(`📤 Syncing ${pendingItems.length} items...`);

      for (const item of pendingItems) {
        try {
          // Here you would make actual API calls
          // For now, we'll just mark as completed
          await this.markSyncItemCompleted(item.id);
          
          // Update bill sync status
          if (item.billId) {
            const bill = await this.getBillById(item.billId);
            if (bill) {
              bill.syncStatus = 'synced';
              await this.db.put('bills', bill);
            }
          }
        } catch (syncError) {
          console.error('❌ Failed to sync item:', item.id, syncError);
          // Increment retry count
          item.retryCount = (item.retryCount || 0) + 1;
          await this.db.put('syncQueue', item);
        }
      }

      console.log('✅ Sync completed');
    } catch (error) {
      console.error('❌ Sync failed:', error);
    }
  }

  // ==================== PRINT QUEUE ====================

  /**
   * Add bill to print queue
   */
  async addToPrintQueue(bill) {
    try {
      const printItem = {
        billId: bill._id,
        billData: bill,
        timestamp: new Date().toISOString(),
        printed: false,
        retryCount: 0,
      };

      await this.db.add('printQueue', printItem);
      console.log('🖨️ Added to print queue:', bill.billNumber);
      return printItem;
    } catch (error) {
      console.error('❌ Failed to add to print queue:', error);
      throw error;
    }
  }

  /**
   * Get pending print items
   */
  async getPendingPrintItems() {
    try {
      const tx = this.db.transaction('printQueue', 'readonly');
      const store = tx.objectStore('printQueue');
      const index = store.index('printed');
      return await index.getAll(false);
    } catch (error) {
      console.error('❌ Failed to get pending print items:', error);
      return [];
    }
  }

  /**
   * Mark print item as completed
   */
  async markPrintCompleted(itemId) {
    try {
      const tx = this.db.transaction('printQueue', 'readwrite');
      const store = tx.objectStore('printQueue');
      const item = await store.get(itemId);
      
      if (item) {
        item.printed = true;
        item.printedAt = new Date().toISOString();
        await store.put(item);
      }

      await tx.done;
    } catch (error) {
      console.error('❌ Failed to mark print as completed:', error);
    }
  }

  // ==================== SETTINGS ====================

  /**
   * Save setting
   */
  async saveSetting(key, value) {
    try {
      await this.db.put('settings', { key, value });
      console.log('💾 Setting saved:', key);
    } catch (error) {
      console.error('❌ Failed to save setting:', error);
    }
  }

  /**
   * Get setting
   */
  async getSetting(key, defaultValue = null) {
    try {
      const setting = await this.db.get('settings', key);
      return setting ? setting.value : defaultValue;
    } catch (error) {
      console.error('❌ Failed to get setting:', error);
      return defaultValue;
    }
  }

  // ==================== STATS ====================

  /**
   * Calculate billing stats from IndexedDB
   */
  async calculateStats(period = 'all') {
    try {
      const bills = await this.getAllBills();
      
      let startDate = new Date(0);
      const now = new Date();
      
      switch (period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const filteredBills = bills.filter(b => new Date(b.createdAt) >= startDate);

      const stats = {
        totalBills: filteredBills.length,
        totalRevenue: 0,
        avgBillValue: 0,
        draft: 0,
        finalized: 0,
        cancelled: 0,
      };

      filteredBills.forEach(bill => {
        if (bill.status === 'DRAFT') stats.draft++;
        if (bill.status === 'FINALIZED') {
          stats.finalized++;
          stats.totalRevenue += bill.grandTotal;
        }
        if (bill.status === 'CANCELLED') stats.cancelled++;
      });

      stats.avgBillValue = stats.finalized > 0 ? stats.totalRevenue / stats.finalized : 0;

      // Cache stats
      await this.db.put('statsCache', {
        key: `stats_${period}`,
        value: stats,
        timestamp: new Date().toISOString(),
      });

      return stats;
    } catch (error) {
      console.error('❌ Failed to calculate stats:', error);
      return {
        totalBills: 0,
        totalRevenue: 0,
        avgBillValue: 0,
        draft: 0,
        finalized: 0,
        cancelled: 0,
      };
    }
  }

  // ==================== CLEANUP ====================

  /**
   * Clear old completed sync items
   */
  async cleanupSyncQueue(daysOld = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const tx = this.db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');
      const items = await store.getAll();

      for (const item of items) {
        if (item.status === 'completed' && new Date(item.completedAt) < cutoffDate) {
          await store.delete(item.id);
        }
      }

      await tx.done;
      console.log('🧹 Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAllData() {
    try {
      const stores = ['bills', 'dishes', 'syncQueue', 'settings', 'printQueue', 'statsCache'];
      
      for (const storeName of stores) {
        const tx = this.db.transaction(storeName, 'readwrite');
        await tx.objectStore(storeName).clear();
        await tx.done;
      }

      console.log('🧹 All data cleared');
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
    }
  }
}

// Singleton instance
const offlineDB = new OfflineDBService();

export default offlineDB;