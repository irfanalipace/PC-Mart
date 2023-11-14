import { CircularProgress } from '@mui/material';
import { Backdrop } from '@mui/material';

const OverlayLoader = ({ open }) => {
	return (
		<Backdrop
			sx={{
				backgroundColor: 'rgba(217, 230, 243, 0.3)',
				position: 'absolute',
				zIndex: theme => theme.zIndex.drawer + 1,
			}}
			open={open}
		>
			<CircularProgress color='inherit' />
		</Backdrop>
	);
};

export default OverlayLoader;
