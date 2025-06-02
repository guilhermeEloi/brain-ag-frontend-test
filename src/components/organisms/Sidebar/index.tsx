import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import GrassIcon from "@mui/icons-material/Grass";

import { SidebarLink } from "./styles";

interface SidebarProps {
  onClose: () => void;
  open: boolean;
}

const Sidebar = ({ onClose, open }: SidebarProps) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        <ListItem>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <SidebarLink to="/dashboard">Dashboard</SidebarLink>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <SidebarLink to="/producers">Produtores</SidebarLink>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <AgricultureIcon />
          </ListItemIcon>
          <SidebarLink to="/farms">Fazendas</SidebarLink>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <GrassIcon />
          </ListItemIcon>
          <SidebarLink to="/crops">Culturas</SidebarLink>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
