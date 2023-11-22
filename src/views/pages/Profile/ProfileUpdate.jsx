import {
	Box,
	Button,
	Grid,
	IconButton,
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
import { DeleteProfile, updateProfile } from '../../../core/api/user';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN } from '../../../core/store/auth/authSlice';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';

const ProfileUpdate = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
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
	const handleImageUpload = event => {
		if (!event.target.closest('.delete-button')) {
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
		}
	};
	useEffect(() => {
		formik.setFieldValue('first_name', userInfo?.first_name);
		formik.setFieldValue('last_name', userInfo?.last_name);
	}, []);
	const deleteProfilePic = async () => {
		const resp = await DeleteProfile();
		dispatch(LOGIN(resp?.data));
		formik.setFieldValue('profile_pic', '');
		setSelectedImage(null);
	};
	return (
		<Paper sx={{ p: 2, height: 'calc(100vh - 85px)' }}>
			<Paper sx={{ mx: 1 }}>
				<Typography variant='h5' fontWeight={500} textAlign='start' p={4}>
					User Profile
				</Typography>
			</Paper>
			<Paper sx={{ mx: 1 }}>
				<Grid container ml={3} mt={4} py={4}>
					<Grid item xs='2'>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								width: '150px',
								height: '150px',
								backgroundColor: '#BDBDBD',
								borderRadius: '50%',
								'&:hover': {
									backgroundColor: '#565958',
								},
							}}
							onClick={e => handleImageUpload(e)}
						>
							{selectedImage ? (
								<>
									<img
										src={selectedImage}
										alt='Selected'
										style={{
											width: '150px',
											height: '150px',
											borderRadius: '50%',
											position: 'relative',
										}}
									/>
								</>
							) : (
								<CameraAltOutlinedIcon
									sx={{ color: '#fff', fontSize: '60px' }}
								/>
							)}
							{selectedImage && (
								<div
									style={{
										position: 'absolute',
									}}
								>
									<IconButton
										onClick={e => handleImageUpload(e)}
										sx={{ backgroundColor: '#BDBDBD', marginRight: '1em' }}
									>
										<EditIcon />
									</IconButton>
									<IconButton
										onClick={() => {
											setOpenConfirmDialog(true);
											setDialogProps({
												onConfirm: () => deleteProfilePic(),
											});
										}}
										sx={{ backgroundColor: '#BDBDBD' }}
										className='delete-button'
									>
										<DeleteIcon />
									</IconButton>
								</div>
							)}
						</Box>
					</Grid>

					<Grid item xs='3'>
						<Stack spacing={3}>
							<FormField
								id='first_name'
								label='First Name'
								value={formik.values.first_name}
								handleChange={formik.handleChange}
								isTouched={formik.touched.first_name}
								error={formik.errors?.first_name}
							/>

							<FormField
								id='last_name'
								label='Last Name'
								value={formik.values.last_name}
								handleChange={formik.handleChange}
								isTouched={formik.touched.last_name}
								error={formik.errors?.last_name}
							/>

							<FormField label='Email' disabled value={userInfo?.email} />
						</Stack>
						<Stack direction={'row'} spacing={2} mt={5}>
							<Button variant='contained' onClick={() => formik.handleSubmit()}>
								Update
							</Button>

							<Button variant='outlined' onClick={() => navigate('/')}>
								Cancel
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</Paper>
			<ConfirmDialog
				title='Are you sure you want to delete the Profile Pic'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				{...dialogProps}
			/>
		</Paper>
	);
};

export default ProfileUpdate;
