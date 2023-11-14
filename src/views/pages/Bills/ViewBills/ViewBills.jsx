import React, { useEffect, useState } from 'react';
import cvs from '../../../../../public/assets/cvs.png';

import xlsx from '../../../../../public/assets/xlsx.png';
// import Logo from "../../../../assets/";
import Logo from '../../../../assets/images/logos/computer.png';
import vector from '../../../../assets/images/Vector.png';
import { Link as RouterLink } from 'react-router-dom';

import pdf from '../../../../../public/assets/pdf.jpg';

import { useTheme } from '@mui/material/styles';
import {
	Button,
	CircularProgress,
	IconButton,
	Link,
	List,
	ListItem,
	ListItemSecondaryAction,
	Menu,
	MenuItem,
	Paper,
	TableBody,
	TableContainer,
	TableFooter,
	TableHead,
	TableRow,
	colors,
	useMediaQuery,
} from '@mui/material';
import { Table } from '@mui/material';
// mui components  && icon
import { Grid, Stack, Divider, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import OutboxIcon from '@mui/icons-material/Outbox';
// components
// common components
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// styles
import { Box, fontWeight, margin, textTransform } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import DeleteIcon from '@mui/icons-material/Delete';

import { useNavigate } from 'react-router-dom';
import MUIButton from 'invoicing/src/Components/MUIButton';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { TableHeadCell, TableBodyCell } from '../../../Components/Table/Table';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
import GridRow from '../../../Components/GridRow/GridRow';

const ViewBills = ({ id, setRefresh }) => {
	const navigate = useNavigate();

	const [estimateSubComponent, setEstimateSubComponent] = useState(true);
	const [estimateEmailOpen, setEstimateEmailOpen] = useState(false);
	const [showMenuItem, setShowMenu] = useState(null);
	const [estimateFiles, setEstimatedFiles] = useState([]);
	const [estimateData, setEstimateData] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [openBill, setOpenBill] = useState(false);

	const handleEstimateSubComp = () => {
		setEstimateSubComponent(true);
		setEstimateEmailOpen(false);
	};

	const handleSendMail = () => {
		setEstimateEmailOpen(true);
		setEstimateSubComponent(false);
	};

	const showingMenu = event => {
		setShowMenu(event.currentTarget);
	};
	const hidingMenu = () => {
		setShowMenu(null);
	};

	// single estimate / show estimate / view
	useEffect(() => {
		fetchingSingleEstimate();
	}, [id]);

	const fetchingSingleEstimate = async () => {
		try {
			const resp = await showEstimateApi(id);
			console.log('respdataaaa', resp);
			setEstimateData(resp?.data);
			setEstimatedFiles(resp?.data?.estimate_files);
		} catch (error) {}
	};

	// handling attachments files
	const handleFileInputChange = event => {
		const files = event.target.files;

		if (files.length > 0) {
			const newFiles = Array.from(files);
			// console.log("newFiles", newFiles);
			submitFilesToApi(newFiles);
		}
	};
	const submitFilesToApi = async newFiles => {
		try {
			//   const resp = await addEstimatesFileApi({
			//     attachments: newFiles,
			//     estimate_id: id
			//   });
			fetchingSingleEstimate();

			// setEstimatedFiles((prevFiles) => [...prevFiles, ...newFiles]);
		} catch (error) {
			console.log('error', error);
		}
	};

	// const deleteFile = (file) => {
	//   setEstimatedFiles((prevFiles) => prevFiles.filter((f) => f !== file));
	// };
	const deleteFile = async id => {
		try {
			//   const resp = await deleteEstimateFielsApi(id);
			notyf.success(resp.message);
			fetchingSingleEstimate();
		} catch (error) {}
	};
	// mails menu
	const [emailMenuAnchor, setEmailMenuAnchor] = useState(null);

	const openEmailMenu = event => {
		setEmailMenuAnchor(event.currentTarget);
	};

	const closeEmailMenu = () => {
		setEmailMenuAnchor(null);
	};

	// main page open
	const handleSendEstimateMain = id => {
		navigate(`/send/email/price-quote/${id}`);
	};

	// invoice conversion
	const convertingToSaleOrder = async id => {
		try {
			setIsLoading(true);
			const resp = await convertToSaleOrderApi({ id });
			notyf.success(resp?.message);
			navigate('/sales-orders');
			setRefresh(prev => prev + 1);
		} catch (error) {}
		setIsLoading(false);
	};

	const [fileUrl, setFileUrl] = useState('');
	const handlePdf = async () => {
		try {
			const resp = await downloadEstimateApi({ id });
			console.log('resp', resp);
			// downloadFile(resp.data.url)
			window.open(resp?.data?.url, '_blank');
		} catch (error) {}
	};

	const typoStyle = {
		color: '#333333',
		fontSize: '11pt',
		fontWeight: 400,
	};
	const tbCellStyle = {
		padding: 1,
	};

	const tableTitle1 = {
		fontWeight: 450,
		fontSize: '14px',
	};
	const tableTitle2 = {
		fontWeight: 400,
		fontSize: '12px',
		marginTop: '2px',
		textAlign: 'end',
	};

	// items list
	console.log('estimateItems', estimateData);

	return (
		<Box sx={{ padding: '0 1rem' }}>
			<HeaderPaper>
				<Grid item container>
					{/* view header left  */}
					<Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant='h6'>BI-0743</Typography>
					</Grid>
					{/* view header right  */}
					<Grid
						sm={6}
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
						}}
					>
						<MUIButton
							onClick={showingMenu}
							variant='outlined'
							sx={{
								fontSize: '12px',
								textTransform: 'capitalize',
								margin: '0 8px',
							}}
							startIcon={<AttachmentOutlinedIcon />}
						>
							Attachments
						</MUIButton>
						<Menu
							anchorEl={showMenuItem}
							open={Boolean(showMenuItem)}
							onClose={hidingMenu}
							PaperProps={{
								elevation: 0,
								sx: {
									filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
									mt: 1.5,
									maxHeight: 250,
									overflowY: 'scroll',

									'& .MuiAvatar-root': {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
									'&:before': {
										content: '""',
										display: 'block',
										position: 'absolute',
										top: 0,
										// left: 15, // arrow positionm
										right: 50,
										width: 15,
										height: 15,
										bgcolor: 'background.paper',
										transform: 'translateY(-50%) rotate(45deg)',
										zIndex: 0,
									},
								},
							}}
							transformOrigin={{ horizontal: 'right', vertical: 'top' }}
							anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						>
							<>
								<Box
								// sx={{
								//   width: 400,
								//   maxHeight: 400,
								//   overflow: 'auto',
								//   display: 'flex',
								//   justifyContent: 'center',
								//   alignItems: 'center',
								//   flexDirection: 'column'
								// }}
								>
									<MenuItem
										sx={{
											width: '100%',
											// height: 'auto',
											display: 'flex',
											alignItems: 'center',
											flexDirection: 'column',
										}}
									>
										{/* <List> */}
										{estimateFiles?.map((file, index) => (
											<>
												<Box
													key={index}
													sx={{ display: 'flex', margin: '20px 0' }}
												>
													<Box sx={{ display: 'flex' }}>
														{file.file_name.endsWith('.pdf') ? (
															<img
																src={pdf}
																alt='PDF Icon'
																style={{ width: '60px', height: '60px' }}
															/>
														) : file.file_name.endsWith('.csv') ? ( // Corrected to .csv
															<img
																src={cvs}
																alt='CSV Icon'
																style={{ width: '60px', height: '60px' }}
															/>
														) : file.file_name.endsWith('.xlsx') ? (
															<img
																src={xlsx}
																alt='XLSX Icon'
																style={{ width: '60px', height: '60px' }}
															/> // You should define xlsx variable
														) : null}
													</Box>
													<Box
														sx={{ display: 'flex', flexDirection: 'column' }}
													>
														<Typography>{file.file_name}</Typography>
														<Box
															sx={{
																display: 'flex',
																justifyContent: 'space-evenly',
															}}
														>
															<Link
																component='span'
																variant='caption'
																onClick={handlePdf}
															>
																Download
															</Link>
															<Link component='span' variant='caption'>
																Remove
															</Link>

															<Link
																component='span'
																variant='caption'
																onClick={() => deleteFile(file?.id)}
															>
																Delete
															</Link>
														</Box>
													</Box>
												</Box>
												<Divider sx={{ width: '100%' }} />
											</>
										))}
									</MenuItem>

									<MenuItem
										sx={{
											display: 'flex',
											flexDirection: 'column',
											width: '100%',
										}}
									>
										<Typography textAlign='center' variant='body2Grey'>
											You can upload upto 10 files , 5mb each
										</Typography>

										<label htmlFor='file-input'>
											<MUIButton
												startIcon={<FileUploadOutlinedIcon />}
												sx={{
													background: '#EEEEEE',
													color: '#2196F3',
													margin: '10px 0',
													padding: '25px 30px',
													display: 'flex',
													flexDirection: 'column',
													'&:hover': {
														background: '#EEEEEE',
													},
												}}
												variant='contained'
												component='span'
											>
												Upload File
											</MUIButton>
											<input
												id='file-input'
												type='file'
												multiple
												accept='.pdf'
												style={{ display: 'none' }}
												onChange={handleFileInputChange}
											/>
										</label>
									</MenuItem>
								</Box>
							</>
						</Menu>
						<MUIButton
							variant='outlined'
							sx={{ fontSize: '12px', textTransform: 'capitalize' }}
							startIcon={<LibraryBooksOutlinedIcon />}
						>
							Comments and History
						</MUIButton>
						<IconButton onClick={() => navigate('/bills')}>
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
			</HeaderPaper>
			<Grid item sm={12}>
				<Paper sx={{ padding: '1.5rem' }}>
					<MUIButton
						startIcon={<EditIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						router
						to={`/price-quote/edit/${id}`}
					>
						Edit
					</MUIButton>
					{/* <MUIButton
            startIcon={<EmailOutlinedIcon fontSize="small" />}
            variant="outlined"
            sx={{ ...BtnStyles }}>
            Mails
          </MUIButton> */}
					<MUIButton
						startIcon={<EmailOutlinedIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						onClick={openEmailMenu}
					>
						Mails
					</MUIButton>
					<Menu
						anchorEl={emailMenuAnchor}
						open={Boolean(emailMenuAnchor)}
						onClose={closeEmailMenu}
					>
						<MenuItem
							onClick={() => {
								closeEmailMenu();
								handleSendEstimateMain(id);
							}}
						>
							<MUIButton>Send Mail</MUIButton>
						</MenuItem>
					</Menu>

					<MUIButton
						startIcon={<ShareOutlinedIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
					>
						Share
					</MUIButton>
					<MUIButton
						startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						onClick={handlePdf}
					>
						Pdf/Print
					</MUIButton>
					{/* <MUIButton
            startIcon={<NoteOutlinedIcon fontSize="small" />}
            variant="outlined"
            sx={{ ...BtnStyles }}>
            Convert To Invoice
          </MUIButton> */}
				</Paper>
			</Grid>
			<Paper sx={{ padding: '1.5rem', margin: '1rem 0' }}>
				{/* <Paper sx={{ padding: '1rem' }}>
          <Grid item container>
            <Grid item sm={9}>
              <Stack
                direction='row'
                display='flex'
                alignItems='center'
                spacing={2}
              >
                <img src={vector} alt='invoice' />
                <Box>
                  <Typography>Convert to Sale order</Typography>
                  <Typography variant='caption'>
                    Create an Sale Order for this price qoute to confirm the sell
                    and bill your customer
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid
              item
              sm={3}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              {isLoading ? (
                <CircularProgress />
              ) : (
                <MUIButton onClick={() => convertingToSaleOrder(id)}>
                  Convert to Sale Order
                </MUIButton>
              )}
            </Grid>
          </Grid>
        </Paper> */}
				{/* template  */}
				<Paper sx={{ padding: '1rem' }}>
					<Grid container>
						<Grid item container xs={12}>
							<Grid item xs={11}>
								<Typography>Bill 1</Typography>
							</Grid>
							<Grid item xs={1}>
								<IconButton onClick={() => setOpenBill(!openBill)}>
									<ArrowDropDownIcon />
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
					{openBill && (
						<>
							<Grid container>
								<TableContainer>
									<Table aria-label='simple table'>
										<TableHead>
											<TableRow sx={{ backgroundColor: '#f3f3f3' }}>
												<TableHeadCell sx={{ ...tbCellStyle }}>
													Date
												</TableHeadCell>
												<TableHeadCell sx={{ ...tbCellStyle }}>
													Purchase Order
												</TableHeadCell>

												<TableHeadCell sx={{ ...tbCellStyle }}>
													Status
												</TableHeadCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{[1].map((item, index) => (
												<>
													<TableRow
														key={item.id}
														// sx={{
														//   '&:last-child td, &:last-child th': { border: '1px' }
														// }}
													>
														{/* <TableBodyCell component='th' scope='row'>
                                                            {index + 1}
                                                        </TableBodyCell> */}

														<TableBodyCell>12 jan 2023</TableBodyCell>
														<TableBodyCell>#1234</TableBodyCell>
														<TableBodyCell>closed</TableBodyCell>
													</TableRow>
												</>
											))}
											<></>
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
						</>
					)}
				</Paper>

				<Paper>
					<Grid container my={5} p={3}>
						{/* header  */}
						<Grid item container>
							<Grid item sm={8}>
								<Grid item sm={8}>
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

										<Grid item sm={6} mt={-4}>
											<Typography variant='templateBody' fontSize={10}>
												www.minesotacomputers.us <br />
												sales@minesotacomputers.us
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<Grid
								mt={4}
								item
								sm={4}
								sx={{ display: 'flex', justifyContent: 'flex-end' }}
							>
								<Grid item container>
									<Grid container>
										<Grid
											item
											sm={8}
											container
											direction='row'
											justifyContent='flex-end'
										>
											<Typography
												variant='templateBody2'
												fontSize={13}
												sx={{ fontSize: '28px' }}
											>
												Bill
											</Typography>
										</Grid>
									</Grid>

									<Grid container>
										<Grid
											item
											sm={8}
											container
											direction='row'
											justifyContent='flex-end'
										>
											<Typography
												fontSize={13}
												variant='templateBody2'
												sx={{ fontSize: '15px' }}
											>
												#p1209
											</Typography>
										</Grid>
										<Grid item sm={1}></Grid>
										<Grid item>
											<Typography variant='templateBody'>
												{estimateData?.estimate_date}
											</Typography>
										</Grid>
									</Grid>
									<Grid container>
										<Grid
											item
											sm={5}
											container
											direction='row'
											justifyContent='flex-end'
										>
											<Typography
												fontSize={13}
												variant='templateBody2'
											></Typography>
										</Grid>
										<Grid item sm={1}></Grid>
										<Grid item>
											<Typography variant='templateBody'>
												{estimateData?.term?.term_name}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item sm={5} sx={{ marginTop: '32px' }}>
								<Typography>Minisota Computer</Typography>
								<Typography>Minisota Computer</Typography>
								<Typography>1275 Corporate Computer</Typography>
								<Typography>Drive Eagan MN 55121</Typography>
							</Grid>
						</Grid>

						<Grid container>
							<GridRow>
								<Grid item sm={6} sx={{ marginTop: '32px' }}>
									<Typography>Vendor Address</Typography>
									<Button sx={{ marginLeft: '-8px' }}>
										Hewlett packerd Enterprise
									</Button>
									<Typography>165 Descomb Road</Typography>
									<Typography>Andover MA</Typography>
									<Typography>Andover</Typography>
									<Typography>01810</Typography>
									<Typography>Massachusetts</Typography>
									<Typography>U.S.A</Typography>
									<Typography>508-467-0062</Typography>
								</Grid>
								<Grid item sm={6} sx={{ marginTop: '32px' }}>
									<Box sx={{ textAlign: 'end', marginRight: '80px' }}>
										<Typography>Minisota Computer</Typography>
										<Typography>Minisota Computer</Typography>
										<Typography>1275 Corporate Computer</Typography>
										<Typography>Drive Eagan MN 55121</Typography>
										<Typography>Minisota Computer</Typography>
										<Typography>Minisota Computer</Typography>
										<Typography>1275 Corporate Computer</Typography>
										<Typography>Drive Eagan MN 55121</Typography>
									</Box>
								</Grid>
							</GridRow>
						</Grid>
						<Grid container>
							<GridRow>
								<Grid item sm={6} sx={{ marginTop: '12px' }}>
									<Typography>Dilver To</Typography>
									<Typography>SJ Computer LLC</Typography>
									<Typography>2813 Eagandale Blvd</Typography>
									<Typography>Egan Minisota</Typography>
								</Grid>
								<Grid item sm={6}>
									<Box
										sx={{
											textAlign: 'end',
											marginRight: '80px',
											marginTop: '-6px',
										}}
									>
										<Typography>Minisota Computer</Typography>
										<Typography>Minisota Computer</Typography>
										<Typography>1275 Corporate Computer</Typography>
										<Typography>Drive Eagan MN 55121</Typography>
									</Box>
								</Grid>
							</GridRow>
						</Grid>
						<Grid item container my={5}>
							<Grid item xs={12}>
								<TableContainer>
									<Table sx={{ minWidth: 650 }} aria-label='simple table'>
										<TableHead>
											<TableRow sx={{ backgroundColor: '#f3f3f3' }}>
												<TableHeadCell sx={{ ...tbCellStyle }}>#</TableHeadCell>
												<TableHeadCell sx={{ ...tbCellStyle }}>
													Items & Description
												</TableHeadCell>
												<TableHeadCell sx={{ ...tbCellStyle }}>
													Qty
												</TableHeadCell>
												{/* <TableHeadCell  sx={{...tbCellStyle}} >UOM</TableHeadCell> */}
												<TableHeadCell sx={{ ...tbCellStyle }}>
													Rate(USD)
												</TableHeadCell>
												<TableHeadCell
													sx={{ ...tbCellStyle, textAlign: 'right' }}
												>
													Amount(USD)
												</TableHeadCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{estimateData?.estimate_items?.map((item, index) => (
												<>
													<TableRow
														key={item.id}
														// sx={{
														//   '&:last-child td, &:last-child th': { border: '1px' }
														// }}
													>
														<TableBodyCell component='th' scope='row'>
															{index + 1}1
														</TableBodyCell>
														<TableBodyCell>{item.item_name}</TableBodyCell>
														<TableBodyCell>{item.quantity}</TableBodyCell>
														{/* <TableBodyCell>{item.item_name}</TableBodyCell> */}
														<TableBodyCell>{item.rate}</TableBodyCell>
														<TableBodyCell style={{ textAlign: 'right' }}>
															{item.rate * item.quantity}
														</TableBodyCell>
													</TableRow>
												</>
											))}
											<></>

											{estimateData?.estimate_items.length === 0 && (
												<TableRow>
													<TableBodyCell align='center' colSpan={10}>
														No Data Found
													</TableBodyCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
						</Grid>
						<Box width='100%' my={4}>
							<Grid container>
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
												${estimateData?.sub_total}
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
												${estimateData?.tax_amount}
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
												${estimateData?.total}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Box>
					</Grid>
				</Paper>
				{/* <Grid container>
          <Grid item xs={5}>
            <Typography variant='h6' fontWeight='500' fontSize='12pt'>
              More Information
            </Typography>
            <Box my={3}>
              <Typography
                variant='subtitle2'
                sx={{ ...typoStyle }}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                Sales Person: <span>{estimateData?.sales_person?.name}</span>
              </Typography>
              <Typography
                variant='subtitle2'
                sx={{ ...typoStyle }}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <span>
                  Selected Emails:
                  <HoverPopover text='the price qoute will be emailed to these emails addresses '></HoverPopover>
                </span>
                <span>sudeep.soni@oroliads.com</span>
              </Typography>
            </Box>
          </Grid>
        </Grid> */}
			</Paper>
		</Box>
	);
};

export default ViewBills;

const BtnStyles = {
	margin: '0 .2rem',
};
