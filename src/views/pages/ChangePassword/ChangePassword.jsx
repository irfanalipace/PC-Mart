import { Button, Grid, InputLabel, Paper, Typography } from '@mui/material';
import FormField from '../../Components/InputField/FormField';

const ChangePassword = () => {
	return (
		<Paper sx={{ padding: 10 }}>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
				p={6}
			>
				<Typography variant='h6'>Change Password</Typography>
			</Grid>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
				spacing={10}
				p={2}
			>
				<Grid item sm={3}>
					<InputLabel sx={{ textAlign: 'left' }}>Old Password:</InputLabel>
				</Grid>
				<Grid item sm={5}>
					<FormField />
				</Grid>
			</Grid>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
				spacing={10}
				p={2}
			>
				<Grid item sm={3}>
					<InputLabel sx={{ textAlign: 'left' }}>New Password:</InputLabel>
				</Grid>
				<Grid item sm={5}>
					<FormField />
				</Grid>
			</Grid>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
				spacing={10}
				p={2}
			>
				<Grid item sm={3}>
					<InputLabel sx={{ textAlign: 'left' }}>Confirm Password:</InputLabel>
				</Grid>
				<Grid item sm={5}>
					<FormField />
				</Grid>
			</Grid>
			<Grid
				container
				direction='row'
				justifyContent='flex-end'
				alignItems='flex-end'
				spacing={2}
			>
				<Grid item>
					<Button variant='contained'>Update</Button>
				</Grid>
				<Grid item>
					<Button variant='outlined'>Cancel</Button>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default ChangePassword;
