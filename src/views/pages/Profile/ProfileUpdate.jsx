import {
	Box,
	Button,
	Grid,
	IconButton,
	InputLabel,
	Paper,
	Typography,
} from '@mui/material';
import FormField from '../../Components/InputField/FormField';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import notyf from '../../Components/NotificationMessage/notyfInstance';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { updateProfile } from '../../../core/api/user';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN } from '../../../core/store/auth/authSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProfileUpdate = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userInfo = useSelector(state => state?.auth?.user);
	const [selectedImage, setSelectedImage] = useState(userInfo?.profile_pic);

	const validationSchema = Yup.object({
		first_name: Yup.string()
			.max(50, 'Must be 50 characters or less')
			.required('First Name is Required'),
		last_name: Yup.string()
			.max(50, 'Must be 50 characters or less')
			.required('Last Name is Required'),
	});
	const formik = useFormik({
		initialValues: {
			first_name: '',
			last_name: '',
			profile_pic: '',
		},
		validationSchema: validationSchema,
		onSubmit: async values => {
			console.log(values);
			try {
				const resp = await updateProfile(values);
				dispatch(LOGIN(resp?.data));
				notyf.success(resp?.message);
				navigate('/');
			} catch (err) {
				console.error('An error occurred:', err?.data?.errors);
				formik.setErrors(err?.data?.errors);
			}
		},
	});
	const handleImageUpload = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.addEventListener('change', event => {
			const file = event.target.files[0];
			formik.setFieldValue('profile_pic', file);
			const imageUrl = URL.createObjectURL(file);
			setSelectedImage(imageUrl);
			input.value = '';
		});

		input.click();
	};
	useEffect(() => {
		formik.setFieldValue('first_name', userInfo?.first_name);
		formik.setFieldValue('last_name', userInfo?.last_name);
	}, []);
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
						<>
							<img
								src={selectedImage}
								alt='Selected'
								style={{
									width: '200px',
									height: '200px',
									borderRadius: '50%',
									position: 'relative',
								}}
							/>
						</>
					) : (
						<CameraAltOutlinedIcon sx={{ color: '#fff', fontSize: '60px' }} />
					)}
				</Box>
				{selectedImage && (
					<div
						style={{
							position: 'absolute',
						}}
					>
						<IconButton
							onClick={handleImageUpload}
							sx={{ backgroundColor: '#BDBDBD', marginRight: '1em' }}
						>
							<EditIcon />
						</IconButton>
						<IconButton
							onClick={() => {
								formik.setFieldValue('profile_pic', null);
								setSelectedImage(null);
							}}
							sx={{ backgroundColor: '#BDBDBD' }}
						>
							<DeleteIcon />
						</IconButton>
					</div>
				)}
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
					justifyContent='space-around'
					alignItems='center'
					sx={{ width: '100%' }}
					mt={4}
					mr={10}
				>
					<Grid item>
						<InputLabel sx={{ textAlign: 'right' }}>First Name: </InputLabel>
					</Grid>
					<Grid item sm={3}>
						<FormField
							id='first_name'
							value={formik.values.first_name}
							handleChange={formik.handleChange}
							isTouched={formik.touched.first_name}
							error={formik.errors?.first_name}
						/>
					</Grid>
					<Grid item>
						<InputLabel sx={{ textAlign: 'right' }}>Last Name: </InputLabel>
					</Grid>
					<Grid item sm={3}>
						<FormField
							id='last_name'
							value={formik.values.last_name}
							handleChange={formik.handleChange}
							isTouched={formik.touched.last_name}
							error={formik.errors?.last_name}
						/>
					</Grid>
					<Grid item>
						<InputLabel sx={{ textAlign: 'right' }}>Email: </InputLabel>
					</Grid>
					<Grid item sm={3}>
						<FormField disabled value={userInfo?.email} />
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
					<Button variant='contained' onClick={() => formik.handleSubmit()}>
						Update
					</Button>
				</Grid>
				<Grid item>
					<Button variant='outlined' onClick={() => navigate('/')}>
						Cancel
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default ProfileUpdate;
