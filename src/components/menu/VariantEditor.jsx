import React from "react";

export default function VariantEditor({ variants, setVariants }) {
  const addVariant = () => {
    setVariants([
      ...variants,
      { label: "", unit: "plate", quantity: 1, price: "", isDefault: false },
    ]);
  };

  const update = (i, key, val) => {
    const copy = [...variants];
    copy[i][key] = val;
    setVariants(copy);
  };

  const remove = (i) => {
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm text-zinc-300 font-medium">Price Variants</h3>

      {variants.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            placeholder="Half / Full"
            value={v.label}
            onChange={(e) => update(i, "label", e.target.value)}
            className="bg-black border border-zinc-700 px-3 py-2 rounded text-white"
          />
          <input
            type="number"
            placeholder="Price"
            value={v.price}
            onChange={(e) => update(i, "price", e.target.value)}
            className="bg-black border border-zinc-700 px-3 py-2 rounded text-white w-24"
          />
          <button
            onClick={() => remove(i)}
            className="text-red-400 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addVariant}
        className="text-blue-400 text-sm"
      >
        + Add Variant
      </button>
    </div>
  );
}
