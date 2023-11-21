import { Button, Grid, InputLabel, Paper, Typography } from '@mui/material';
import FormField from '../../Components/InputField/FormField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from '../../../core/api/user';
import notyf from '../../Components/NotificationMessage/notyfInstance';

const ChangePassword = () => {
	const navigate = useNavigate();
	const validationSchema = Yup.object({
		old_password: Yup.string().required('Old Password is required'),
		new_password: Yup.string()
			.required('New Password is required')
			.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
			.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.matches(
				/[^a-zA-Z0-9]/,
				'Password must contain at least one special character'
			),
		password_confirmation: Yup.string()
			.oneOf([Yup.ref('new_password'), null], 'Passwords must match')
			.required('Confirm Password is required'),
	});

	const formik = useFormik({
		initialValues: {
			old_password: '',
			new_password: '',
			password_confirmation: '',
		},
		validationSchema: validationSchema,
		onSubmit: async values => {
			console.log(values);
			try {
				const resp = await updatePassword(values);
				notyf.success(resp?.message);
				navigate('/');
			} catch (err) {
				console.error('An error occurred:', err?.data?.errors);
				formik.setErrors(err?.data?.errors);
			}
		},
	});
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
					<FormField
						type='password'
						id='old_password'
						placeholder='Old Password'
						value={formik.values.old_password}
						handleChange={formik.handleChange}
						isTouched={formik.touched.old_password}
						error={formik.errors.old_password}
						password
					/>
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
					<FormField
						type='password'
						id='new_password'
						placeholder='New Password'
						value={formik.values.new_password}
						handleChange={formik.handleChange}
						isTouched={formik.touched.new_password}
						error={formik.errors.new_password}
						password
					/>
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
					<FormField
						type='password'
						id='password_confirmation'
						placeholder='Confirm Password'
						value={formik.values.password_confirmation}
						handleChange={formik.handleChange}
						isTouched={formik.touched.password_confirmation}
						error={formik.errors.password_confirmation}
						password
					/>
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

export default ChangePassword;
