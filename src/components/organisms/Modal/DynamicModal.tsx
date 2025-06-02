import React, { useContext } from "react";
import { Modal, Box, Typography } from "@mui/material";
import CustomButton from "@/components/atoms/Button";
import { ColorModeContext } from "@/contexts/ThemeContext";

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "inherit";
  style?: React.CSSProperties;
}

interface DynamicModalProps {
  isOpen: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  actions?: ModalAction[];
  onClose: () => void;
}

export default function DynamicModal({
  isOpen,
  title,
  content,
  actions = [],
  onClose,
}: DynamicModalProps) {
  const { mode } = useContext(ColorModeContext);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: 300,
          borderRadius: 2,
        }}
      >
        {title && (
          <Typography
            id="modal-title"
            variant="h6"
            gutterBottom
            style={{
              color: mode === "light" ? "#000000" : "#ffffff",
              fontWeight: 800,
            }}
          >
            {title}
          </Typography>
        )}
        <Box id="modal-content" sx={{ mb: 3 }}>
          {content}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          {actions.map(
            ({ label, onClick, variant = "contained", style }, i) => (
              <CustomButton
                key={i}
                variant={variant}
                onClick={onClick}
                label={label}
                sx={style}
              />
            )
          )}
        </Box>
      </Box>
    </Modal>
  );
}
