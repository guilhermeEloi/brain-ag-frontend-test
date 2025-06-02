import { Button } from "@mui/material";

import type { CustomButtonProps } from "./types";

const CustomButton = ({ label, variant, ...rest }: CustomButtonProps) => {
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
        backgroundColor: "#285896",
        color: "#ffffff",
      }}
      {...rest}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
