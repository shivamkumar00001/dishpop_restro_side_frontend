import React from "react";

export default function AddOnSelector({ groups, selected, setSelected }) {
  const toggle = (id) => {
    setSelected(
      selected.includes(id)
        ? selected.filter(x => x !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm text-gray-300 font-medium">Add-On Groups</h3>

      {groups.length === 0 ? (
        <p className="text-sm text-gray-500">No add-on groups available</p>
      ) : (
        <div className="space-y-2">
          {groups.map(g => (
            <label
              key={g._id}
              className="flex items-center gap-3 p-3 bg-black border border-gray-800 rounded cursor-pointer hover:border-cyan-500 transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(g._id)}
                onChange={() => toggle(g._id)}
                className="w-4 h-4 text-cyan-500 bg-gray-900 border-gray-700 rounded focus:ring-cyan-500"
              />
              <div className="flex-1">
                <div className="text-white font-medium">{g.name}</div>
                {g.addOns && (
                  <div className="text-xs text-gray-400">
                    {g.addOns.length} add-ons
                    {g.required && (
                      <span className="ml-2 text-red-400">• Required</span>
                    )}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}