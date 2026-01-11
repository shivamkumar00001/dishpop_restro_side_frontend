import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Database,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import offlineDB from '../../services/offlineDB';
import syncService from '../../services/syncService';

export default function SyncStatus() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [syncData, setSyncData] = useState({
    pending: [],
    completed: [],
    failed: [],
  });
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    loadSyncData();

    // Listen to sync events
    const unsubscribe = syncService.addListener((event) => {
      if (event.event === 'sync_started') {
        setSyncing(true);
      } else if (event.event === 'sync_completed') {
        setSyncing(false);
        setLastSync(new Date());
        loadSyncData();
      } else if (event.event === 'sync_failed') {
        setSyncing(false);
      } else if (event.event === 'item_synced') {
        loadSyncData();
      }
    });

    // Periodic refresh
    const interval = setInterval(loadSyncData, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const loadSyncData = async () => {
    try {
      const db = await offlineDB.db;
      const tx = db.transaction('syncQueue', 'readonly');
      const store = tx.objectStore('syncQueue');
      const allItems = await store.getAll();

      const pending = allItems.filter(item => item.status === 'pending');
      const completed = allItems.filter(item => item.status === 'completed');
      const failed = allItems.filter(item => item.status === 'failed');

      setSyncData({ pending, completed, failed });
    } catch (error) {
      console.error('Failed to load sync data:', error);
    }
  };

  const handleForceSync = async () => {
    try {
      setSyncing(true);
      await syncService.forceSyncNow();
    } catch (error) {
      console.error('Force sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleRetryFailed = async () => {
    try {
      const db = await offlineDB.db;
      const tx = db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');

      for (const item of syncData.failed) {
        await store.put({
          ...item,
          status: 'pending',
          retryCount: 0,
        });
      }

      await tx.done;
      loadSyncData();
      handleForceSync();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const db = await offlineDB.db;
      const tx = db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');

      for (const item of syncData.completed) {
        await store.delete(item.id);
      }

      await tx.done;
      loadSyncData();
    } catch (error) {
      console.error('Clear completed failed:', error);
    }
  };

  if (!isExpanded && syncData.pending.length === 0 && syncData.failed.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 w-96 animate-slideInRight">
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Sync Status</h3>
              <p className="text-xs text-gray-400">
                {syncData.pending.length} pending • {syncData.completed.length} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {syncing && (
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
            )}
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-800">
            {/* Last Sync */}
            {lastSync && (
              <div className="px-4 py-2 bg-gray-800/30 text-xs text-gray-400 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>Last sync: {lastSync.toLocaleTimeString()}</span>
              </div>
            )}

            {/* Pending Items */}
            {syncData.pending.length > 0 && (
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" />
                    Pending ({syncData.pending.length})
                  </h4>
                  <button
                    onClick={handleForceSync}
                    disabled={syncing}
                    className="text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                  >
                    Sync Now
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {syncData.pending.map((item) => (
                    <SyncItem key={item.id} item={item} type="pending" />
                  ))}
                </div>
              </div>
            )}

            {/* Failed Items */}
            {syncData.failed.length > 0 && (
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-red-400 uppercase flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Failed ({syncData.failed.length})
                  </h4>
                  <button
                    onClick={handleRetryFailed}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Retry All
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {syncData.failed.map((item) => (
                    <SyncItem key={item.id} item={item} type="failed" />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Items */}
            {syncData.completed.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-green-400 uppercase flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    Completed ({syncData.completed.length})
                  </h4>
                  <button
                    onClick={handleClearCompleted}
                    className="text-xs text-gray-400 hover:text-gray-300"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {syncData.completed.slice(0, 5).map((item) => (
                    <SyncItem key={item.id} item={item} type="completed" />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {syncData.pending.length === 0 && 
             syncData.failed.length === 0 && 
             syncData.completed.length === 0 && (
              <div className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">All Synced!</p>
                <p className="text-xs text-gray-400">No pending items</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SyncItem({ item, type }) {
  const getIcon = () => {
    switch (type) {
      case 'pending':
        return <RefreshCw className="w-3 h-3 text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getActionLabel = () => {
    switch (item.action) {
      case 'CREATE_BILL':
        return 'Create Bill';
      case 'UPDATE_BILL':
        return 'Update Bill';
      case 'DELETE_BILL':
        return 'Delete Bill';
      case 'FINALIZE_BILL':
        return 'Finalize Bill';
      default:
        return item.action;
    }
  };

  return (
    <div className={`p-2 rounded-lg border text-xs ${
      type === 'pending' 
        ? 'bg-yellow-500/5 border-yellow-500/20'
        : type === 'failed'
        ? 'bg-red-500/5 border-red-500/20'
        : 'bg-green-500/5 border-green-500/20'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{getActionLabel()}</p>
            <p className="text-gray-500 text-[10px]">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        {item.retryCount > 0 && (
          <span className="text-[10px] text-gray-500">
            Retry: {item.retryCount}
          </span>
        )}
      </div>
      {item.lastError && (
        <p className="text-[10px] text-red-400 mt-1 truncate">
          {item.lastError}
        </p>
      )}
    </div>
  );
}