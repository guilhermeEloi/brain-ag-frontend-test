import type { ButtonProps } from "@mui/material";

export interface CustomButtonProps extends ButtonProps {
  label: string;
  varint: "contained" | "outlined" | "text";
}
