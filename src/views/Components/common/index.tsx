import React from 'react';
import { Box, Typography } from '@mui/material';
import { StatusColor } from '../../../core/utils/helpers';
import { useTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

export const Ribbon = ({ status }: { status: string }) => {
	const theme: Theme = useTheme();

	return (
		<Box
			sx={{
				position: 'absolute',
				height: 85,
				width: '133px',
				overflow: 'hidden',
			}}
		>
			<Typography
				sx={{
					position: 'absolute',
					left: 0,
					bottom: 0,
					color: 'white',
					width: '100%',
					textAlign: 'center',
					transform: 'rotate(-39.5deg)',
					transformOrigin: 'bottom left',
					textTransform: 'capitalize',
					background: StatusColor(status , theme),
				}}
			>
				{status}
			</Typography>
		</Box>
	);
};
