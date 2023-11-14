import {
	Box,
	CircularProgress,
	Divider,
	Grid,
	IconButton,
	Menu,
	Paper,
	Typography,
} from '@mui/material';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import MUIButton from '../../../Components/Button/MUIButton';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowDropDown } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

import {
	addSalesOrderFielApi,
	convertingToInvoiceApi,
	deleteSaleOrder,
	deleteSalesOrderFielApi,
	getPdfUrlApi,
	viewSalesOrder,
} from '../../../../core/api/salesorders';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import ActivityTimeLine from '../../../Components/ActivityTimeLine/ActivityTimeLine';
import {
	StatusColor,
	convertDateToLongFormat,
	decryptId,
} from '../../../../core/utils/helpers';
import { Stack } from '@mui/system';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import AttachmentCard from '../../../Components/FileUpload/AttachmentCard';
const TABS = {
	VIEW: 'VIEW',
	HISTORY: 'HISTORY',
};

const tabUnderlineStyles = {
	borderBottom: '2px solid #66B2FF',
	fontWeight: 550,
	cursor: 'pointer',
	borderRadius: '3px',
	color: '#66B2FF',
};

const ViewSalesOrder = ({ id, setRefresh }) => {
  const [activeTab, setActiveTab] = useState(TABS.VIEW);
  const [saleorder, setSaleOrder] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [showMenuItem, setShowMenu] = useState(null);
  const [files, setFiles] = useState([]);
  const [emailMenuAnchor, setEmailMenuAnchor] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

	const idDecrypted = decryptId(id);
	const navigate = useNavigate();
	const open = Boolean(anchorEl);
	const openFile = Boolean(anchorE2);
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleFileClick = event => {
		setAnchorE2(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleFileClose = () => {
		setAnchorE2(null);
	};

	useEffect(() => {
		getSaleOrder();
	}, [id]);
	console.log(id);

	const getSaleOrder = async () => {
		try {
			setLoading(true);

			const saleorder = await viewSalesOrder(idDecrypted);
			setSaleOrder(saleorder);
			setFiles(saleorder?.sale_order_file);
		} catch (e) {
			navigate('/sales-orders');
			console.log(e);
		} finally {
			setLoading(false);
		}
	};
	const handleDelete = async id => {
		try {
			const res = await deleteSaleOrder(id);
			if (res) {
				navigate('/sales-orders');
				setRefresh(prev => parseInt(prev) + 1);
			}
		} catch (err) {
			console.log('err', err);
		}
	};

	const showingMenu = event => {
		setShowMenu(event.currentTarget);
	};
	const hidingMenu = () => {
		setShowMenu(null);
	};



  const submitFilesToApi =  (newFiles) => {
      return  addSalesOrderFielApi({
        attachments: newFiles,
        sale_order_id: decryptId(id),
      });
  };

  const deleteFile = async (id) => {
    return  deleteSalesOrderFielApi(id);
   
 };
  // invoice conversion
  const convertingToInvoice = async () => {
    try {
      setIsLoading(true);
      const resp = await convertingToInvoiceApi({ id: idDecrypted });
      notyf.success(resp?.message);
      navigate("/invoices");
      // setRefresh(prev => prev + 1);
    } catch (error) {}
    setIsLoading(false);
  };
 

 

	// send mail
	const openEmailMenu = event => {
		setEmailMenuAnchor(event.currentTarget);
	};

	const closeEmailMenu = () => {
		setEmailMenuAnchor(null);
	};

	const handleSaleOrderMail = id => {
		navigate(`/send/email/sale_order/${id}`);
	};
	const downloadPdf = async () => {
		// alert()
		try {
			const resp = await getPdfUrlApi({ id: idDecrypted });
			console.log('uuuuu', resp);
			window.open(resp?.data, '_blank');
		} catch (error) {}
	};
	const tbCellStyle = {
		padding: 1,
	};

	const menuItems = [
		{
			label: 'Send Mail',
			onClick: () => {
				closeEmailMenu();
				navigate(`/send/email/sale_order/${id}`);
			},
		},
	];
	const columns = [
		{ id: '', label: 'No.', key: 'index' },
		{ id: '', label: 'Items Decription', key: 'item_name' },
		{ id: '', label: 'Qty', key: 'quantity' },
		{ id: '', label: 'Rate(USD)', key: 'rate' },
		{ id: '', label: 'Amount(USD)', key: 'total' },
	];
	const info = [
		{ label: 'Sales Order:', value: saleorder?.sale_order_number },
		{
			label: 'Sale Order Date:',
			value: convertDateToLongFormat(saleorder?.sale_order_date),
		},
		{
			label: 'Terms:',
			value: saleorder?.terms?.term_name,
		},
		{ label: 'Payment Mode:', value: 'Bank Transfer' },
		{ label: 'Delivery Terms:', value: 'Fedex' },
	];

	return (
		<Box sx={{ position: 'relative' }}>
			<HeaderPaper>
				<Grid item container>
					<Grid item sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant='h6'>
							{saleorder?.customer?.first_name}&nbsp;
							{saleorder?.customer?.last_name}
						</Typography>
					</Grid>
					<Grid
						item
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

            <AttachmentCard
              deleteApi={deleteFile}
              submitFilesToApi={submitFilesToApi}
              setFiles={setFiles}
              files={files}
              showMenuItem={showMenuItem}
              hidingMenu={hidingMenu}
            />

						<IconButton onClick={() => navigate('/sales-orders')}>
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
			</HeaderPaper>

			<Grid item sm={12}>
				<Paper sx={{ padding: '1.5rem' }}>
					{saleorder?.status === 'draft' && (
						<MUIButton
							variant='outlined'
							onClick={() => navigate(`/sales-orders/edit/${id}`)}
							startIcon={<EditIcon />}
						>
							Edit
						</MUIButton>
					)}

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
					{/* <MUIButton
						  startIcon={<ShareOutlinedIcon fontSize='small' />}
						  variant='outlined'
						  sx={{ ...BtnStyles }}
					  >
						  Share
					  </MUIButton> */}
					<MUIButton
						startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						onClick={downloadPdf}
					>
						Pdf/Print
					</MUIButton>
				</Paper>
			</Grid>

			<Paper sx={{ padding: '1.5rem', margin: '1rem 0' }}>
				<Grid item container my={4}>
					<Grid item xs={12} display='flex'>
						<Typography
							onClick={() => setActiveTab(TABS.VIEW)}
							sx={
								activeTab === TABS.VIEW
									? { ...tabUnderlineStyles, padding: '0 .5rem' }
									: { cursor: 'pointer', padding: '0 .5rem' }
							}
						>
							{TABS.VIEW}
						</Typography>
						<Typography
							onClick={() => setActiveTab(TABS.HISTORY)}
							sx={
								activeTab === TABS.HISTORY
									? { ...tabUnderlineStyles, padding: '0 .5rem' }
									: { cursor: 'pointer', padding: '0 .5rem' }
							}
						>
							{TABS.HISTORY}
						</Typography>
					</Grid>
				</Grid>
				{TABS.VIEW === activeTab && (
					<>
						{saleorder?.status !== 'accepted' && (
							<Paper sx={{ padding: '1rem' }}>
								<Grid item container>
									<Grid item sm={9}>
										<Stack
											direction='row'
											display='flex'
											alignItems='center'
											spacing={2}
										>
											{/* <NoteOutlinedIcon /> */}
											{/* <img src={vector} alt='invoice' /> */}
											<Box>
												<Typography>Convert to Invoice</Typography>
												<Typography variant='caption'>
													Create a Invoice for this Sales order to confirm the
													sell and bill your customer
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
											alignItems: 'center',
										}}
									>
										{isLoading ? (
											<CircularProgress />
										) : (
											<MUIButton
												sx={{ textTransform: 'capitalize' }}
												onClick={convertingToInvoice}
											>
												Convert to Invoice
											</MUIButton>
										)}
									</Grid>
								</Grid>
							</Paper>
						)}
						<Box mt={3}>
							<ViewTemplates
								title='Sales Order'
								apiData={saleorder}
								data={saleorder?.sale_order_items}
								columns={columns}
								status={saleorder?.status}
								headerInfo={info}
								bankDetails
								showAddress
								shippingAddress={true}
								addressData={saleorder?.customer}
							/>
						</Box>
					</>
				)}

				{TABS.HISTORY === activeTab && (
					<Box ml={8}>
						<Paper>
							<ActivityTimeLine activityData={activityData} />
						</Paper>
					</Box>
				)}
			</Paper>
			<OverlayLoader open={loading} />

			<ConfirmDialog
				title='Are you sure you want to delete'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				{...dialogProps}
			/>
		</Box>
	);
};

export default ViewSalesOrder;
const BtnStyles = {
	margin: '0 .2rem',
};
