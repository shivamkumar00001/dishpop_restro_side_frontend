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
      <h3 className="text-sm text-zinc-300 font-medium">Add-On Groups</h3>

      {groups.map(g => (
        <label
          key={g._id}
          className="flex items-center gap-2 text-zinc-300"
        >
          <input
            type="checkbox"
            checked={selected.includes(g._id)}
            onChange={() => toggle(g._id)}
          />
          {g.name}
        </label>
      ))}
    </div>
  );
}
