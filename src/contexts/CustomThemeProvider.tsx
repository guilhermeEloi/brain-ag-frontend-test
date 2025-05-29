import { useState, useMemo, type ReactNode } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ColorModeContext } from "./ThemeContext";

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        typography: {
          fontFamily: '"Montserrat", sans-serif',
        },
        components: {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "light" ? "#ffffff" : "#2A3244",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};
