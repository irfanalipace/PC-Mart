import React, { useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./MainAside.css";
import { Link, useLocation } from "react-router-dom";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function Sidebar() {
  const theme = useTheme();
  const list = [
    { name: "Dashboard", icon: <SpaceDashboardRoundedIcon />, path: "/" },
    { name: "File Upload", icon: <UploadFileIcon />, path: "/file-upload" },
    {
      name: "Not Ready Items",
      icon: <ShoppingCartIcon />,
      path: "/non-ready-items",
    },
    { name: "Ready Items", icon: <ReceiptIcon />, path: "/ready-items" },
  ];

  const { pathname } = useLocation();
  const [open, setOpen] = useState(list);

  const handleItemClick = (index) => {
    setOpen((prev) => {
      let tempArray = prev.map((p, _index) => {
        if (_index === index)
          return {
            ...p,
            open: true,
          };
        else
          return {
            ...p,
            open: false,
          };
      });
      tempArray[index].open = !tempArray[index]?.open;
      return [...tempArray];
    });
  };

  useEffect(() => {
    setOpen((prev) => {
      let tempArray = prev.map((pre) => {
        if (pre.path === pathname)
          return {
            ...pre,
            open: true,
          };
        else if (Array.isArray(pre?.subItems)) {
          const active = pre.subItems.some((item) =>
            pathname?.includes(item.path)
          );
          if (active)
            return {
              ...pre,
              open: true,
            };
        }
        return pre;
      });
      return [...tempArray];
    });
  }, [pathname]);

  return (
    <Box
      className='custom-drawer'
      sx={{
        width: "100%",
        paddingTop: "20px",
      }}
    >
      {list?.map((item, index) => (
        <React.Fragment key={item.name}>
          <Link to={item?.path} className='subitem'>
            <ListItem
              disablePadding
              onClick={() => handleItemClick(index)}
              className={`custom-list-item ${
                pathname === item.path ? "selected" : ""
              }`}
            >
              <ListItemButton
                sx={{
                  color: open[index].open
                    ? theme.palette.primary.main
                    : theme.palette.dark,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: open[index].open
                      ? theme.palette.primary.main
                      : theme.palette.dark,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        </React.Fragment>
      ))}
    </Box>
  );
}
