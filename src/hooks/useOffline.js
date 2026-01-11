import { useState, useEffect } from 'react';
import offlineDB from '../services/offlineDB';
import syncService from '../services/syncService';

/**
 * Custom hook for offline state management
 * @returns {Object} Offline state and utilities
 */
export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Initialize
    checkPendingSync();

    // Online/offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      syncService.forceSyncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync service listeners
    const unsubscribe = syncService.addListener((event) => {
      if (event.event === 'sync_started') {
        setIsSyncing(true);
      } else if (event.event === 'sync_completed') {
        setIsSyncing(false);
        setLastSyncTime(new Date());
        checkPendingSync();
      } else if (event.event === 'sync_failed') {
        setIsSyncing(false);
      } else if (event.event === 'item_synced') {
        checkPendingSync();
      }
    });

    // Periodic check
    const interval = setInterval(checkPendingSync, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const checkPendingSync = async () => {
    try {
      const pending = await offlineDB.getPendingSyncItems();
      setPendingSyncCount(pending.length);
    } catch (error) {
      console.error('Failed to check pending sync:', error);
    }
  };

  const forceSync = async () => {
    if (!isOnline) {
      throw new Error('Cannot sync while offline');
    }
    return syncService.forceSyncNow();
  };

  return {
    isOnline,
    pendingSyncCount,
    isSyncing,
    lastSyncTime,
    forceSync,
    checkPendingSync,
  };
}

export default useOffline;