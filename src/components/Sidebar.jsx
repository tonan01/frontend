import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Biến 'isAdminOrManager' đã bị xóa vì không cần thiết

  const navItems = [
    {
      text: "Dashboard",
      path: "/",
      icon: <DashboardIcon />,
      roles: ["User", "Manager", "Admin"],
    },
    {
      text: "Thông tin cá nhân",
      path: "/profile",
      icon: <AccountCircleIcon />,
      roles: ["User", "Manager", "Admin"],
    },
    {
      text: "Quản lý Todos",
      path: "/todos",
      icon: <ListAltIcon />,
      roles: ["User", "Manager", "Admin"],
    },
    {
      text: "Quản lý Người dùng",
      path: "/admin/users",
      icon: <GroupIcon />,
      roles: ["Manager", "Admin"],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#111827",
          color: "#fff",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {navItems.map((item) => {
            // === PHẦN SỬA LỖI NẰM Ở ĐÂY ===
            // Kiểm tra xem user có vai trò phù hợp với item hay không
            const isAuthorized = user?.roles?.some((role) =>
              item.roles.includes(role)
            );

            if (isAuthorized) {
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#fff" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              );
            }
            return null; // Không render item nếu không có quyền
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
