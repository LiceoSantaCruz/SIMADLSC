import React from 'react';

const InputField = ({ label, type, name, register, errors }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      <input
        type={type}
        className={`border p-2 rounded-lg w-full ${errors[name] ? 'border-red-500' : ''}`}
        {...register(name)}
      />
      {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
    </div>
  );
};

export default InputField;
