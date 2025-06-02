import type { ComponentProps } from "react";
import CustomButton from "../Button";

type CustomButtonProps = ComponentProps<typeof CustomButton>;

const FormButton = ({ children, ...props }: CustomButtonProps) => {
  return (
    <CustomButton type="submit" {...props}>
      {children}
    </CustomButton>
  );
};

export default FormButton;
