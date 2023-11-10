import { Box } from '@mui/system';
import React from 'react';

function TableContainer({ children }) {
	return (
		<Box
			sx={{
				zIndex: '0',
				position: 'relative',
				height: 'calc(100vh - 168px)',
				overflow: 'auto',
				backgroundColor: 'white',
				// '& .MuiTableContainer-root': {
				//   height: 'calc(100vh - 300px)',
				//   overflow: 'auto'
				// }
			}}
		>
			{children}
		</Box>
	);
}

export default TableContainer;
