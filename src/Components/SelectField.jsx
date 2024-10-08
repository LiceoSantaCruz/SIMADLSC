import React from 'react';

const SelectField = ({ label, name, options, register, errors, disabled }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      <select
        className={`border p-2 rounded-lg w-full ${errors[name] ? 'border-red-500' : ''}`}
        {...register(name)}
        disabled={disabled}
      >
        <option value="">Seleccione una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
    </div>
  );
};

export default SelectField;
