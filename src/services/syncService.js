/**
 * Sync Service - Background synchronization engine
 * Handles automatic syncing of offline data when connection is restored
 */

import offlineDB from './offlineDB';

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.syncInProgress = false;
    this.listeners = [];
    this.retryAttempts = {};
    this.maxRetries = 5;
    this.baseDelay = 1000; // 1 second
    
    this.initializeListeners();
  }

  /**
   * Initialize network listeners
   */
  initializeListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 Connection restored - starting sync');
      this.sync();
    });

    // Periodic sync check (every 5 minutes)
    setInterval(() => {
      if (navigator.onLine && !this.syncInProgress) {
        this.sync();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Add sync listener
   */
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback({ event, data });
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  /**
   * Main sync function
   */
  async sync() {
    if (this.syncInProgress) {
      console.log('⏳ Sync already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('📴 Offline - skipping sync');
      return;
    }

    this.syncInProgress = true;
    this.notifyListeners('sync_started', { timestamp: Date.now() });

    try {
      const pendingItems = await offlineDB.getPendingSyncItems();
      
      if (pendingItems.length === 0) {
        console.log('✅ No items to sync');
        this.syncInProgress = false;
        return;
      }

      console.log(`🔄 Syncing ${pendingItems.length} items...`);
      let successCount = 0;
      let failCount = 0;

      for (const item of pendingItems) {
        try {
          const success = await this.syncItem(item);
          if (success) {
            successCount++;
            this.notifyListeners('item_synced', { item, success: true });
          } else {
            failCount++;
            this.notifyListeners('item_synced', { item, success: false });
          }
        } catch (error) {
          console.error('Failed to sync item:', item.id, error);
          failCount++;
          this.notifyListeners('item_failed', { item, error });
          
          // Retry logic with exponential backoff
          await this.handleRetry(item);
        }
      }

      console.log(`✅ Sync complete: ${successCount} success, ${failCount} failed`);
      this.notifyListeners('sync_completed', { 
        successCount, 
        failCount,
        total: pendingItems.length 
      });

    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.notifyListeners('sync_failed', { error });
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync individual item
   */
  async syncItem(item) {
    const { action, data, billId } = item;
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
      console.error('Missing authentication');
      return false;
    }

    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    let endpoint = '';
    let method = 'POST';
    let body = data;

    // Map actions to API endpoints
    switch (action) {
      case 'CREATE_BILL':
        endpoint = `/api/v1/restaurants/${username}/bills/create`;
        method = 'POST';
        break;
      
      case 'UPDATE_BILL':
        endpoint = `/api/v1/restaurants/${username}/bills/${billId}/charges`;
        method = 'PATCH';
        break;
      
      case 'DELETE_BILL':
        endpoint = `/api/v1/restaurants/${username}/bills/${billId}`;
        method = 'DELETE';
        break;
      
      case 'FINALIZE_BILL':
        endpoint = `/api/v1/restaurants/${username}/bills/${billId}/finalize`;
        method = 'POST';
        break;
      
      default:
        console.warn('Unknown action:', action);
        return false;
    }

    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: method !== 'DELETE' ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Mark as completed
        await offlineDB.markSyncItemCompleted(item.id);
        
        // Update local bill with server data
        if (billId && result.data) {
          await offlineDB.saveBill({
            ...result.data,
            syncStatus: 'synced',
          });
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Sync failed for ${action}:`, error);
      throw error;
    }
  }

  /**
   * Handle retry with exponential backoff
   */
  async handleRetry(item) {
    const retryCount = this.retryAttempts[item.id] || 0;
    
    if (retryCount >= this.maxRetries) {
      console.error(`Max retries reached for item ${item.id}`);
      // Mark as failed permanently
      await offlineDB.db.transaction('syncQueue', 'readwrite')
        .objectStore('syncQueue')
        .put({
          ...item,
          status: 'failed',
          retryCount: retryCount,
          lastError: 'Max retries exceeded',
        });
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    const delay = this.baseDelay * Math.pow(2, retryCount);
    console.log(`⏳ Retrying item ${item.id} in ${delay}ms (attempt ${retryCount + 1})`);
    
    this.retryAttempts[item.id] = retryCount + 1;
    
    setTimeout(() => {
      this.syncItem(item);
    }, delay);
  }

  /**
   * Force sync now
   */
  async forceSyncNow() {
    console.log('🔄 Force sync triggered');
    return this.sync();
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    const pendingItems = await offlineDB.getPendingSyncItems();
    return {
      isSyncing: this.syncInProgress,
      pendingCount: pendingItems.length,
      isOnline: navigator.onLine,
    };
  }

  /**
   * Clear retry attempts
   */
  clearRetries() {
    this.retryAttempts = {};
  }
}

// Singleton instance
const syncService = new SyncService();

export default syncService;