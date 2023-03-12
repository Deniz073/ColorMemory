import { ForwardedRef, forwardRef } from "react"
import 'animate.css'

type ButtonProps = {
  className: string;
  onClick: () => void;
  disabled: boolean;
}

const Button = forwardRef(function Button({ className, onClick, disabled }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  return (
    <button
      className={`h-32 w-32 rounded-lg disabled:opacity-70 animate__animated ${className}`}
      ref={ref}
      disabled={disabled}
      onClick={onClick}
    ></button>
  );
})

export default Button

