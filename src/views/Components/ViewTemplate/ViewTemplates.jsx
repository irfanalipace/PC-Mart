import { Box, Grid, Paper, Typography } from '@mui/material';
import Logo from '../../../assets/images/logos/computer.png';
import { Ribbon } from '../common';
import TemplateTable from './TemplateTable';
import TemplateAddress from './TemplateAddress';
import TemplateOtherDetails from './TemplateOtherDetails';
import Download from '../../pages/CustomerPortal/DownloadCustomerTemplate';

const ViewTemplates = ({
	data,
	columns,
	status,
	headerInfo,
	title,
	apiData,
	bankDetails,
	showAddress,
	shippingAddress,
	addressData,
	download,
	downloadingPdf,
	headings,
}) => {
	return (
		<Box>
			<>
				<Paper sx={{ position: 'relative', border: '.5px solid grey' }}>
					{download && <Download downloadingPdf={downloadingPdf} />}{' '}
					<Ribbon status={status} />
					<Box sx={{ padding: '2rem' }}>
						<Grid item container>
							<Grid item sm={8}>
								<Grid item container sm={8}>
									<Grid item container>
										<img
											src={Logo}
											alt='logo'
											style={{ padding: 0, margin: 0 }}
										/>
										<Grid item sm={6} mt={-4}>
											<Typography variant='templateBody' fontSize={10}>
												1725 Coproative Center Drive <br />
												Eagan MN 55121 - US
											</Typography>
										</Grid>

										<Grid item sm={4} mt={-4}>
											<Typography variant='templateBody' fontSize={10}>
												www.minesotacomputers.us <br />
												sales@minesotacomputers.us
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							</Grid>

							<Grid
								mt={6}
								item
								sm={4}
								sx={{ display: 'flex', justifyContent: 'flex-end' }}
							>
								<Grid item container>
									<Grid item container>
										<Grid
											item
											sm={10}
											container
											direction='row'
											justifyContent='flex-end'
										>
											<Typography variant='templateHead' fontSize={34}>
												{title}
											</Typography>
										</Grid>
									</Grid>
									{headerInfo?.map((row, index) => (
										<Grid item container key={index}>
											<Grid
												item
												sm={6}
												container
												direction='row'
												justifyContent='flex-end'
											>
												<Typography variant='templateBody2' fontSize={13}>
													{row?.label}
												</Typography>
											</Grid>
											<Grid item sm={1}></Grid>
											<Grid item>
												<Typography variant='templateBody'>
													{row?.value}
												</Typography>
											</Grid>
										</Grid>
									))}
								</Grid>
							</Grid>
						</Grid>
						{showAddress && (
							<Grid item container mt={6}>
								<Grid item sm={12}>
									<TemplateAddress
										data={addressData}
										shippingAddress={shippingAddress}
										headings={headings}
									/>
								</Grid>
							</Grid>
						)}
						<Grid item container mt={6}>
							<Grid item sm={12}>
								<TemplateTable data={data} columns={columns} />
							</Grid>
						</Grid>
						<Box width='100%' my={4}>
							<Grid item container>
								<Grid item sm={12}>
									<Grid item container>
										<Grid item sm={8}></Grid>
										<Grid
											item
											sm={4}
											display='flex'
											justifyContent='space-between'
										>
											<Typography variant='templateBody2'>
												Sub Total:
											</Typography>
											<Typography variant='templateBody' fontSize={14}>
												${parseFloat(apiData?.sub_total)?.toFixed(2)}
											</Typography>
										</Grid>
									</Grid>
									<Grid item container>
										<Grid item sm={8}></Grid>
										<Grid
											item
											sm={4}
											display='flex'
											justifyContent='space-between'
										>
											<Typography variant='templateBody2'>Tax:</Typography>
											<Typography variant='templateBody' fontSize={14}>
												${parseFloat(apiData?.tax_amount)?.toFixed(2)}
											</Typography>
										</Grid>
									</Grid>
									<Grid item container>
										<Grid item sm={8}></Grid>
										<Grid
											item
											sm={4}
											display='flex'
											justifyContent='space-between'
										>
											<Typography variant='templateBody2'>Discount:</Typography>
											<Typography variant='templateBody' fontSize={14}>
												{apiData?.discount_type !== 'Percentage'
													? '$' + parseFloat(apiData?.discount)?.toFixed(2)
													: '$' +
													  (
															(apiData?.discount / 100) *
															apiData?.sub_total
													  )?.toFixed(2)}
											</Typography>
										</Grid>
									</Grid>
									<Grid item container>
										<Grid item sm={8}></Grid>
										<Grid
											item
											sm={4}
											display='flex'
											justifyContent='space-between'
										>
											<Typography variant='templateBody2'>
												Shipping Charges:
											</Typography>
											<Typography variant='templateBody' fontSize={14}>
												${parseFloat(apiData?.shipping_charges)?.toFixed(2)}
											</Typography>
										</Grid>
									</Grid>
									<Grid item container>
										<Grid item sm={8}></Grid>
										<Grid
											item
											sm={4}
											display='flex'
											justifyContent='space-between'
										>
											<Typography variant='templateBody2'>
												Adjustments:
											</Typography>
											<Typography variant='templateBody' fontSize={14}>
												${parseFloat(apiData?.adjustment)?.toFixed(2)}
											</Typography>
										</Grid>
									</Grid>
								</Grid>

								<Grid item sm={12}>
									<Grid item container my={2}>
										<Grid item sm={8}></Grid>
										<Grid
											item
											sm={4}
											display='flex'
											justifyContent='space-between'
											bgcolor='#f0f0f0'
										>
											<Typography variant='templateBody2'>Total:</Typography>
											<Typography variant='templateBody' fontSize={14}>
												${parseFloat(apiData?.total)?.toFixed(2)}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Box>
					</Box>
					{bankDetails && <TemplateOtherDetails apiData={apiData} />}
				</Paper>
			</>
		</Box>
	);
};

export default ViewTemplates;
