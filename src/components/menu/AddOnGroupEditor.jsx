export default function AddOnGroupEditor({ value, onChange }) {
  function addGroup() {
    onChange([...value, { name: "", required: false, addons: [] }]);
  }

  return (
    <div className="space-y-4">
      {value.map((g, i) => (
        <div key={i} className="border p-3 rounded">
          <input
            placeholder="Group name"
            value={g.name}
            onChange={e => {
              const v = [...value];
              v[i].name = e.target.value;
              onChange(v);
            }}
          />
        </div>
      ))}
      <button type="button" onClick={addGroup}>
        + Add Add-on Group
      </button>
    </div>
  );
}
