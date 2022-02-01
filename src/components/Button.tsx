import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss';

type BananaProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: BananaProps) {
  return (
    <button className="button" { ...props }></button>
  );
};

export { Button };