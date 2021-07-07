import { ButtonHTMLAttributes } from "react";
import "./styles.scss";

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

export function CustomButton({
  isOutlined = false,
  ...props
}: CustomButtonProps) {
  return (
    <button
      className={`button ${isOutlined ? "outlined" : ""}`}
      {...props}
    ></button>
  );
}
