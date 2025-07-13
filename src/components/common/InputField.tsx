import React from 'react';

interface IInputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export default function InputField({ label, placeholder, value, onChange, type = 'text' }: IInputFieldProps) {
  return (
    <div className="w-full mb-4 px-4">
      {label && <p className="text-body-medium py-3">{label}</p>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-black-1 rounded px-3 py-2.5 text-body-regular text-black-4"
      />
    </div>
  );
}
