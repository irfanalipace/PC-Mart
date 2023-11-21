import {
	Box,
	Button,
	Grid,
	InputLabel,
	Paper,
	Typography,
} from '@mui/material';
import FormField from '../../Components/InputField/FormField';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useState } from 'react';

const ProfileUpdate = () => {
	const [selectedImage, setSelectedImage] = useState(null);

	const handleImageUpload = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.addEventListener('change', event => {
			const file = event.target.files[0];
			const imageUrl = URL.createObjectURL(file);
			setSelectedImage(imageUrl);
			input.value = '';
		});

		input.click();
	};
	return (
		<Paper>
			<Typography variant='h4' fontWeight={500} textAlign='center' p={5}>
				User Profile
			</Typography>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
				mt={4}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '200px',
						height: '200px',
						backgroundColor: '#BDBDBD',
						borderRadius: '50%',
						'&:hover': {
							backgroundColor: '#565958',
						},
					}}
					onClick={handleImageUpload}
				>
					{selectedImage ? (
						<img
							src={selectedImage}
							alt='Selected'
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								width: '200px',
								height: '200px',
								backgroundColor: '#BDBDBD',
								borderRadius: '50%',
							}}
						/>
					) : (
						<CameraAltOutlinedIcon sx={{ color: '#fff', fontSize: '60px' }} />
					)}
				</Box>
			</Grid>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
				p={6}
			>
				<Grid
					container
					direction='row'
					justifyContent='space-evenly'
					alignItems='center'
					sx={{ width: '70%' }}
					mt={4}
					mr={10}
				>
					<Grid item sm={2} ml={1}>
						<InputLabel sx={{ textAlign: 'right' }}>Name: </InputLabel>
					</Grid>
					<Grid item sm={3}>
						<FormField />
					</Grid>
					<Grid item sm={3} ml={1}>
						<InputLabel sx={{ textAlign: 'right' }}>Email: </InputLabel>
					</Grid>
					<Grid item sm={3}>
						<FormField />
					</Grid>
				</Grid>
				<Grid
					container
					direction='row'
					justifyContent='space-evenly'
					alignItems='center'
					sx={{ width: '70%' }}
					mt={4}
					mr={10}
				>
					<Grid item sm={2} ml={1}>
						<InputLabel sx={{ textAlign: 'right' }}>Password: </InputLabel>
					</Grid>
					<Grid item sm={3}>
						<FormField />
					</Grid>
					<Grid item sm={3} ml={1}>
						<InputLabel sx={{ textAlign: 'right' }}>
							Conform Password:{' '}
						</InputLabel>
					</Grid>
					<Grid item sm={3}>
						<FormField />
					</Grid>
				</Grid>
			</Grid>

			<Grid
				container
				direction='row'
				justifyContent='flex-end'
				alignItems='flex-end'
				spacing={2}
				p={4}
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

export default ProfileUpdate;
