import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

const TemplateOtherDetails = ({ apiData }) => {
	return (
		<Box
			width='100%'
			my={4}
			sx={{ padding: '0 1.5rem 1.5rem 1.5rem', marginBottom: '1rem' }}
		>
			<Grid container>
				<Grid item sm={12}>
					<Grid item container>
						<Grid item sm={4} display='flex' justifyContent='space-between'>
							<Typography variant='templateBody2' fontSize={16} pb={1}>
								Bank Details
							</Typography>
						</Grid>
					</Grid>
					<Grid item container>
						<Grid item sm={2} display='flex' justifyContent='space-between'>
							<Typography
								fontSize={13}
								variant='templateBody2'
								fontWeight={600}
							>
								A/C Title :
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant='templateBody' textAlign={'right'}>
								Minnesota Computer LLC
							</Typography>
						</Grid>
					</Grid>
					<Grid item container>
						<Grid item sm={2} display='flex' justifyContent='space-between'>
							<Typography
								fontSize={13}
								variant='templateBody2'
								fontWeight={600}
							>
								A/C No :
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant='templateBody' textAlign={'right'}>
								2915400432
							</Typography>
						</Grid>
					</Grid>
					<Grid item container>
						<Grid item sm={2} display='flex' justifyContent='space-between'>
							<Typography
								fontSize={13}
								variant='templateBody2'
								fontWeight={600}
							>
								Routing :
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant='templateBody' textAlign={'right'}>
								343984488
							</Typography>
						</Grid>
					</Grid>
					<Grid item container>
						<Grid item sm={2} display='flex' justifyContent='space-between'>
							<Typography
								variant='templateBody2'
								fontSize={13}
								fontWeight={600}
							>
								Swift Code :
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant='templateBody' textAlign={'right'}>
								ABGB3434
							</Typography>
						</Grid>
					</Grid>
					<Grid item container>
						<Grid item sm={2} display='flex' justifyContent='space-between'>
							<Typography
								variant='templateBody2'
								fontSize={13}
								fontWeight={600}
							>
								Bank :
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant='templateBody' textAlign={'right'}>
								Associated Bank
							</Typography>
						</Grid>
					</Grid>
					{apiData?.terms_and_condition && (
						<>
							<Grid item container>
								<Grid
									item
									sm={4}
									display='flex'
									justifyContent='space-between'
									mt={2}
								>
									<Typography variant='templateBody2' pb={1} fontSize={16}>
										Terms and conditions
									</Typography>
								</Grid>
							</Grid>
							<Grid item container>
								<Grid
									item
									sm={12}
									display='flex'
									justifyContent='space-between'
								>
									<Typography variant='templateBody'>
										{apiData?.terms_and_condition}
									</Typography>
								</Grid>
							</Grid>
						</>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default TemplateOtherDetails;
