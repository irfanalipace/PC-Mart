import React, { useState } from 'react';
import {
	TextField as MuiTextField,
	InputAdornment,
	IconButton,
	MenuItem,
	Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const FormField = ({
	id,
	type,
	name,
	size,
	variant,
	error,
	isTouched,
	handleChange,
	fullWidth,
	options,
	password,
	textarea,
	icon,
	InputProps,
	style,
	selectbutton,
	SelectProps,
	sx,
	disabled, // Add disabled prop
	fontSize,
	...otherProps
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const configSelect = {
		id,
		name: name || id,
		select: true,
		fullWidth: fullWidth || false,
		onChange: handleChange,
		size: size || 'small',
		disabled: disabled || false, // Set the disabled prop
		...otherProps,
	};

	if (isTouched && error) {
		configSelect.error = true;
		configSelect.helperText = error;
	}

	const configTextField = {
		id,
		name: name || id,
		fullWidth: true,
		onChange: handleChange,
		type: showPassword ? 'text' : type,
		size: size || 'small',
		inputProps: {
			style: {
				fontSize: style?.fontSize ? style?.fontSize : '13px',
				backgroundColor: disabled ? '#e0e0e0' : '#ffffff',
				// color:'grey'
			},
		},
		disabled: disabled || false, // Set the disabled prop
		InputLabelProps: {
			style: {
				fontSize: '16px',
			},
		},
		...otherProps,
	};

	if (isTouched && error) {
		configTextField.error = true;
		configTextField.helperText = error;
	}

	return (
		<>
			{type === 'select' ? (
				<MuiTextField
					{...configSelect}
					// SelectProps={{ IconComponent: () => null }}
					SelectProps={{
						MenuProps: { PaperProps: { style: { maxHeight: '250px' } } },
						...SelectProps,
					}}
					InputLabelProps={{
						style: {
							fontSize: '16px',
						},
					}}
					sx={{
						'& .MuiInputBase-root': {
							// top: "3px",
							'& .MuiSelect-select': {
								padding: '8.5px 14px',
								fontSize: '14px',
							},
						},
						...sx,
					}}
				>
					{options?.map(option => (
						<MenuItem key={option?.value} value={option?.value}>
							<Typography
								sx={{ textTransform: 'capitalize', fontSize: '16px' }}
							>
								{option?.text}
							</Typography>
						</MenuItem>
					))}
					{selectbutton && (
						<Typography
							sx={{
								position: 'sticky',
								bottom: '0',
								width: '100%',
								backgroundColor: 'white',
							}}
						>
							{selectbutton}
						</Typography>
					)}
				</MuiTextField>
			) : type === 'textarea' ? (
				<MuiTextField
					multiline
					rows={2}
					{...configTextField}
					InputProps={InputProps}
					style={style}
					sx={{
						'& .MuiOutlinedInput-root': {
							padding: 0,
							fontSize: '16px !important',
						},
						'& .MuiInputBase-input': {
							padding: '7px',
							fontSize: '16px !important',
						},
						color: 'red',
						...sx,
					}}
				/>
			) : (
				<MuiTextField
					{...configTextField}
					InputProps={{
						...(icon
							? {
									startAdornment: (
										<InputAdornment position='start'>
											<span style={{ marginTop: '8px' }}>{icon}</span>
										</InputAdornment>
									),
							  }
							: {}),
						...(password
							? {
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton
												onClick={() => setShowPassword(prevShow => !prevShow)}
												edge='end'
											>
												{showPassword ? (
													<VisibilityIcon />
												) : (
													<VisibilityOffIcon />
												)}
											</IconButton>
										</InputAdornment>
									),
							  }
							: {}),
						...InputProps,
					}}
					inputProps={{ maxLength: 255 }} // Set the maxLength to 25 characters
					style={style}
					sx={sx}
				/>
			)}
		</>
	);
};

export default FormField;
