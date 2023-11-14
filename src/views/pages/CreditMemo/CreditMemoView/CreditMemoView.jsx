import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Grid,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import MUIButton from '../../../Components/Button/MUIButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useEffect, useState } from 'react';
import { TableHeadCell } from '../../../Components/Table/Table';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import ViewHistory from './ViewHistory';
import ButtonGroup from '@mui/material/ButtonGroup';
import GridRow from '../../../Components/GridRow/GridRow';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import { useNavigate } from 'react-router-dom';
import {
	ViewCreditMemo,
	downloadCreditMemoApi,
	getRefundHistory,
} from '../../../../core/api/creditmemo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import { decryptId, formatDate } from '../../../../core/utils/helpers';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ContainerPaper from '../../../Components/Containers/ContainerPaper';

const CreditMemoView = ({ id }) => {
	const [expanded, setExpanded] = useState(false);
	const [value, setValue] = useState('1');
	const [editForm, seteditForm] = useState(false);
	const [data, setData] = useState({});
	const [refundId, setRefundId] = useState(null);
	const [refundHistory, setRefundHistory] = useState([]);
	const [emailMenuAnchor, setEmailMenuAnchor] = useState(null);
	const [loading, setLoading] = useState(true);
	const decryptedID = decryptId(id);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleAccordionChange = () => {
		setExpanded(!expanded);
	};

	const navigate = useNavigate();
	useEffect(() => {
		fetchData();
	}, [id]);
	const fetchData = async () => {
		try {
			setLoading(true);
			const resp = await ViewCreditMemo(decryptedID);
			setData(resp?.data);
			const refundHistory = await getRefundHistory({
				invoice_id: resp?.data?.invoice_id,
			});
			setRefundHistory(refundHistory?.data);
		} finally {
			setLoading(false);
		}
	};

	const downloadPDF = async () => {
		await downloadCreditMemoApi({ id: decryptedID });
		console.log('resp', id);
	};

	const menuItems = [
		{
			label: 'Send Mail',
			onClick: () => {
				closeEmailMenu();
				navigate(`/send/email/credit-memo/${id}`);
			},
		},
	];
	const columns = [
		{ id: '', label: 'No.', key: 'index' },
		{ id: '', label: 'Items Decription', key: 'item_name' },
		{ id: '', label: 'Qty', key: 'quantity' },
		{ id: '', label: 'UOM', key: 'uom' },
		{ id: '', label: 'Rate(USD)', key: 'rate' },
		{ id: '', label: 'Amount(USD)', key: 'total' },
	];
	const info = [
		{ label: 'Credit Memo No:', value: data?.reference_number },
		{
			label: 'Credit Memo Date:',
			value: formatDate(data?.credit_memo_date),
		},
	];
	const handleRefund = id => {
		seteditForm(true);
		setRefundId(id);
	};
	const openEmailMenu = event => {
		setEmailMenuAnchor(event.currentTarget);
	};
	const closeEmailMenu = () => {
		setEmailMenuAnchor(null);
	};
	return (
		<Box sx={{ position: 'relative' }}>
			<HeaderPaper sx={{ marginBottom: 1 }}>
				<Grid item container>
					<Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant='h6'>
							{!editForm
								? data?.credit_memo_number
								: `Refund(${data?.credit_memo_number})`}
						</Typography>
					</Grid>
					<Grid
						sm={6}
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
						}}
					>
						{/* {!editForm && (
							<MUIButton
								variant='outlined'
								sx={{
									fontSize: '12px',
									textTransform: 'capitalize',
									margin: '0 8px',
								}}
								startIcon={<FilterListSharpIcon />}
							>
								Attachments
							</MUIButton>
						)}
						{!editForm && (
							<MUIButton
								variant='outlined'
								sx={{
									fontSize: '12px',
									textTransform: 'capitalize',
									margin: '10px 8px',
								}}
								startIcon={<ReceiptIcon />}
							>
								Comments & History
							</MUIButton>
						)} */}
						<IconButton onClick={() => navigate('/credit-memo')}>
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
			</HeaderPaper>
			{!editForm && (
				<Paper sx={{ padding: '1.5rem', mb: 1 }}>
					<MUIButton
						variant='outlined'
						onClick={() => navigate(`/credit-memo/edit/${id}`)}
						startIcon={<EditIcon />}
					>
						Edit
					</MUIButton>

					<MUIButton
						onClick={openEmailMenu}
						startIcon={<EmailOutlinedIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
					>
						MAILS
					</MUIButton>
					<Menu
						anchorEl={emailMenuAnchor}
						open={Boolean(emailMenuAnchor)}
						onClose={closeEmailMenu}
					>
						{menuItems.map((item, index) => (
							<MenuItem key={index} onClick={item.onClick}>
								<MUIButton>{item.label}</MUIButton>
							</MenuItem>
						))}
					</Menu>

					<MUIButton
						startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						onClick={downloadPDF}
					>
						Pdf/Print
					</MUIButton>
				</Paper>
			)}
			<ContainerPaper sx={{ padding: '1.5rem' }}>
				{editForm ? (
					<>
						<IconButton
							sx={{ margin: '-17px 0px 10px -15px' }}
							onClick={() => seteditForm(false)}
						>
							<KeyboardBackspaceIcon />
						</IconButton>
						<GridRow>
							<Grid item xs={3}>
								<InputLabel sx={{ color: '#00000099' }}>Item Name:</InputLabel>
							</Grid>
							<Grid item xs={2}>
								<Typography variant='body2'>
									Lenovo THINKCENTER M700 SFF Buissness PC
								</Typography>
							</Grid>
						</GridRow>
						<GridRow>
							<Grid item xs={3}>
								<InputLabel sx={{ color: '#00000099' }}>
									Refunded on:
								</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<Typography variant='body2'>
									{formatDate(refundHistory[refundId]?.created_at)}
								</Typography>
							</Grid>
						</GridRow>
						<GridRow>
							<Grid item xs={3}>
								<InputLabel sx={{ color: '#00000099' }}>
									Payment Mode:
								</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<Typography variant='body2'>Square</Typography>
							</Grid>
						</GridRow>
						<GridRow>
							<Grid item xs={3}>
								<InputLabel sx={{ color: '#00000099' }}>
									Reference #:
								</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<Typography variant='body2'>
									{refundHistory[refundId]?.reference_number}
								</Typography>
							</Grid>
						</GridRow>
						<GridRow>
							<Grid item xs={3}>
								<InputLabel sx={{ color: '#00000099' }}>
									Amount Refunded:
								</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<Typography variant='body2'>
									${refundHistory[refundId]?.total}
								</Typography>
							</Grid>
						</GridRow>
						<GridRow>
							<Grid item xs={3}>
								<InputLabel sx={{ color: '#00000099' }}>
									From Account:
								</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<Typography variant='body2'>Undeposited Funds</Typography>
							</Grid>
						</GridRow>
						<GridRow>
							<Grid item xs={3}>
								<InputLabel sx={{ color: '#00000099' }}>
									Description:
								</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<Typography variant='body2'>
									{refundHistory[refundId]?.customer_note}
								</Typography>
							</Grid>
						</GridRow>
					</>
				) : (
					<TabContext value={value}>
						<TabList onChange={handleChange} aria-label='basic tabs example'>
							<Tab label='View' value='1' />
							<Tab label='History' value='2' />
						</TabList>
						<Divider />
						<TabPanel value='1'>
							<>
								<Accordion
									sx={{ marginTop: '20px' }}
									expanded={expanded}
									onChange={handleAccordionChange}
								>
									<AccordionSummary
										expandIcon={
											<PlayArrowIcon
												sx={{
													color: '#0000008F',
													transform: expanded ? 'rotate(-90deg)' : 'none',
												}}
											/>
										}
										aria-controls='panel2a-content'
										id='panel2a-header'
									>
										<Grid container>
											<Grid container item sm={11}>
												<Grid item>
													{' '}
													<ReceiptIcon sx={{ color: '#0000008F' }} />
												</Grid>
												<Grid item sx={{ padding: '0px 7px' }}>
													{' '}
													<Typography variant='body1'>
														Refund History
													</Typography>
												</Grid>
											</Grid>
										</Grid>
									</AccordionSummary>
									<AccordionDetails>
										<Grid container justifyContent='center' alignItems='center'>
											<Grid item sm={12}>
												<Table sx={{ minWidth: 650 }} aria-label='simple table'>
													<TableHead>
														<TableRow>
															<TableHeadCell sx={{ padding: '6px 16px' }}>
																<Typography variant='templateBody2'>
																	Date
																</Typography>
															</TableHeadCell>
															<TableHeadCell sx={{ padding: '6px 16px' }}>
																<Typography variant='templateBody2'>
																	Item
																</Typography>
															</TableHeadCell>
															<TableHeadCell sx={{ padding: '6px 16px' }}>
																<Typography variant='templateBody2'>
																	Invoice
																</Typography>
															</TableHeadCell>
															<TableHeadCell sx={{ padding: '6px 16px' }}>
																<Typography variant='templateBody2'>
																	Amount Refunded
																</Typography>
															</TableHeadCell>
															<TableHeadCell sx={{ padding: '6px 16px' }}>
																<Typography variant='templateBody2'>
																	Action
																</Typography>
															</TableHeadCell>
														</TableRow>
													</TableHead>
													<TableBody>
														<TableRow>
															{refundHistory.map((row, index) => (
																<>
																	<TableHeadCell key={row.id}>
																		<Typography fontSize={13}>
																			{formatDate(row?.created_at)}
																		</Typography>
																	</TableHeadCell>
																	<TableHeadCell>
																		<Typography fontSize={13}>
																			Lenovo Think center M700 SFF Buissness PC
																		</Typography>
																	</TableHeadCell>
																	<TableHeadCell>
																		<Typography fontSize={13}>
																			{row?.invoice?.invoice_number}
																		</Typography>
																	</TableHeadCell>
																	<TableHeadCell>
																		<Typography fontSize={13}>
																			${row?.total}
																		</Typography>
																	</TableHeadCell>
																	<TableHeadCell>
																		<ButtonGroup
																			variant='outlined'
																			aria-label='outlined button group'
																		>
																			<Button
																				size='small'
																				onClick={() => handleRefund(index)}
																			>
																				<VisibilityIcon />
																			</Button>
																		</ButtonGroup>
																	</TableHeadCell>
																</>
															))}
														</TableRow>
													</TableBody>
												</Table>
											</Grid>
										</Grid>
									</AccordionDetails>
								</Accordion>
								<Grid container alignItems='flex-end'>
									<Grid item sm={10}></Grid>
									<Grid item mt={3}>
										{/* <Button startIcon={<DraftsIcon />}>Viewed</Button> */}
									</Grid>
								</Grid>
								<ViewTemplates
									title='Credit Memo'
									apiData={data}
									data={data?.credit_memo_items}
									columns={columns}
									status={data?.status}
									headerInfo={info}
									addressData={data?.customer}
									// showAddress
									shippingAddress={false}
								/>
								{/* <Grid mt={5} ml={8}>
									<Typography>More Information</Typography>
								</Grid> */}
								{/* <Grid mt={3} ml={8}>
									<Grid container>
										<Grid item sm={2}>
											<Typography variant='body2' fontSize={13}>
												Salesperson
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant='body2' fontSize={13}>
												: Usman Nawaz
											</Typography>
										</Grid>
									</Grid>
									<Grid container mt={2}>
										<Grid item sm={2}>
											<Typography variant='body2' fontSize={13}>
												Potential
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant='body2' fontSize={13}>
												:Test -1
											</Typography>
										</Grid>
									</Grid>
								</Grid> */}
								{/* <Grid mt={5} ml={2}>
									<Typography>Journal</Typography>
									<Divider />
								</Grid>
								<Grid mt={5} ml={2}>
									<Typography>
										Amount is displayed in your base currenct USD &ensp;{' '}
										<Chip label='Default' color='success' sx={{ padding: 0 }} />{' '}
									</Typography>
								</Grid>
								<Grid mt={3} ml={2}>
									<Typography>Credit Notes</Typography>
								</Grid>
								<Grid mt={3} ml={2}>
									<Typography>Account</Typography>
								</Grid> */}
								{/* <Grid mt={3} ml={2}>
									<Table
										sx={{ minWidth: 650 }}
										mt={3}
										aria-label='simple table'
									>
										<TableHead>
											<TableRow>
												<TableHeadCell sx={{ padding: '6px 16px' }}>
													<Typography variant='templateBody2'>Head</Typography>
												</TableHeadCell>
												<TableHeadCell sx={{ padding: '6px 16px' }}>
													<Typography variant='templateBody2'>Debt</Typography>
												</TableHeadCell>
												<TableHeadCell sx={{ padding: '6px 16px' }}>
													<Typography variant='templateBody2'>
														Credit
													</Typography>
												</TableHeadCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableHeadCell>
													<Typography fontSize={13}>
														Acccounts Recievable
													</Typography>
												</TableHeadCell>
												<TableHeadCell>
													<Typography fontSize={13}>0.00</Typography>
												</TableHeadCell>
												<TableHeadCell>
													<Typography fontSize={13}>130.00</Typography>
												</TableHeadCell>
											</TableRow>
											<TableRow>
												<TableHeadCell>
													<Typography fontSize={13}>
														Unearned Revenue
													</Typography>
												</TableHeadCell>
												<TableHeadCell>
													<Typography fontSize={13}>130.00</Typography>
												</TableHeadCell>
												<TableHeadCell>
													<Typography fontSize={13}>0.00</Typography>
												</TableHeadCell>
											</TableRow>
											<TableRow>
												<TableHeadCell>
													<Typography fontSize={13}>Tax Payable</Typography>
												</TableHeadCell>
												<TableHeadCell>
													<Typography fontSize={13}>0.00</Typography>
												</TableHeadCell>
												<TableHeadCell>
													<Typography fontSize={13}>0.00</Typography>
												</TableHeadCell>
											</TableRow>
											<TableRow>
												<TableHeadCell></TableHeadCell>
												<TableHeadCell>
													<Typography fontSize={13}>20.00</Typography>
												</TableHeadCell>
												<TableHeadCell>
													<Typography fontSize={13}>20.00</Typography>
												</TableHeadCell>
											</TableRow>
										</TableBody>
									</Table>
								</Grid> */}
							</>
						</TabPanel>
						<TabPanel value='2'>
							<ViewHistory />
						</TabPanel>
					</TabContext>
				)}
			</ContainerPaper>
			<OverlayLoader open={loading} />
		</Box>
	);
};

export default CreditMemoView;

const BtnStyles = {
	margin: '0 .2rem',
};
