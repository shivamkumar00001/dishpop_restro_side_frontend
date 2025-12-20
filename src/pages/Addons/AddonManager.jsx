import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2, Loader2, FolderPlus, X } from "lucide-react";
import addonApi from "../../api/addOnApi";

export default function AddonsPage() {
  const { username } = useParams();
  
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
  
  // Loading
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    loadData();
  }, [username]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [groupsRes, addonsRes] = await Promise.all([
        addonApi.getGroups(username),
        addonApi.getAddons(username),
      ]);

      console.log("Groups Response:", groupsRes.data);
      console.log("Addons Response:", addonsRes.data);

      setGroups(groupsRes.data?.data || []);
      setAddons(addonsRes.data?.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      alert("Failed to load add-ons");
    } finally {
      setLoading(false);
    }
  };

  // Create Add-on Group
  const createGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert("Group name is required");
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

      console.log("Group created:", response.data);

      // ✅ Update state directly (no reload)
      setGroups((prev) => [...prev, response.data.data]);

      // Clear form
      setGroupName("");
      setGroupRequired(false);
      setGroupMin(0);
      setGroupMax(1);

      alert("Add-on group created successfully!");
    } catch (error) {
      console.error("Create group error:", error);
      alert(error.response?.data?.message || "Failed to create group");
    } finally {
      setCreatingGroup(false);
    }
  };

  // Create Individual Add-on
  const createAddon = async (e) => {
    e.preventDefault();

    if (!addonName.trim() || !addonPrice) {
      alert("Name and price are required");
      return;
    }

    setCreatingAddon(true);

    try {
      const response = await addonApi.createAddon(username, {
        name: addonName.trim(),
        price: parseFloat(addonPrice),
      });

      console.log("Add-on created:", response.data);

      // ✅ Update state directly (no reload)
      setAddons((prev) => [...prev, response.data.data]);

      // Clear form
      setAddonName("");
      setAddonPrice("");

      alert("Add-on created successfully!");
    } catch (error) {
      console.error("Create add-on error:", error);
      alert(error.response?.data?.message || "Failed to create add-on");
    } finally {
      setCreatingAddon(false);
    }
  };

  // Delete Add-on
  const deleteAddon = async (addonId) => {
    if (!window.confirm("Delete this add-on?")) return;

    try {
      await addonApi.deleteAddon(username, addonId);
      
      // ✅ Update state directly (no reload)
      setAddons((prev) => prev.filter((a) => a._id !== addonId));
      
      alert("Add-on deleted!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete");
    }
  };

  // Delete Group
  const deleteGroup = async (groupId) => {
    if (!window.confirm("Delete this group?")) return;

    try {
      await addonApi.deleteGroup(username, groupId);
      
      // ✅ Update state directly (no reload)
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      
      alert("Group deleted!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete");
    }
  };

  // Add add-on to group
  const addToGroup = async (groupId, addonId) => {
    try {
      const group = groups.find((g) => g._id === groupId);
      const currentAddons = group.addOns?.map((a) => a._id || a) || [];

      if (currentAddons.includes(addonId)) {
        alert("Add-on already in this group");
        return;
      }

      console.log("Adding to group:", {
        groupId,
        addonId,
        currentAddons,
        newAddons: [...currentAddons, addonId],
      });

      const response = await addonApi.updateGroup(username, groupId, {
        addOns: [...currentAddons, addonId],
      });

      // ✅ Update state directly (no reload)
      setGroups((prev) =>
        prev.map((g) =>
          g._id === groupId ? response.data.data : g
        )
      );

      alert("Add-on added to group!");
    } catch (error) {
      console.error("Add to group error:", error);
      alert(error.response?.data?.message || "Failed to add to group");
    }
  };

  // Remove add-on from group
  const removeFromGroup = async (groupId, addonId) => {
    if (!window.confirm("Remove this add-on from the group?")) return;

    try {
      const group = groups.find((g) => g._id === groupId);
      const currentAddons = group.addOns?.map((a) => a._id || a) || [];

      // Filter out the addon to remove
      const updatedAddons = currentAddons.filter((id) => id !== addonId);

      console.log("Removing from group:", {
        groupId,
        addonId,
        before: currentAddons,
        after: updatedAddons,
      });

      const response = await addonApi.updateGroup(username, groupId, {
        addOns: updatedAddons,
      });

      // ✅ Update state directly (no reload)
      setGroups((prev) =>
        prev.map((g) =>
          g._id === groupId ? response.data.data : g
        )
      );

      alert("Add-on removed from group!");
    } catch (error) {
      console.error("Remove from group error:", error);
      alert(error.response?.data?.message || "Failed to remove from group");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B10] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto" />
          <p className="text-white mt-4">Loading add-ons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B10] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white">Add-ons Manager</h1>
          <p className="text-gray-400 mt-1">
            Create add-ons and organize them into groups
          </p>
        </div>

        {/* CREATE FORMS */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* CREATE INDIVIDUAL ADD-ON */}
          <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Add-on
            </h2>

            <form onSubmit={createAddon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Add-on Name *
                </label>
                <input
                  type="text"
                  value={addonName}
                  onChange={(e) => setAddonName(e.target.value)}
                  placeholder="e.g., Extra Cheese"
                  className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white placeholder-gray-500 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={addonPrice}
                  onChange={(e) => setAddonPrice(e.target.value)}
                  placeholder="e.g., 30"
                  className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white placeholder-gray-500 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={creatingAddon}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          </div>

          {/* CREATE ADD-ON GROUP */}
          <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5" />
              Create Add-on Group
            </h2>

            <form onSubmit={createGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Extra Toppings"
                  className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white placeholder-gray-500 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min Selection
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={groupMin}
                    onChange={(e) => setGroupMin(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Selection
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={groupMax}
                    onChange={(e) => setGroupMax(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={groupRequired}
                  onChange={(e) => setGroupRequired(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-[#0D1017] border-gray-600 rounded focus:ring-indigo-600"
                />
                <span>Required selection</span>
              </label>

              <button
                type="submit"
                disabled={creatingGroup}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          </div>
        </div>

        {/* ALL ADD-ONS LIST */}
        <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            All Add-ons ({addons.length})
          </h2>

          {addons.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No add-ons created yet
            </p>
          ) : (
            <div className="grid gap-2">
              {addons.map((addon) => (
                <div
                  key={addon._id}
                  className="flex items-center justify-between p-4 bg-[#12151D] border border-[#232A37] rounded-lg hover:border-indigo-600 transition-colors"
                >
                  <div>
                    <div className="text-white font-medium">{addon.name}</div>
                    <div className="text-sm text-gray-400">
                      ₹{addon.price?.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Add to Group Dropdown */}
                    {groups.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addToGroup(e.target.value, addon._id);
                            e.target.value = "";
                          }
                        }}
                        className="px-3 py-2 bg-[#0D1017] border border-[#232A37] rounded text-white text-sm focus:border-indigo-600 focus:outline-none"
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
                      onClick={() => deleteAddon(addon._id)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete add-on"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD-ON GROUPS */}
        <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Add-on Groups ({groups.length})
          </h2>

          {groups.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No groups created yet
            </p>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="p-4 bg-[#12151D] border border-[#232A37] rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {group.name}
                      </h3>
                      <div className="flex gap-3 text-xs text-gray-400 mt-1">
                        <span>
                          Min: {group.minSelection || 0} | Max:{" "}
                          {group.maxSelection || 1}
                        </span>
                        {group.required && (
                          <span className="text-red-400">• Required</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteGroup(group._id)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add-ons in this group */}
                  <div className="space-y-2">
                    {group.addOns && group.addOns.length > 0 ? (
                      group.addOns.map((addon) => {
                        const addonData = typeof addon === "object" ? addon : null;
                        if (!addonData) return null;

                        return (
                          <div
                            key={addonData._id}
                            className="flex items-center justify-between p-3 bg-[#0D1017] rounded border border-[#232A37] hover:border-indigo-600 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-white">
                                {addonData.name}
                              </span>
                              <span className="text-indigo-400">
                                ₹{addonData.price?.toFixed(2)}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => removeFromGroup(group._id, addonData._id)}
                              className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                              title="Remove from group"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-3">
                        No add-ons in this group yet
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}