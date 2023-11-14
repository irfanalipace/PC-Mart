/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Divider,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';
import GridRow from '../../../Components/GridRow/GridRow';
import { Box } from '@mui/system';
import {
	AccountBox,
	AccountCircle,
	AddCircleOutline,
	Edit,
	ExpandMoreOutlined,
	LocalPhone,
	PhoneAndroid,
	Shortcut,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../Components/Modal/Dialog';
import VendorContactsForm from '../../../Components/VendorContacts/VendorContactsForm';
import VendorEditDetails from '../../../Components/VendorContacts/VendorEditDetailsModel';
import {
	formatDate,
	generateEncryptedID,
} from '../../../../core/utils/helpers';
import VendorAddressForm from '../../../Components/Address/AddressForm/VendorAddressForm';

function OverviewTab({
	vendorData,
	handleDelete,
	getsinglevendor,
	setOpenConfirmDialog,
	setDialogProps,
}) {
	const navigate = useNavigate();
	const [addressFormOpen, setAddressFormOpen] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState();
	const [isEdit, setIsEdit] = useState(false);
	const [addressType, setAddressType] = useState('');
	const [AddressModelTitle, setAddressModelTitle] = useState();
	const [openContactDialog, setopenContactDialog] = useState(false);
	const [openVendorEdit, setopenVendorEditDialog] = useState(false);
	const handleAddAddressForm = addressType => {
		setAddressFormOpen(!addressFormOpen);
		setAddressType(addressType);
	};
	const handleCloseMenu = () => {
		setAddressModelTitle(null);
		setSelectedAddress(null);
	};
	const handleContactPerson = e => {
		e.stopPropagation();
		setopenContactDialog(true);
	};
	const openContactModal = () => {
		setopenContactDialog(!openContactDialog);
	};
	const handleSendMail = id => {
		navigate(`/send/email/vendor/${generateEncryptedID(id)}`);
	};

	return (
		<>
			<Grid container>
				<Grid
					item
					xs={4.5}
					sx={{ borderRight: 1, borderColor: 'divider' }}
					pt={1}
				>
					<Typography variant='body2' style={{ marginBottom: '10px' }}>
						<AccountCircle style={{ marginBottom: '-7px', color: '#707070' }} />
						{vendorData?.first_name}
					</Typography>
					<Divider />
					<GridRow style={{ marginTop: '10px' }}>
						<Grid item xs={1.5}>
							<AccountBox fontSize='large' sx={{ color: '#C5C5C5' }} />
						</Grid>
						<Grid item xs={10.5}>
							<Typography variant='subtitle2'>
								{vendorData?.display_name || 'N/A'}
							</Typography>
							<Typography variant='body2'>
								{vendorData?.email || 'N/A'}
							</Typography>
							<Typography variant='body2'>
								<LocalPhone sx={{ marginBottom: '-3px', fontSize: '15px' }} />
								{vendorData?.work_phone || 'N/A'}
							</Typography>
							<Typography variant='body2'>
								<PhoneAndroid
									fontSize='small'
									sx={{ marginBottom: '-3px', fontSize: '15px' }}
								/>
								{vendorData?.phone || 'N/A'}
							</Typography>
							<GridRow style={{ marginTop: '1px' }}>
								<Grid item style={{ paddingLeft: '24px' }}>
									<Typography
										color='primary'
										variant='caption'
										sx={{
											borderRight: 1,
											borderColor: 'divider',
											paddingRight: '8px',
											cursor: 'pointer',
										}}
										onClick={() => setopenVendorEditDialog(true)}
									>
										Edit
									</Typography>
								</Grid>
								<Grid item style={{ paddingLeft: '6px' }}>
									<Typography
										color='primary'
										variant='caption'
										sx={{
											borderRight: 1,
											borderColor: 'divider',
											paddingRight: '8px',
											cursor: 'pointer',
										}}
										onClick={() => {
											handleSendMail(vendorData?.id);
										}}
									>
										Send Email
									</Typography>
								</Grid>
								{/* <Grid item style={{ paddingLeft: '6px' }}>
									<Typography
										color='primary'
										variant='caption'
										sx={{
											borderRight: 1,
											borderColor: 'divider',
											paddingRight: '8px',
										}}
									>
										Invite to Portal
									</Typography>
								</Grid> */}
								<Grid item style={{ paddingLeft: '6px' }}>
									<Typography
										color='primary'
										variant='caption'
										sx={{ paddingRight: '8px', cursor: 'pointer' }}
										onClick={() => {
											setOpenConfirmDialog(true);
											setDialogProps({
												onConfirm: () => handleDelete(vendorData?.id),
											});
										}}
									>
										Delete
									</Typography>
								</Grid>
							</GridRow>
						</Grid>
					</GridRow>
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreOutlined />}>
							<Typography>Address</Typography>
						</AccordionSummary>
						<AccordionDetails>
							{vendorData?.vendor_billing_address?.length > 0 && (
								<GridRow style={{ marginBottom: '0' }}>
									<Grid item xs={6}>
										<Typography variant='body2'>Billing Address</Typography>
									</Grid>
									<Grid
										item
										xs={6}
										sx={{
											textAlign: 'right',
											paddingRight: '10px',
										}}
									>
										<Edit
											color='primary'
											fontSize='small'
											sx={{ cursor: 'pointer' }}
											onClick={() => {
												handleCloseMenu();
												handleAddAddressForm('billing');
												setIsEdit(true);
												setAddressModelTitle('Billing Address');
												setSelectedAddress(
													vendorData?.vendor_billing_address[0]
												);
											}}
										/>
									</Grid>
								</GridRow>
							)}
							{vendorData?.vendor_billing_address?.map((row, index) => (
								<Box key={index}>
									<Typography variant='subtitle2'>
										{vendorData?.vendor_billing_address[index]?.attention ||
											'N/A'}
									</Typography>
									<Typography variant='body2'>
										{vendorData?.vendor_billing_address[index]?.address ||
											'N/A'}
									</Typography>
									<Typography variant='body2'>
										{vendorData?.vendor_billing_address[index]?.address2}{' '}
									</Typography>
									<Typography variant='body2' className='TextCapitalize'>
										{' '}
										{vendorData?.vendor_billing_address[index]?.city || 'N/A'},
										{vendorData?.vendor_billing_address[index]?.state || 'N/A'},
										{vendorData?.vendor_billing_address[index]?.zipcode ||
											'N/A'}
									</Typography>
									<Typography variant='body2'>
										Phone:
										{vendorData?.vendor_billing_address[index]?.phone || 'N/A'}
									</Typography>
									<Typography variant='body2'>
										Fax:
										{vendorData?.vendor_billing_address[index]?.fax}
									</Typography>
									<Typography variant='body2' className='TextCapitalize'>
										{vendorData?.vendor_billing_address[index]?.country ||
											'N/A'}
									</Typography>
								</Box>
							))}
						</AccordionDetails>
						<AccordionDetails>
							{vendorData?.vendor_shipping_address?.length > 0 && (
								<GridRow style={{ marginBottom: '0' }}>
									<Grid item xs={6}>
										<Typography variant='body2'>Shipping Address</Typography>
									</Grid>
									<Grid
										item
										xs={6}
										sx={{ textAlign: 'right', paddingRight: '10px' }}
									>
										<Edit
											color='primary'
											fontSize='small'
											sx={{ cursor: 'pointer' }}
											onClick={() => {
												handleCloseMenu();
												handleAddAddressForm('shipping');
												setIsEdit(true);
												setAddressModelTitle('Shipping Address');
												setSelectedAddress(
													vendorData?.vendor_shipping_address[0]
												);
											}}
										/>
									</Grid>
								</GridRow>
							)}

							{vendorData?.vendor_shipping_address?.map((row, index) => (
								<Box key={index} mt={2}>
									<Typography variant='subtitle2'>
										{vendorData?.vendor_shipping_address[index]?.attention ||
											'N/A'}
									</Typography>
									<Typography variant='body2'>
										{vendorData?.vendor_shipping_address[index]?.address ||
											'N/A'}
									</Typography>
									<Typography variant='body2'>
										{vendorData?.vendor_shipping_address[index]?.address2}
									</Typography>
									<Typography variant='body2' className='TextCapitalize'>
										{vendorData?.vendor_shipping_address[index]?.city || 'N/A'},
										{vendorData?.vendor_shipping_address[index]?.state || 'N/A'}
										,
										{vendorData?.vendor_shipping_address[index]?.zipcode ||
											'N/A'}
									</Typography>
									<Typography variant='body2'>
										Phone:
										{vendorData?.vendor_shipping_address[index]?.phone || 'N/A'}
									</Typography>
									<Typography variant='body2'>
										Fax:
										{vendorData?.vendor_shipping_address[index]?.fax || 'N/A'}
									</Typography>
									<Typography variant='body2' className='TextCapitalize'>
										{vendorData?.vendor_shipping_address[index]?.country ||
											'N/A'}
									</Typography>
								</Box>
							))}

							<Button
								onClick={() => {
									handleCloseMenu();
									handleAddAddressForm('shipping');
									setAddressModelTitle('Add Additional Address');
								}}
							>
								Add Additional Address
							</Button>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreOutlined />}>
							<Typography>Other Details</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<GridRow>
								<Grid item xs={6}>
									<Typography variant='body2Grey' component={'p'}>
										Default Currency
									</Typography>
									<Typography variant='body2Grey' component={'p'}>
										Payment Terms
									</Typography>
									<Typography variant='body2Grey' component={'p'}>
										Website
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant='body2'>
										{vendorData?.currency || 'N/A'}
									</Typography>
									<Typography variant='body2'>
										{vendorData?.term?.term_name || 'N/A'}
									</Typography>
									<Typography variant='body2'>
										{vendorData?.website || 'N/A'}
									</Typography>
								</Grid>
							</GridRow>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreOutlined />}>
							<Typography>
								Contact Person ({vendorData?.vendor_contacts?.length})
							</Typography>
							<IconButton
								sx={{
									position: 'absolute',
									right: '40px',
									marginTop: '-8px',
								}}
								onClick={handleContactPerson}
							>
								<AddCircleOutline color='primary' />
							</IconButton>
						</AccordionSummary>
						<AccordionDetails>
							{vendorData?.vendor_contacts?.map((row, index) => (
								<Box key={index} mb={1}>
									<Typography variant='subtitle2'>
										{vendorData?.vendor_contacts[index]?.salutation}
										{vendorData?.vendor_contacts[index]?.first_name || 'N/A'}
										{vendorData?.vendor_contacts[index]?.last_name || 'N/A'}
									</Typography>
									<Typography variant='body2'>
										{vendorData?.vendor_contacts[index]?.email || 'N/A'}
									</Typography>
									<Typography variant='body2'>
										{vendorData?.vendor_contacts[index]?.designation ||
											'Designation: N/A'}
									</Typography>
									<Typography variant='body2'>
										{vendorData?.vendor_contacts[index]?.department ||
											'Department: N/A'}
									</Typography>
									<Typography variant='body2'>
										<LocalPhone
											sx={{ marginBottom: '-3px', fontSize: '15px' }}
										/>
										{vendorData?.vendor_contacts[index]?.work_phone ||
											'Work Phone: N/A'}
									</Typography>
									<Typography variant='body2'>
										<PhoneAndroid
											fontSize='small'
											sx={{ marginBottom: '-3px', fontSize: '15px' }}
										/>
										{vendorData?.vendor_contacts[index]?.mobile ||
											'Mobile Number: N/A'}
									</Typography>
								</Box>
							))}
						</AccordionDetails>
					</Accordion>
					{/* {vendorData?.is_portal_access === 0 && (
						<Box
							sx={{
								backgroundColor: '#BDE0FC',
								padding: '20px',
								margin: '20px 10px',
								borderRadius: '8px',
							}}
						>
							<GridRow>
								<Grid item xs={1.2} sx={{ marginTop: '-70px' }}>
									<Collections />
								</Grid>
								<Grid item xs={10.8}>
									<Typography variant='body2'>
										Vendor Portal allows your vendors to keep track of all
										the transactions between them and your business. Learn More
									</Typography>
									<Button
										variant='contained'
										size='small'
										sx={{ marginTop: '10px' }}
									>
										Enable Portal
									</Button>
								</Grid>
							</GridRow>
						</Box>
					)} */}
					{/* {vendorData?.is_portal_access === 1 && (
						<Box
							sx={{
								backgroundColor: '#F2FFF0',
								padding: '20px',
								margin: '20px 10px',
								borderRadius: '8px',
							}}
						>
							<Grid container>
								<Grid item xs={1.2}>
									<ContactEmergency />
								</Grid>
								<Grid item xs={10.8}>
									<Typography variant='body2'>
										Would you like to know how much your vendors like your
										service?
									</Typography>
									<Button
										variant='contained'
										size='small'
										sx={{ marginTop: '10px' }}
									>
										Request Review
									</Button>
								</Grid>
							</Grid>
						</Box>
					)} */}
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreOutlined />}>
							<Typography>Record Info</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<GridRow>
								<Grid item xs={6}>
									<Typography variant='body2Grey' component={'p'}>
										Vendor ID
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant='body2'>
										{vendorData?.id || 'N/A'}
									</Typography>
								</Grid>
							</GridRow>
							{/* <GridRow>
								<Grid item xs={6}>
									<Typography variant='body2Grey' component={'p'}>
										Default Currency
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant='body2'>
										{vendorData?.currency || 'N/A'}
									</Typography>
								</Grid>
							</GridRow> */}
							<GridRow>
								<Grid item xs={6}>
									<Typography variant='body2Grey' component={'p'}>
										Created At
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant='body2'>
										{formatDate(vendorData?.created_at) || 'N/A'}
									</Typography>
								</Grid>
							</GridRow>
						</AccordionDetails>
					</Accordion>
				</Grid>
				<Grid item xs={7.5} pt={2}>
					<Grid container>
						<Grid item xs={1.5} style={{ padding: '10px 15px' }}>
							<Box
								sx={{
									border: '1px solid #1976D2',
									textAlign: 'center',
									borderRadius: '8px',
									padding: '5px',
								}}
							>
								<Shortcut sx={{ color: '#1976D2' }} />
							</Box>
						</Grid>
						<Grid item xs={10.5}>
							<Typography variant='body1'>
								What's Next for Your Vendor?
							</Typography>
							<Typography variant='body2' pr={5}>
								Your vendor has been added. Create and send a purchase order or
								bills to your vendor for the items you want to sell to them.
							</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Button
									variant='contained'
									size='small'
									sx={{
										margin: '10px 10px 0 0',
										'&:hover': { backgroundColor: '#E0E0E0' },
										backgroundColor: '#E0E0E0',
										color: 'black',
									}}
									onClick={e => {
										e.stopPropagation();
										navigate(
											`/purchase-orders/new?vendorId=${generateEncryptedID(
												vendorData?.id
											)}`
										);
									}}
								>
									New Purchase Order
								</Button>
								<Button
									variant='contained'
									size='small'
									sx={{ margin: '10px 10px 0 0' }}
									onClick={e => {
										e.stopPropagation();
										navigate(`/bills/new?vendorId=${vendorData?.id}`);
									}}
								>
									New Bill
								</Button>
								{/* <Dropdown>
                                    <HeaderMenuButton
                                        onClick={e => e.stopPropagation()}
                                        sx={{
                                            '&:hover': { border: '1px solid #1976D2' },
                                            backgroundColor: 'transparent',
                                            border: '1px solid #1976D2',
                                            borderRadius: '8px',
                                            padding: '1px',
                                            marginTop: '8px'
                                        }}>
                                        <MoreVert sx={{ color: '#1976D2' }} />
                                    </HeaderMenuButton>
                                    <Menu slots={{ listbox: StyledListbox }}>
                                        <StyledMenuItem> Don't Show again</StyledMenuItem>
                                    </Menu>
                                </Dropdown> */}
							</Box>
						</Grid>
					</Grid>
					<Divider sx={{ margin: '20px 0' }} />
					<Box sx={{ padding: '0 10px' }}>
						<Typography variant='body2Grey'>Payable Due Period</Typography>
						<Typography variant='body2'>
							{vendorData?.term?.term_name || 'N/A'}
						</Typography>
					</Box>
					{/* <Box sx={{ padding: '10px 10px' }}>
						<Typography variant='body1bold'> Receivable</Typography>
					</Box> */}
				</Grid>
			</Grid>
			<Modal
				title={AddressModelTitle}
				open={addressFormOpen}
				onClose={handleAddAddressForm}
				sx={{
					position: 'absolute',
					right: 20,
					top: 18,
				}}
			>
				{/* Adding Address Form */}
				{addressFormOpen && (
					<VendorAddressForm
						onClose={handleAddAddressForm}
						addressFormOpen={addressFormOpen}
						type={addressType}
						address={isEdit && selectedAddress}
						onSave={getsinglevendor}
						vendor_id={vendorData?.id}
					/>
				)}
			</Modal>
			<Modal
				title='Add contact person'
				open={openContactDialog}
				onClose={openContactModal}
			>
				{openContactDialog ? (
					<VendorContactsForm
						onSave={getsinglevendor}
						onClose={openContactModal}
						vendor_id={vendorData?.id}
					/>
				) : null}
			</Modal>
			<Modal
				title='Edit Vendor'
				open={openVendorEdit}
				onClose={() => setopenVendorEditDialog(false)}
			>
				{openVendorEdit ? (
					<VendorEditDetails
						onSave={getsinglevendor}
						onClose={() => setopenVendorEditDialog(false)}
						vendor_id={vendorData?.id}
					/>
				) : null}
			</Modal>
		</>
	);
}

export default OverviewTab;
