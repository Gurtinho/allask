import { ButtonHTMLAttributes } from 'react';
import './button.scss';

type BananaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

function Button({ isOutlined = false, ...props }: BananaProps) {
  return (
    <button
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props}></button>
  );
};

export { Button };