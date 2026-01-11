import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, Database, Check } from 'lucide-react';
import offlineDB from '../../services/offlineDB';
import syncService from '../../services/syncService';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Online/offline listeners
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync service listener
    const unsubscribe = syncService.addListener((event) => {
      if (event.event === 'sync_started') {
        setSyncing(true);
      } else if (event.event === 'sync_completed') {
        setSyncing(false);
        setLastSyncTime(new Date());
        checkPendingItems();
      } else if (event.event === 'sync_failed') {
        setSyncing(false);
      }
    });

    // Check pending items periodically
    checkPendingItems();
    const interval = setInterval(checkPendingItems, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const checkPendingItems = async () => {
    try {
      const pending = await offlineDB.getPendingSyncItems();
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Failed to check pending items:', error);
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      await syncService.forceSyncNow();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Hide if online and fully synced
  if (isOnline && pendingCount === 0 && !syncing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideInRight">
      <div
        className={`px-4 py-3 rounded-lg border backdrop-blur-sm shadow-2xl flex items-center gap-3 min-w-[280px] ${
          isOnline
            ? syncing
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}
      >
        {isOnline ? (
          syncing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Syncing...</p>
                <p className="text-xs opacity-75">{pendingCount} items remaining</p>
              </div>
            </>
          ) : (
            <>
              <Database className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {pendingCount} item{pendingCount !== 1 ? 's' : ''} pending
                </p>
                {lastSyncTime && (
                  <p className="text-xs opacity-75">
                    Last sync: {lastSyncTime.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <button
                onClick={handleSyncNow}
                className="p-2 hover:bg-yellow-500/20 rounded-lg transition-all"
                title="Sync now"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )
        ) : (
          <>
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Offline Mode</p>
              <p className="text-xs opacity-75">
                {pendingCount} pending • Will sync when online
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}