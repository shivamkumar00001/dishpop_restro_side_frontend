import { Plus, Trash2 } from "lucide-react";

export default function AddOnGroupEditor({ value, onChange }) {
  function addGroup() {
    onChange([...value, { name: "", required: false, addons: [] }]);
  }

  function removeGroup(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  function updateGroup(index, field, val) {
    const updated = [...value];
    updated[index][field] = val;
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      {value.map((g, i) => (
        <div key={i} className="bg-black border border-gray-700 rounded p-4 space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Group name (e.g., Extra Toppings)"
              value={g.name}
              onChange={(e) => updateGroup(i, "name", e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeGroup(i)}
              className="p-2 text-red-400 hover:text-red-500 rounded"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={g.required || false}
              onChange={(e) => updateGroup(i, "required", e.target.checked)}
              className="w-4 h-4 text-cyan-500 bg-black border-gray-700 rounded focus:ring-cyan-500"
            />
            <span>Required selection</span>
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={addGroup}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-gray-300 rounded hover:border-cyan-500 hover:text-cyan-400 flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Add-on Group
      </button>
    </div>
  );
}