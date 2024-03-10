import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './MainAside.css';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SellIcon from '@mui/icons-material/Sell';

export default function Sidebar() {
  const { pathname } = useLocation();
  const theme = useTheme();
  
  // Initialize open with an array of objects with 'open' property
  const [open, setOpen] = useState([]);

  const list = [
    { name: 'Dashboard', icon: <SpaceDashboardRoundedIcon />, path: '/' },
    { name: 'File Upload', icon: <UploadFileIcon />, path: '/file-upload' },
    { name: 'Non Ready Items', icon: <ShoppingCartIcon />, path: '/non-ready-items' },
    { name: 'Ready Items', icon: <ReceiptIcon />, path: '/ready-items' },
    { name: 'Sold Items', icon: <SellIcon />, path: '/sold-items' },
  ];

  useEffect(() => {
    // Initialize open with an array of objects with 'open' property
    setOpen(list.map(() => ({ open: false })));
  }, [list]);

  const handleItemClick = (index) => {
    setOpen((prev) => {
      let tempArray = prev.map((p, _index) => ({
        ...p,
        open: _index === index ? !p.open : false,
      }));
      return tempArray;
    });
  };

  useEffect(() => {
    setOpen((prev) => {
      let tempArray = prev.map((pre) => ({
        ...pre,
        open: pre.path === pathname || (pre.subItems && pre.subItems.some((item) => pathname.includes(item.path))),
      }));
      return tempArray;
    });
  }, [pathname]);

  return (
    <Box
      className='custom-drawer'
      sx={{
        width: '100%',
        paddingTop: '20px',
      }}
    >
      {list?.map((item, index) => (
        <React.Fragment key={item.name}>
          <Link to={item?.path} className='subitem'>
            <ListItem
              disablePadding
              onClick={() => handleItemClick(index)}
              className={`custom-list-item ${pathname === item.path ? 'selected' : ''}`}
            >
              <ListItemButton
                sx={{
                  color: open[index]?.open ? theme.palette.primary.main : theme.palette.dark,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: open[index]?.open ? theme.palette.primary.main : theme.palette.dark,
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
