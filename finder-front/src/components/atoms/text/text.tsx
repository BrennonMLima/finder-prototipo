import React from 'react';

type TextVariant = 'h1' | 'p';

interface TextProps {
  children: string;
  variant?: TextVariant;
}

const Text: React.FC<TextProps> = ({ children, variant = 'p' }) => {
  const Tag = variant === 'h1' ? 'h1' : 'p';
  return <Tag>{children}</Tag>;
};

export default Text;
