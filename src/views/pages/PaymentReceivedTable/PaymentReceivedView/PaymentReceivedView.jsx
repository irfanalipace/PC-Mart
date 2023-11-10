import React, { useEffect, useState } from 'react';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import GridRow from '../../../Components/GridRow/GridRow';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import EditIcon from '@mui/icons-material/Edit';
import MUIButton from '../../../Components/Button/MUIButton';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { ArrowDropDown, DeleteOutline } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';
import {
	Button,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material';
import {
	AttachFile,
	Close,
	Edit,
	History,
	KeyboardArrowDown,
	Mail,
	MailOutline,
	MoreVert,
	UploadFileOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import Logo from '../../../../../src/assets/images/logos/computer.png';
import AttachFileMenu from '../../../Components/AttachFileBox/AttachFileBox';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';
import {
	SinglePaymentReceivedApi,
	deletePaymentReceivedApi,
	downloadPDFPaymentReceiveApi,
} from '../../../../core/api/paymentReceived';
import HistoryDrawer from '../../../Components/HistoryDrawer/HistoryDrawer';
import {
	convertDateToLongFormat,
	formatDate,
	generateEncryptedID,
} from '../../../../core/utils/helpers';
function PaymentReceivedView({ id, setRefresh }) {
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [paymentReceivedData, setpaymentReceivedData] = useState();
	const [anchorElMail, setAnchorElMail] = useState(null);
	// const [anchorElPDF, setAnchorElPDF] = useState(null);
	const [anchorElThreeDot, setAnchorElThreeDot] = useState(null);
	const [btnGroupData, setbtnGroupData] = useState('Accrual');
	const [openAttachmentMenu, setopenAttachmentMenu] = useState();
	const [historyDrawer, setHistoryDrawer] = useState();
	const [fileList, setFileList] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const handleFileListUpdate = newFileList => {
		setFileList(newFileList);
	};
	const openMailMenu = Boolean(anchorElMail);
	// const openPDFMenu = Boolean(anchorElPDF);
	const openThreeDotMenu = Boolean(anchorElThreeDot);

	const handleMailMenuClick = event => {
		setAnchorElMail(event.currentTarget);
	};

	// const handlePDFMenuClick = (event) => {
	// 	setAnchorElPDF(event.currentTarget);
	// };
	const handleThreeDotMenuClick = event => {
		setAnchorElThreeDot(event.currentTarget);
	};
	const handlePdf = async id => {
		try {
			const resp = await downloadPDFPaymentReceiveApi({ id });
			window.open(resp?.data?.url, '_blank');
		} catch (error) {}
	};
	const handleMenuClose = () => {
		setAnchorElMail(null);
		// setAnchorElPDF(null);
		setAnchorElThreeDot(null);
	};

	const handleBtnGroup = (event, btnChanged) => {
		setbtnGroupData(btnChanged);
	};
	//  single customer api
	const getsinglePaymentReceived = async () => {
		try {
			setLoading(true);
			const singleCustomer = await SinglePaymentReceivedApi(id);
			setpaymentReceivedData(singleCustomer);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			navigate('/payment-received');
		}
	};
	const handleDelete = async id => {
		try {
			if (id) {
				const res = await deletePaymentReceivedApi(id);
				navigate('/payment-received');
				setRefresh(prev => prev + 1);
			}
		} catch (err) {
			console.log('err', err);
		}
	};
	useEffect(() => {
		getsinglePaymentReceived();
	}, [id]);
	const handleSendMail = id => {
		navigate(`/send/email/payment_receive/${generateEncryptedID(id)}`);
	};
	// const timelineData = [
	//   {
	//     icon: 'comment',
	//     title: 'Zoho Books',
	//     timestamp: '15 Jun 2023 02:11 AM',
	//     content: 'Payment Received Creted',
	//   },
	//   {
	//     icon: 'comment',
	//     title: 'Zoho Books',
	//     timestamp: '15 Jun 2023 02:11 AM',
	//     content: 'Payment Received Updated',
	//   },
	// ];
	return (
		<Box sx={{position:'relative'}}>
			<OverlayLoader open={loading} />
			<HeaderPaper>
				<GridRow style={{ marginBottom: '0px' }}>
					<Grid item xs={6}>
						<Typography variant='h6'>PR-{paymentReceivedData?.id}</Typography>
					</Grid>
					<Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
						<Box>
							{/* <Button variant="body2" sx={{ color: '#2196F3', border: '1px solid #2196F3' }} onClick={() => setopenAttachmentMenu(true)}>
                <AttachFile sx={{ color: '#2196F3', fontSize: '16px', margin: '-3px 5px 0px 5px' }} />Attachments
              </Button> */}
							{/* {openAttachmentMenu &&
                <AttachFileMenu
                  openAttachmentMenu={openAttachmentMenu}
                  setopenAttachmentMenu={setopenAttachmentMenu}
                  onFileListUpdate={handleFileListUpdate}
                />
              )} */}
							{/* <Button variant="body2" sx={{ color: '#2196F3', border: '1px solid #2196F3', marginLeft: '10px' }} onClick={() => setHistoryDrawer(true)}>
                <History sx={{ color: '#2196F3', fontSize: '16px', margin: '-3px 5px 0 5px' }} />Payment History
              </Button>
              <HistoryDrawer
                openDrawer={historyDrawer}
                setHistoryDrawer={setHistoryDrawer}
                DrawerTitle={'Payment Received History'}
                timelineData={timelineData}
              /> */}
							<IconButton
								onClick={() =>  navigate('/payment-received')}
							>
								<Close />
							</IconButton>
						</Box>
					</Grid>
				</GridRow>
			</HeaderPaper>

			<HeaderPaper>
				<Box sx={{ marginTop: '-10px', padding: '10px' }}>
					<MUIButton
						variant='outlined'
						onClick={() =>
							navigate(`/payment-received/edit/${paymentReceivedData?.id}`)
						}
						startIcon={<EditIcon />}
					>
						Edit
					</MUIButton>

					{/* <Button
					variant='body2'
					sx={{
						color: '#2196F3',
						borderRight: '1px solid #2196F3',
						borderRadius: '0',
					}}
					onClick={handleMailMenuClick}
				>
					<MailOutline
						sx={{
							color: '#2196F3',
							fontSize: '16px',
							margin: '-3px 5px 0px 5px',
						}}
					/>
					Mails
					<KeyboardArrowDown
						sx={{
							color: '#2196F3',
							fontSize: '16px',
							margin: '-3px 5px 0px 5px',
						}}
					/>
				</Button>
				<Menu
					anchorEl={anchorElMail}
					open={openMailMenu}
					onClose={handleMenuClose}
				>
					<MenuItem
						onClick={() => {
							handleSendMail(id);
						}}
					>
						<MailOutline
							sx={{
								color: '#6C6C6C',
								fontSize: '16px',
								margin: '-3px 5px 0px 5px',
							}}
						/>
						Send Mail
					</MenuItem>
				</Menu> */}

					<MUIButton
						onClick={handleMailMenuClick}
						startIcon={<EmailOutlinedIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
					>
						MAILS
					</MUIButton>
					<Menu
						anchorEl={anchorElMail}
						open={openMailMenu}
						onClose={handleMenuClose}
					>
						<MenuItem
							onClick={() => {
								handleSendMail(id);
							}}
						>
							<MailOutline
								sx={{
									color: '#6C6C6C',
									fontSize: '16px',
									margin: '-3px 5px 0px 5px',
								}}
							/>
							Send Mail
						</MenuItem>
					</Menu>

					{/* <Button
					variant='body2'
					sx={{
						color: '#2196F3',
						borderRight: '1px solid #2196F3',
						borderRadius: '0',
					}}
					onClick={() => handlePdf(id)}
				>
					<UploadFileOutlined
						sx={{
							color: '#2196F3',
							fontSize: '16px',
							margin: '-3px 5px 0px 5px',
						}}
					/>
					PDF / Print
					 <KeyboardArrowDown sx={{ color: '#2196F3', fontSize: '16px', margin: '-3px 5px 0px 5px' }} /> 
				</Button> */}

					<MUIButton
						startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						onClick={() => handlePdf(id)}
					>
						Pdf/Print
					</MUIButton>

					{/* <Menu anchorEl={anchorElPDF} open={openPDFMenu} onClose={handleMenuClose} sx={{ '& .MuiPaper-root': { minWidth: '150px' } }}>
          <MenuItem onClick={()=>handlePdf(id)}>
            <MailOutline sx={{ color: '#6C6C6C', fontSize: '16px', margin: '-3px 5px 0px 5px' }} />
            PDF
          </MenuItem>
          <MenuItem onClick={() => window.print()}>
            <PrintOutlined sx={{ color: '#6C6C6C', fontSize: '16px', margin: '-3px 5px 0px 5px' }} />
            Print
          </MenuItem>
        </Menu> */}
					{/* 
				<Button
					variant='body2'
					sx={{
						color: '#2196F3',
						borderRight: '1px solid #2196F3',
						borderRadius: '0',
					}}
					onClick={handleThreeDotMenuClick}
				>
					<MoreVert sx={{ color: '#2196F3', margin: '-3px 5px 0px 5px' }} />
				</Button> */}

					<MUIButton
						startIcon={<Delete />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						onClick={() => {
							setOpenConfirmDialog(true);
							setDialogProps({
								onConfirm: () => handleDelete(paymentReceivedData?.id),
							});
						}}
					>
						Delete
					</MUIButton>

					{/* <MUIButton
						variant='outlined'
						sx={{
							fontSize: '12px',
							textTransform: 'capitalize',
							margin: '0 8px',
						}}
						endIcon={<ArrowDropDown />}
						onClick={handleThreeDotMenuClick}
					>
						More
					</MUIButton>

					<Menu
						anchorEl={anchorElThreeDot}
						open={openThreeDotMenu}
						onClose={handleMenuClose}
					>
					
						<MenuItem
							onClick={() => {
								setOpenConfirmDialog(true);
								setDialogProps({
									onConfirm: () => handleDelete(paymentReceivedData?.id),
								});
							}}
						>
							Delete
						</MenuItem>
					</Menu> */}
				</Box>
			</HeaderPaper>

			<Box sx={{ padding: '20px 0', background: 'white' }}>
				<Box
					sx={{
						margin: '10px 20px',
						boxShadow: ' 0px 0px 6px 0px #CCCCCC',
						padding: '50px 50px',
						height: ' 250mm',
					}}
				>
					<Grid container style={{ display: 'flex', alignItems: 'center' }}>
						<Grid xs={6.7}>
							<img src={Logo} alt='minnesota logo' style={{ width: '100%' }} />
							<GridRow>
								<Grid item xs={5} mt={-4}>
									<Typography variant='templateBody' fontSize={10}>
										1725 Cooperative Center Drive <br />
										Eagain MN 55121 - US
									</Typography>
								</Grid>
								<Grid item xs={7} mt={-4}>
									<Typography variant='templateBody' fontSize={10}>
										www.minesotacomputers.us <br />
										sales@minesotacomputers.us
									</Typography>
								</Grid>
							</GridRow>
						</Grid>
						<Grid
							xs={5.3}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-end',
							}}
							mt={4}
						>
							<Typography variant='templateHead' fontSize='2.3rem' mt={1}>
								Account Receivable
							</Typography>
							<Grid container sx={{ justifyContent: 'flex-end' }}>
								<Grid item xs={6} sx={{ textAlign: 'right' }}>
									<Typography variant='templateBody2' fontSize={13}>
										Payment Date:
									</Typography>
									<br />
									<Typography variant='templateBody2' fontSize={13}>
										Reference Number:
									</Typography>
									<br />
									<Typography variant='templateBody2' fontSize={13}>
										Payment Mode:
									</Typography>
								</Grid>
								<Grid item xs={5} sx={{ textAlign: 'left' }}>
									<Typography variant='templateBody' pl={1}>
										{convertDateToLongFormat(paymentReceivedData?.payment_date)}
									</Typography>
									<br />
									<Typography
										variant='templateBody'
										sx={{ wordWrap: 'break-word' }}
										pl={1}
									>
										{paymentReceivedData?.reference_number}
									</Typography>
									<br />
									<Typography
										variant='templateBody'
										sx={{ wordWrap: 'break-word', textTransform: 'capitalize' }}
										pl={1}
									>
										{paymentReceivedData?.payment_mode}
									</Typography>
								</Grid>
							</Grid>
							{/* <Grid container sx={{ justifyContent: 'flex-end' }}>
								<Grid xs={5} sx={{ textAlign: 'right' }}>
									
								</Grid>
								<Grid xs={2.7} sx={{ textAlign: 'left' }}>
									
								</Grid>
							</Grid>
							<Grid container sx={{ justifyContent: 'flex-end' }}>
								<Grid xs={5} sx={{ textAlign: 'right' }}>
									
								</Grid>
								<Grid xs={2.7} sx={{ textAlign: 'left' }}>
									
								</Grid>
							</Grid> */}
						</Grid>
					</Grid>

					<Grid
						container
						style={{ backgroundColor: '#EFF0F1', padding: '5px 20px' }}
						mt={5}
					>
						<Grid item xs={6}>
							<Typography variant='templateBody2'>Received From</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant='templateBody2'>Amount Received</Typography>
						</Grid>
					</Grid>
					<Grid container mt={2}>
						<Grid item xs={6} pl={2.5} sx={{ paddingRight: '150px' }}>
							<Typography
								component='p'
								variant='body2'
								// className='TextCapitalize'
							>
								{
									paymentReceivedData?.customer?.customer_billing_address[0]
										?.attention
								}
							</Typography>
							<Typography variant='body2' component={'span'}>
								{
									paymentReceivedData?.customer?.customer_billing_address[0]
										?.address
								}{' '}
								{
									paymentReceivedData?.customer?.customer_billing_address[0]
										?.city
								}{' '}
							</Typography>
							<Typography
								component={'span'}
								variant='body2'
								className='TextCapitalize'
							>
								{
									paymentReceivedData?.customer?.customer_billing_address[0]
										?.state?.name
								}{' '}
							</Typography>
							<Typography variant='body2' sx={{ width: '150px' }}>
								{
									paymentReceivedData?.customer?.customer_billing_address[0]
										?.zipcode
								}{' '}
							</Typography>
							<Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
								{
									paymentReceivedData?.customer?.customer_billing_address[0]
										?.country?.name
								}
							</Typography>
							<Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
								{paymentReceivedData?.customer?.phone}
							</Typography>
							<Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
								{paymentReceivedData?.customer?.email}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant='templateBody2' fontSize={'25px'}>
								${paymentReceivedData?.payment_made || 0}
							</Typography>
						</Grid>
					</Grid>

					<Grid
						container
						style={{ backgroundColor: '#EFF0F1', padding: '5px 20px' }}
						mt={2}
						mb={1}
					>
						<Grid item xs={1}>
							<Typography variant='templateBody2' fontSize='14px'>
								No.
							</Typography>
						</Grid>
						<Grid item xs>
							<Typography variant='templateBody2' fontSize='14px'>
								Invoice Number
							</Typography>
						</Grid>
						<Grid item xs>
							<Typography variant='templateBody2' fontSize='14px'>
								Invoice Date
							</Typography>
						</Grid>
						<Grid item xs>
							<Typography variant='templateBody2' fontSize='14px'>
								Invoice Amount
							</Typography>
						</Grid>
						<Grid item xs>
							<Typography variant='templateBody2' fontSize='14px'>
								Payment Amount
							</Typography>
						</Grid>
					</Grid>
					<Grid container pl={2.5}>
						<Grid item xs={1}>
							<Typography variant='body2'>{1}</Typography>
						</Grid>
						<Grid item xs={2.67}>
							<Typography variant='body2' color={'primary'}>
								{paymentReceivedData?.invoice?.invoice_number}
							</Typography>
						</Grid>
						<Grid item xs={2.69}>
							<Typography variant='body2'>
								{formatDate(paymentReceivedData?.invoice?.invoice_date)}
							</Typography>
						</Grid>
						<Grid item xs={2.7}>
							<Typography variant='body2'>
								${paymentReceivedData?.invoice?.total}
							</Typography>
						</Grid>
						<Grid item xs>
							<Typography variant='body2'>
								${paymentReceivedData?.payment_made}
							</Typography>
						</Grid>
					</Grid>
				</Box>

				{/* <Typography component='p' variant="subtitle1"
          sx={{margin: '80px 0 0 50px', fontSize: '18px', paddingBottom: '20px', 
          width: '128px',borderBottom: '3px solid #2196F3'}}>
          Display Journal
        </Typography>
        <Divider />
        <Box sx={{ marginLeft: '30px', }}>
          <GridRow>
            <Grid item xs={6}><Typography component='span' variant="body2Grey">Amount is displayed in your base currency USD</Typography>
              <Typography component='span' variant="body1" sx={{ backgroundColor: '#2E7D32', color: 'white', marginLeft: '5px', padding: '1px 5px' }}>USD</Typography></Grid>
            <Grid item xs={6} sx={{ textAlign: 'right', marginTop: '5px', paddingRight: '10px' }}>
              <ToggleButtonGroup value={btnGroupData} exclusive onChange={handleBtnGroup}>
                <ToggleButton value="Accrual" sx={{ paddingY: '0', textTransform: 'capitalize', fontSize: '12px' }}>Accrual</ToggleButton>
                <ToggleButton value="Cash" sx={{ paddingY: '0', textTransform: 'capitalize', fontSize: '12px' }}>Cash</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </GridRow>
        </Box>
        <Typography variant="body1" sx={{ margin: '20px 30px' }}>Invoice Payment - INV-1245879-012</Typography>
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0px 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}><Typography variant="body1bold">Account</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1bold">Debit</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1bold">Credit</Typography></Grid>
        </GridRow>
        <Divider />
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}><Typography variant="body1">Accounts Receivable</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">00</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">50.00 </Typography></Grid>
        </GridRow>
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}><Typography variant="body1">Undeposited Funds</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">48.25</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">0.00 </Typography></Grid>
        </GridRow>
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}><Typography variant="body1">Bank Fees and Charges</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">1.75</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">0.00 </Typography></Grid>
        </GridRow>
        <Divider />
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1bold">50.00</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1bold">50.00 </Typography></Grid>
        </GridRow> */}
			</Box>
			<ConfirmDialog
				title='Are you sure you want to delete'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				{...dialogProps}
			/>
		</Box>
	);
}

export default PaymentReceivedView;
const BtnStyles = {
	margin: '0 .2rem',
};
