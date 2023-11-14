import React, { Suspense } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import logo from '../../../assets/images/logos/computer.png';

import { Box } from '@mui/system';

const PageWrapper = ({ children, isSidebar }) => {
	return (
		<Grid item sm={isSidebar ? 10.1 : 12}>
			<Box
				sx={{
					height: isSidebar ? 'calc(100vh - 80px)' : '100%',
					overflow: 'auto',
					marginTop: '.6rem',
				}}
			>
				<Suspense
					fallback={
						<Box
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								height: '100vh',
							}}
						>
							<div>
								<img src={logo} />
								<div
									style={{
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<CircularProgress
										sx={{
											width: '250px',
											height: '250px',
											'& svg': {
												strokeWidth: '24px',
											},
										}}
									/>
								</div>
							</div>
						</Box>
					}
				>
					<Box padding='0 .6rem'>{children}</Box>
				</Suspense>
			</Box>
		</Grid>
		// </Grid>
	);
};

export default PageWrapper;
