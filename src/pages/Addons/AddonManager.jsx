import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  FolderPlus, 
  X, 
  Search,
  ArrowLeft,
  Package,
  Layers,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Settings
} from "lucide-react";
import addonApi from "../../api/addOnApi";

export default function AddonsPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  
  // Add-on Groups
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupRequired, setGroupRequired] = useState(false);
  const [groupMin, setGroupMin] = useState(0);
  const [groupMax, setGroupMax] = useState(1);
  const [creatingGroup, setCreatingGroup] = useState(false);
  
  // Individual Add-ons
  const [addons, setAddons] = useState([]);
  const [addonName, setAddonName] = useState("");
  const [addonPrice, setAddonPrice] = useState("");
  const [creatingAddon, setCreatingAddon] = useState(false);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePanel, setActivePanel] = useState("addons"); // "addons" | "groups"
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [toast, setToast] = useState(null);

  // Toast helper
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load data
  useEffect(() => {
    loadData();
  }, [username]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('addon-name-input')?.focus();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        document.getElementById('group-name-input')?.focus();
      }

      if (e.key === 'Escape' && searchTerm) {
        setSearchTerm("");
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [groupsRes, addonsRes] = await Promise.all([
        addonApi.getGroups(username),
        addonApi.getAddons(username),
      ]);

      setGroups(groupsRes.data?.data || []);
      setAddons(addonsRes.data?.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      showToast("Failed to load add-ons", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filtered addons based on search
  const filteredAddons = useMemo(() => {
    if (!searchTerm) return addons;
    const search = searchTerm.toLowerCase();
    return addons.filter(addon => 
      addon.name.toLowerCase().includes(search) ||
      addon.price.toString().includes(search)
    );
  }, [addons, searchTerm]);

  // Filtered groups based on search
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;
    const search = searchTerm.toLowerCase();
    return groups.filter(group => 
      group.name.toLowerCase().includes(search)
    );
  }, [groups, searchTerm]);

  // Stats
  const stats = useMemo(() => ({
    totalAddons: addons.length,
    totalGroups: groups.length,
    avgPrice: addons.length > 0 
      ? (addons.reduce((sum, a) => sum + (a.price || 0), 0) / addons.length).toFixed(0)
      : 0,
    groupedAddons: groups.reduce((sum, g) => sum + (g.addOns?.length || 0), 0),
  }), [addons, groups]);

  // Create Add-on Group
  const createGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      showToast("Group name is required", "error");
      return;
    }

    setCreatingGroup(true);

    try {
      const response = await addonApi.createGroup(username, {
        name: groupName.trim(),
        required: groupRequired,
        minSelection: groupMin,
        maxSelection: groupMax,
        addOns: [],
      });

      setGroups((prev) => [...prev, response.data.data]);

      setGroupName("");
      setGroupRequired(false);
      setGroupMin(0);
      setGroupMax(1);

      showToast("Add-on group created successfully!", "success");
    } catch (error) {
      console.error("Create group error:", error);
      showToast(error.response?.data?.message || "Failed to create group", "error");
    } finally {
      setCreatingGroup(false);
    }
  };

  // Create Individual Add-on
  const createAddon = async (e) => {
    e.preventDefault();

    if (!addonName.trim() || !addonPrice) {
      showToast("Name and price are required", "error");
      return;
    }

    if (parseFloat(addonPrice) < 0) {
      showToast("Price must be positive", "error");
      return;
    }

    setCreatingAddon(true);

    try {
      const response = await addonApi.createAddon(username, {
        name: addonName.trim(),
        price: parseFloat(addonPrice),
      });

      setAddons((prev) => [...prev, response.data.data]);

      setAddonName("");
      setAddonPrice("");

      showToast("Add-on created successfully!", "success");
      
      setTimeout(() => {
        document.getElementById('addon-name-input')?.focus();
      }, 100);
    } catch (error) {
      console.error("Create add-on error:", error);
      showToast(error.response?.data?.message || "Failed to create add-on", "error");
    } finally {
      setCreatingAddon(false);
    }
  };

  // Delete Add-on
  const deleteAddon = async (addonId) => {
    if (!window.confirm("Delete this add-on? It will be removed from all groups.")) return;

    try {
      await addonApi.deleteAddon(username, addonId);
      
      setAddons((prev) => prev.filter((a) => a._id !== addonId));
      
      setGroups((prev) => 
        prev.map(g => ({
          ...g,
          addOns: g.addOns?.filter(a => (a._id || a) !== addonId) || []
        }))
      );
      
      showToast("Add-on deleted successfully", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete", "error");
    }
  };

  // Delete Group
  const deleteGroup = async (groupId) => {
    if (!window.confirm("Delete this group? Add-ons will not be deleted.")) return;

    try {
      await addonApi.deleteGroup(username, groupId);
      
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      
      showToast("Group deleted successfully", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete", "error");
    }
  };

  // Add add-on to group
  const addToGroup = async (groupId, addonId) => {
    try {
      const group = groups.find((g) => g._id === groupId);
      const currentAddons = group.addOns?.map((a) => a._id || a) || [];

      if (currentAddons.includes(addonId)) {
        showToast("Add-on already in this group", "error");
        return;
      }

      const response = await addonApi.updateGroup(username, groupId, {
        addOns: [...currentAddons, addonId],
      });

      setGroups((prev) =>
        prev.map((g) =>
          g._id === groupId ? response.data.data : g
        )
      );

      showToast("Add-on added to group!", "success");
    } catch (error) {
      console.error("Add to group error:", error);
      showToast(error.response?.data?.message || "Failed to add to group", "error");
    }
  };

  // Remove add-on from group
  const removeFromGroup = async (groupId, addonId) => {
    if (!window.confirm("Remove this add-on from the group?")) return;

    try {
      const group = groups.find((g) => g._id === groupId);
      const currentAddons = group.addOns?.map((a) => a._id || a) || [];
      const updatedAddons = currentAddons.filter((id) => id !== addonId);

      const response = await addonApi.updateGroup(username, groupId, {
        addOns: updatedAddons,
      });

      setGroups((prev) =>
        prev.map((g) =>
          g._id === groupId ? response.data.data : g
        )
      );

      showToast("Add-on removed from group", "success");
    } catch (error) {
      console.error("Remove from group error:", error);
      showToast(error.response?.data?.message || "Failed to remove", "error");
    }
  };

  // Toggle group expansion
  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading add-ons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* TOP HEADER BAR */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add-ons Manager</h1>
              <p className="text-xs text-gray-500">Manage add-ons and organize into groups</p>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="flex items-center gap-6 ml-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Add-ons</p>
                <p className="text-sm font-bold text-gray-900">{stats.totalAddons}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                <Layers className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Groups</p>
                <p className="text-sm font-bold text-gray-900">{stats.totalGroups}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Price</p>
                <p className="text-sm font-bold text-purple-600">₹{stats.avgPrice}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Panel Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActivePanel("addons")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                activePanel === "addons"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Add-ons
            </button>
            <button
              onClick={() => setActivePanel("groups")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                activePanel === "groups"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Groups
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - CREATE FORMS */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" />
              Create New
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* CREATE ADD-ON FORM */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Add-on
              </h3>

              <form onSubmit={createAddon} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Name *
                  </label>
                  <input
                    id="addon-name-input"
                    type="text"
                    value={addonName}
                    onChange={(e) => setAddonName(e.target.value)}
                    placeholder="e.g., Extra Cheese"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addonPrice}
                    onChange={(e) => setAddonPrice(e.target.value)}
                    placeholder="e.g., 30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingAddon}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {creatingAddon ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Add-on
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-2 text-center">
                <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">Ctrl+N</kbd>
              </p>
            </div>

            {/* CREATE GROUP FORM */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-green-600" />
                Group
              </h3>

              <form onSubmit={createGroup} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Group Name *
                  </label>
                  <input
                    id="group-name-input"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Extra Toppings"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Min
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={groupMin}
                      onChange={(e) => setGroupMin(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Max
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={groupMax}
                      onChange={(e) => setGroupMax(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={groupRequired}
                    onChange={(e) => setGroupRequired(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>Required selection</span>
                </label>

                <button
                  type="submit"
                  disabled={creatingGroup}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {creatingGroup ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4" />
                      Create Group
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-2 text-center">
                <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">Ctrl+G</kbd>
              </p>
            </div>
          </div>
        </div>

        {/* CENTER PANEL - LIST VIEW */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activePanel === "addons" ? "add-ons" : "groups"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activePanel === "addons" ? (
              <AddonsListPanel
                addons={filteredAddons}
                groups={groups}
                onAddToGroup={addToGroup}
                onDelete={deleteAddon}
              />
            ) : (
              <GroupsListPanel
                groups={filteredGroups}
                expandedGroups={expandedGroups}
                onToggle={toggleGroup}
                onRemoveFromGroup={removeFromGroup}
                onDelete={deleteGroup}
              />
            )}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ADDONS LIST PANEL
function AddonsListPanel({ addons, groups, onAddToGroup, onDelete }) {
  if (addons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No add-ons found
        </h3>
        <p className="text-sm text-gray-500">
          Create your first add-on to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addons.map((addon) => (
        <div
          key={addon._id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <div className="text-base font-semibold text-gray-900">{addon.name}</div>
              <div className="text-sm text-blue-600 font-semibold">₹{addon.price?.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {groups.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onAddToGroup(e.target.value, addon._id);
                    e.target.value = "";
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Add to Group...</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => onDelete(addon._id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete add-on"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// GROUPS LIST PANEL
function GroupsListPanel({ groups, expandedGroups, onToggle, onRemoveFromGroup, onDelete }) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <Layers className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No groups found
        </h3>
        <p className="text-sm text-gray-500">
          Create your first group to organize add-ons
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group._id);
        const addonCount = group.addOns?.length || 0;

        return (
          <div
            key={group._id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Group Header */}
            <div className="flex items-center justify-between p-4">
              <div 
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => onToggle(group._id)}
              >
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-green-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {group.name}
                    </h3>
                    {group.required && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                        Required
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {addonCount} {addonCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Min: {group.minSelection || 0} • Max: {group.maxSelection || 1}
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(group._id);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                title="Delete group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Group Items */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50">
                {addonCount === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">
                    No add-ons in this group yet
                  </p>
                ) : (
                  <div className="p-3 space-y-2">
                    {group.addOns.map((addon) => {
                      const addonData = typeof addon === "object" ? addon : null;
                      if (!addonData) return null;

                      return (
                        <div
                          key={addonData._id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <Package className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {addonData.name}
                              </span>
                              <span className="text-sm text-blue-600 ml-3 font-semibold">
                                ₹{addonData.price?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => onRemoveFromGroup(group._id, addonData._id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Remove from group"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// TOAST COMPONENT
function Toast({ message, type = "success", onClose }) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg shadow-lg ${styles[type]}`}>
        {icons[type]}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}