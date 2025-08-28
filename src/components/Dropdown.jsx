import React from "react";

function Dropdown({ uniqueAccountNames, onSelect, selected, name }) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        Select {name}:
      </label>
      <select
        id={name}
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="form-select"
      >
        <option value="">-- Choose any {name} --</option>
        {uniqueAccountNames.map((val, i) => (
          <option key={i} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
