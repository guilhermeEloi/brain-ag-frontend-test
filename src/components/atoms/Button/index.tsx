import { useContext } from "react";
import { Button } from "@mui/material";

import type { CustomButtonProps } from "./types";

import { ColorModeContext } from "@/contexts/ThemeContext";

const CustomButton = ({ label, variant, ...rest }: CustomButtonProps) => {
  const { mode } = useContext(ColorModeContext);

  return (
    <Button
      variant={variant}
      sx={{
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        borderRadius: "8px",
        textTransform: "none",
        paddingX: 3,
        paddingY: 1,
        backgroundColor: mode === "light" ? "#285896" : "#ffffff",
        color: mode === "light" ? "#ffffff" : "#285896",
      }}
      {...rest}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
