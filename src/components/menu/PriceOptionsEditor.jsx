export default function PriceOptionsEditor({ value, onChange }) {
  function add() {
    onChange([...value, {
      label: "",
      unit: "plate",
      quantity: 1,
      price: "",
      isDefault: value.length === 0
    }]);
  }

  function update(i, key, val) {
    onChange(value.map((v, idx) =>
      idx === i ? { ...v, [key]: val } : v
    ));
  }

  function setDefault(i) {
    onChange(value.map((v, idx) => ({
      ...v,
      isDefault: idx === i
    })));
  }

  return (
    <div className="space-y-3">
      {value.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input placeholder="Label" value={v.label}
            onChange={e => update(i,"label",e.target.value)} />
          <input type="number" placeholder="Price" value={v.price}
            onChange={e => update(i,"price",e.target.value)} />
          <select value={v.unit}
            onChange={e => update(i,"unit",e.target.value)}>
            <option>plate</option>
            <option>g</option>
            <option>ml</option>
            <option>piece</option>
          </select>
          <button type="button" onClick={() => setDefault(i)}>
            {v.isDefault ? "✓ Default" : "Set Default"}
          </button>
        </div>
      ))}
      <button type="button" onClick={add}>+ Add Variant</button>
    </div>
  );
}
