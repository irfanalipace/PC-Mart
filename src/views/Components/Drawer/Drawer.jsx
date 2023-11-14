import { Button, Drawer, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useResponsiveStyles from '../../../core/hooks/useMedaiQuery';

const CustomDrawer = ({ open, onClose, children , dWidth }) => {
  const { isMobile, isMedium } = useResponsiveStyles();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  let drawerWidth = dWidth ? '30vw' : '40vw'; // Default width for larger devices

  if (isMobile) {
    drawerWidth = '90vw';
  } else if (isMedium) {
    drawerWidth = '80vw';
  } else {
  }

  const drawerStyle = {
    backgroundColor: '#f3f3f3',
    width: drawerWidth
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{ style: drawerStyle }}
    >
      {open && <>{children}</>}
    </Drawer>
  );
};

export default CustomDrawer;
