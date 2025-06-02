import type { ButtonProps } from "@mui/material";

export interface CustomButtonProps extends ButtonProps {
  label: string;
  variant: "contained" | "outlined" | "text";
}
