/* eslint-disable react/display-name */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../core/store/auth/authThunks';
import { Avatar, Divider } from '@mui/material';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
const Header = memo(() => {
	const dispatch = useDispatch();
	const [anchorEl, setAnchorEl] = useState(null);
	const userInfo = useSelector(state => state?.auth?.user);
	const handleMenu = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogOut = () => {
		dispatch(logout());
	};
	const navigate = useNavigate();
	return (
		<Box sx={{ height: '60px' }}>
			<AppBar>
				<Grid container alignItems='center'>
					<Grid item sm={1.9} xs>
						<Typography
							variant='h6'
							// component='div'
							sx={{
								borderRight: '1px solid white',
								height: '64px',

								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
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
						style={{ outline: 'none' }}
						onClick={handleMenu} // Define handleMenu
					>
						<Avatar src={userInfo?.profile_pic} />
					</IconButton>
					<Menu
						id='profile-menu'
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleClose} // Define handleClose
					>
						<MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
						<MenuItem onClick={() => navigate('/change-password')}>
							Change Password
						</MenuItem>
						<Divider />
						<MenuItem onClick={handleLogOut}>
							<ExitToAppIcon />
							&ensp; Logout
						</MenuItem>
					</Menu>

					<MenuItem value=''></MenuItem>
				</Grid>
			</AppBar>
		</Box>
	);
});

export default Header;
