import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../core/store/auth/authThunks";
import { Avatar } from "@mui/material";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
const Header = memo(() => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const userDetails = useSelector((state) => state.auth.user);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    dispatch(logout());
  };

  return (
    <Box sx={{ height: "60px" }}>
      <AppBar>
        <Grid container alignItems='center'>
          <Grid item sm={1.9} xs>
            <Typography
              variant='h6'
              // component='div'
              sx={{
                borderRight: "1px solid white",
                height: "64px",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              PC Mart
            </Typography>
          </Grid>

          {/* <SearchBar /> */}

          <Typography
            variant='h6'
            // component='div'
            sx={{ flexGrow: 1 }}
          ></Typography>

          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            style={{ outline: "none" }}
            onClick={handleMenu} // Define handleMenu
          >
            {/* <AccountCircleIcon /> */}{" "}
            <Avatar>
              <Typography variant='h6' textTransform={"uppercase"}>
                {`${userDetails?.name?.split(" ")[0][0]}${
                  userDetails?.name?.split(" ")[1][0]
                }`}
              </Typography>
            </Avatar>
          </IconButton>
          <Menu
            id='profile-menu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose} // Define handleClose
          >
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>

          <MenuItem value=''></MenuItem>
        </Grid>
      </AppBar>
    </Box>
  );
});

export default Header;
