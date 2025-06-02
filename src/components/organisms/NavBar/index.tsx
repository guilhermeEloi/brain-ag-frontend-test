import { useState, useContext } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

import { ThemeSwitch } from "@/components/atoms/ThemeSwitch";
import { ColorModeContext } from "@/contexts/ThemeContext";

import logoImg from "@/assets/serasaLogo.png";
import logoWhiteImg from "@/assets/serasaWhiteLogo.png";

import { ImgLogo, ImgLogoWhite, NavLeft, ToggleButton } from "./styles";
import Sidebar from "@/components/organisms/Sidebar";

export default function NavBar() {
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        style={{ backgroundColor: mode === "light" ? "#ffffff" : "#1D4F91" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <NavLeft>
            <ToggleButton onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon
                style={{
                  color: mode === "light" ? "#1c2230" : "#ffffff",
                  fontSize: "32px",
                }}
              />
            </ToggleButton>
            {mode === "light" ? (
              <ImgLogo src={logoImg} alt="Imagem de logo Serasa Experian" />
            ) : (
              <ImgLogoWhite
                src={logoWhiteImg}
                alt="Imagem de logo Serasa Experian"
              />
            )}
          </NavLeft>
          <ThemeSwitch checked={mode === "dark"} onChange={toggleColorMode} />
        </Toolbar>
      </AppBar>

      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
