/* eslint-disable react/prop-types */
import { Grid, Stack, Typography } from '@mui/material';
import HeaderPaper from '../Containers/HeaderPaper';

export default function DataTableHeading({ title }) {
	return (
		<HeaderPaper sx={{ padding: '10px 20px' }}>
			<Grid item container>
				<>
					<Grid item sm={6} display='flex' alignItems='center'>
						<Stack
							direction='row'
							display='flex'
							alignItems='center'
							spacing={0}
						>
							<Typography variant='h6' component='span'>
								{title}
							</Typography>
						</Stack>
					</Grid>
					<Grid
						item
						sm={6}
						sx={{
							display: 'flex',
							justifyContent: 'end',
							alignItems: 'center',
						}}
					></Grid>
				</>
			</Grid>
		</HeaderPaper>
	);
}
