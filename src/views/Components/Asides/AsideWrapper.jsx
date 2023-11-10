import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const AsideWrapper = ({ children }) => {
	return (
		<Grid item sm={1.9} xs>
			<Box
				sx={{
					backgroundColor: 'white',
					height: 'calc(100vh - 72px)',
					overflow: 'auto',
					'&::-webkit-scrollbar': {
						width: '3px',
					},
				}}
			>
				{children}
			</Box>
		</Grid>
	);
};

export default AsideWrapper;
