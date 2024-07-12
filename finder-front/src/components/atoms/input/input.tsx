import React from 'react';

interface InputProps {
  type?: 'text' | 'image' | 'number' | 'password';
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type = 'text', placeholder, className, value, onChange }) => {
  switch (type) {
    case 'text':
      return (
        <input
          type="text"
          placeholder={placeholder}
          className={className || 'text-input'}
          value={value as string}
          onChange={onChange}
        />
      );
    case 'password':
      return (
        <input
          type="password"
          placeholder={placeholder}
          className={className || 'text-input'}
          value={value as string}
          onChange={onChange}
        />
      );
    case 'number':
      return (
        <input
          type="text"
          placeholder={placeholder}
          className={className || 'number-input'}
          value={value as string}
          onChange={onChange}
        />
      );
    case 'image':
      return (
        <div className={className}>
          <input
            type="file"
            className={className}
            onChange={onChange}
          />
        </div>
      );
    default:
      return <input type="text" placeholder={placeholder} className={className} value={value as string} onChange={onChange} />;
  }
};

export default Input;
