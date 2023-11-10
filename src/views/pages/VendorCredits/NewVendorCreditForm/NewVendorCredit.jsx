import {
	Box,
	Button,
	Grid,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	ListItemSecondaryAction,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import CustomSelect from '../../../Components/Select/Select';
import CustomerConatctsList from '../../../Components/CustomerContacts/CustomerConatctsList';
import CustomDrawer from '../../../Components/Drawer/Drawer';
import SaleOrderCustomerView from '../../SalesOrder/NewSalesOrder/SaleOrderCustomerView';
import CustomerSearchModel from '../../CreditMemo/NewCreditMemo/CustomerSearchModel';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import TaxSection from '../../../Components/TaxSection/TaxSection';
import { LoadingButton } from '@mui/lab';
import MUIButton from '../../../Components/Button/MUIButton';
import FormField from '../../../Components/InputField/FormField';
import AddItem from '../../CreditMemo/AddItem/AddItem';
import { customersSingleApi } from '../../../../core/api/customer';
import SettingsIcon from '@mui/icons-material/Settings';
import { RemoveRedEye } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { decryptId } from '../../../../core/utils/helpers';
import { useParams } from 'react-router-dom';
import CopyModel from './CopyModel';
import BillTemplateDrawer from './BillTemplateDrawer';

const NewVendorCredit = ({ edit }) => {
	const { id } = useParams();
	const decryptedID = decryptId(id);
	const [openModel, setOpenModel] = useState(false);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [billView, setBillView] = useState(false);
	const [open, setOpen] = useState(false);
	const [clicked, setClicked] = useState(false);
	const [taxIdCustomer, setTaxIdCustomer] = useState(1);
	const [taxableCustomer, setTaxableCustomer] = useState('taxable');
	const [invoiceState, setInvoiceState] = useState([]);
	const [customerLoading, setCsutomerLoading] = useState(false);
	const [vendorCreditFiles, setVendorCreditFiles] = useState([]);
	const [selectedVendor, setSelectedVendor] = useState({});
	const [selectBill, setSelectBill] = useState({});

	const initialValues_ = {
		vendor_id: null,
		bill: null,
		vendor_credit: '',
		rmi_number: '',
		vendor_credit_date: '',
		credit_memo_items: [
			{
				//	isChecked: false,
				item_id: '',
				item_name: 'Type or click to select an item',
				quantity: 1,
				rate: 0,
				tax_amount: 0,
				tax_id: { taxIdCustomer },
				total: 1,
			},
		],
	};
	const formik = useFormik({
		initialValues: initialValues_,
		validationSchema: {},
		onSubmit: async values => {
			console.log(values);
		},
	});
	const navigate = useNavigate();
	const handleButtonClick = () => {
		console.log('hello ');
	};
	const gettingCustomerList = async () => {
		try {
			// setLoading(true);
			if (formik.values.customer_id) {
				const resp = await customersSingleApi(formik.values.customer_id);

				setTaxIdCustomer(resp.tax_id);
				setTaxableCustomer(resp.tax_preference);
				// setSelectedEmails(resp?.customer_contacts);
				// setCustomerList(resp);
			}
		} catch (error) {
			/* empty */
		} finally {
			// setLoading(false);
			// setUpdate(!update);
			// setUpdateCustomer(false)
		}
	};
	useEffect(() => {
		gettingCustomerList();
	});
	const handleFileInputChange = event => {
		const files = event.target.files;

		if (files.length > 0) {
			const newFiles = Array.from(files);
			setVendorCreditFiles(prevFiles => [...prevFiles, ...newFiles]);
			const allFiles = [...formik.values.credit_memo_files, ...newFiles];
			formik.setFieldValue('credit_memo_files', allFiles);
		} else {
			/* empty */
		}
	};
	const deletingFile = fileId => {
		setVendorCreditFiles(prevFiles => prevFiles.filter(f => f !== fileId));
	};
	const [pastedImage, setPastedImage] = useState(null);

	const handlePaste = event => {
		const items = (event.clipboardData || event.originalEvent.clipboardData)
			.items;
		for (let item of items) {
			if (item.type.indexOf('image') !== -1) {
				const file = item.getAsFile();
				const reader = new FileReader();

				reader.onload = () => {
					const imageData = reader.result;
					setPastedImage(imageData);
				};

				reader.readAsDataURL(file);
			}
		}
	};
	return (
		<Grid container>
			<Grid item sm={12}>
				<HeaderPaper>
					<Grid
						container
						rowSpacing={1}
						columnSpacing={{ xs: 1, sm: 2, md: 3 }}
					>
						<Grid item xs={6}>
							<Typography variant='h6' className='TextCapitalize'>
								{edit ? 'Edit Vendor Credits' : 'New Vendor Credits'}
							</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: 'right' }}>
							<IconButton
								onClick={() => navigate('/vendor-credits')}
								aria-label='delete'
							>
								<CloseIcon />
							</IconButton>
						</Grid>
					</Grid>
				</HeaderPaper>
			</Grid>

			<div style={{ position: 'relative' }}>
				<Paper sx={{ width: '100%', padding: '1.5rem 2rem 10rem 2rem' }}>
					<Grid item container>
						<Grid item xs={2} sx={{ ...labelStyle }}>
							<InputLabel>
								Vendor Name<span style={{ color: 'red' }}>*</span>
							</InputLabel>
						</Grid>
						<Grid item xs={4}>
							<CustomSelect
								id='vendor_id'
								placeholder='Select Vendor'
								touched={formik.touched?.customer_id}
								value={selectedVendor}
								options={[
									{ label: 'Vendor 1', value: '1' },
									{ label: 'Vendor 2', value: '2' },
								]}
								onChange={selected => {
									setSelectedVendor({
										value: selected.value,
										label: selected.label,
									});
									formik.setFieldValue('vendor_id', selected?.value);
								}}
								error={
									formik.touched?.customer_id &&
									formik.errors?.customer_id &&
									formik.errors.customer_id
								}
								isSearchable
								// isClearable
							/>
						</Grid>
						<Grid item xs={2} sx={{ ...labelStyle }}></Grid>
					</Grid>
					{formik.values.vendor_id && (
						<Grid item container>
							<Grid item xs={2} sx={{ ...labelStyle }}></Grid>
							<Grid item xs={4}>
								<Button onClick={() => setOpenDrawer(true)}>
									View Vendor Details
								</Button>
							</Grid>
						</Grid>
					)}

					{/* address container  */}
					<Grid item container>
						<Grid item xs={2}></Grid>
						{formik.values.customer_id ? (
							<Grid
								item
								sm={4}
								bgcolor='#f9f9fb'
								display='flex'
								justifgit
								yContent='space-between'
							>
								<Grid item xs={6}>
									{/* <Address
										billing
										selectedCustomer={selectedCustomer}
										gettingCustomerList={gettingCustomerList}
										customer_id={formik.values.customer_id}
										customer_billing_address={
											customerList?.customer_billing_address
										}
										customerList={customerList}
										loading={loading}
									/> */}
								</Grid>
								<Grid item xs={6}>
									{/* <Address
										shipping
										selectedCustomer={selectedCustomer}
										gettingCustomerList={gettingCustomerList}
										customer_billing_address={
											customerList?.customer_shipping_address
										}
										customerList={customerList}
										customer_id={formik.values.customer_id}
									/> */}
								</Grid>
							</Grid>
						) : (
							<></>
						)}
						{/* tax  */}
						{formik.values.customer_id && (
							<>
								<Grid item xs={6}></Grid>
								<Grid item xs={2}></Grid>
								{/* Tax  */}
								<Grid item xs={4}>
									<TaxSection
									// gettingCustomerList={gettingCustomerList}
									// texValues={texValues}
									// customerList={customerList}
									/>
								</Grid>
							</>
						)}
					</Grid>

					<>
						<Grid item container mt={2}>
							<Grid item xs={2} display='flex' alignItems='center'>
								<InputLabel>
									Bill#<span style={{ color: 'red' }}>*</span>
								</InputLabel>{' '}
							</Grid>
							<Grid item xs={4}>
								<CustomSelect
									id='bill'
									placeholder='Select Bill'
									touched={formik.touched?.bill}
									value={selectBill}
									options={[
										{ label: 'Bill 1', value: '1' },
										{ label: 'Bill 2', value: '2' },
									]}
									onChange={selected => {
										setSelectBill({
											value: selected?.value,
											label: selected?.label,
										});
										formik.setFieldValue('bill', selected?.value);
									}}
									error={
										formik.touched?.bill &&
										formik.errors?.bill &&
										formik.errors.bill
									}
									isSearchable
								/>
							</Grid>
						</Grid>
						{formik.values.bill && (
							<Grid item container>
								<Grid item xs={2} sx={{ ...labelStyle }}></Grid>
								<Grid item xs={4}>
									<Button
										startIcon={<RemoveRedEye />}
										onClick={() => setBillView(true)}
									>
										View Bills
									</Button>
								</Grid>
							</Grid>
						)}
						<Grid item container mt={2}>
							<Grid item xs={2}>
								<InputLabel>
									Vendor Credit#<span style={{ color: 'red' }}>*</span>
								</InputLabel>{' '}
							</Grid>
							<Grid item xs={4}>
								<FormField
									name='vendor_credit'
									value={formik.values.vendor_credit}
									onChange={formik.handleChange}
									size='small'
									isTouched={formik.touched?.vendor_credit}
									error={
										formik.touched?.vendor_credit &&
										formik.errors?.vendor_credit &&
										formik.errors?.vendor_credit
									}
									InputProps={{
										endAdornment: (
											<InputAdornment position='end'>
												<SettingsIcon />
											</InputAdornment>
										),
									}}
								/>
							</Grid>
						</Grid>
						<Grid item container mt={2}>
							<Grid item xs={2}>
								<InputLabel>
									RMI Number#<span style={{ color: 'red' }}>*</span>
								</InputLabel>{' '}
							</Grid>
							<Grid item xs={4}>
								<FormField
									name='rmi_number'
									value={formik.values.rmi_number}
									onChange={formik.handleChange}
									size='small'
									isTouched={formik.touched?.rmi_number}
									error={
										formik.touched?.rmi_number &&
										formik.errors?.rmi_number &&
										formik.errors?.rmi_number
									}
									InputProps={{
										endAdornment: (
											<InputAdornment position='end'>
												<SettingsIcon />
											</InputAdornment>
										),
									}}
								/>
							</Grid>
						</Grid>
						<Grid item container mt={2}>
							<Grid item xs={2}>
								<InputLabel>
									Vendor Credit Date<span style={{ color: 'red' }}>*</span>
								</InputLabel>{' '}
							</Grid>
							<Grid item xs={4}>
								<FormField
									type='date'
									name='vendor_credit_date'
									value={formik.values.vendor_credit_date}
									onChange={formik.handleChange}
									size='small'
									isTouched={formik.touched?.vendor_credit_date}
									error={
										formik.touched?.vendor_credit_date &&
										formik.errors?.vendor_credit_date &&
										formik.errors?.vendor_credit_date
									}
								/>
							</Grid>
						</Grid>
					</>

					{/* add row comp  */}
					<>
						{/* total calcaultion section  */}
						{/* <NewEstimateFormTotal /> */}
						<Grid
							item
							container
							sx={{ marginTop: '2rem' }}
							display='flex'
							justifyContent='flex-end'
						>
							{/* left section .. empty */}
							<Grid item xs={12} md={6}>
								{/* <Typography>Right Side</Typography> */}
							</Grid>

							<Grid item container spacing={1} mt={1}>
								<Grid item sm={12}>
									{/* formik.values.estimate_items.length > 0 */}
									<AddItem
										initialValues={initialValues_}
										formik={formik}
										isEdit={edit}
										clicked={clicked}
										setClicked={setClicked}
										taxIdCustomer={taxIdCustomer}
										taxableCustomer={taxableCustomer}
										invoiceState={invoiceState}
										loading={customerLoading}
									/>
								</Grid>
								<Grid item xs={6}>
									<Grid item xs={12}>
										<InputLabel>Customer Notes</InputLabel>
										<TextField
											fullWidth
											label='Notes'
											multiline
											rows={3}
											id='customer_note'
											value={formik.values.customer_note}
											onChange={formik.handleChange}
											// variant="outlined"
										/>
									</Grid>
								</Grid>
								<Grid item xs={6} display='flex' justifyContent='center' mt={1}>
									<Box
										sx={{
											// width: {
											//   xs: '100%',
											//   md: '70%',
											//   lg: '60%'
											// }
											width: '60%',
										}}
									>
										{/* <FieldTitle textAlign='center'>
                        Attach file(s) to Credit Memo
                      </FieldTitle> */}

										<label htmlFor='files'>
											<Grid container>
												<Grid item sm={6}>
													<MUIButton
														startIcon={<SendIcon />}
														sx={{
															border: '1px solid grey',
															color: 'black',
															textTransform: 'capitalize',
															padding: '6px 30px',
														}}
														variant='outlined'
														component='span'
													>
														Upload File
													</MUIButton>
												</Grid>
												<Grid item sm={6}>
													<MUIButton
														sx={{
															border: '1px solid grey',
															color: 'black',
															textTransform: 'capitalize',
															padding: '6px 30px',
														}}
														variant='outlined'
														onClick={() => setOpenModel(true)}
													>
														Copy / Paste File
													</MUIButton>
												</Grid>
											</Grid>

											<input
												id='files'
												type='file'
												multiple
												accept='.pdf'
												style={{ display: 'none' }}
												onChange={handleFileInputChange}
											/>
										</label>
										<List>
											{vendorCreditFiles?.map((file, index) => (
												<ListItem key={index}>
													<Typography>
														{(decryptedID && file.file_name) || file.name}
													</Typography>
													<ListItemSecondaryAction>
														<IconButton
															edge='end'
															aria-label='delete'
															onClick={() => deletingFile(file)}
														>
															<DeleteIcon />
														</IconButton>
													</ListItemSecondaryAction>
												</ListItem>
											))}
										</List>
									</Box>
								</Grid>
							</Grid>
						</Grid>
					</>

					{/* add new email/contact section  */}
					{/* {customerList?.id && ( */}
					<CustomerConatctsList
					// setSelectedEmails={setSelectedEmails}
					// gettingCustomerList={gettingCustomerList}
					// selectedEmails={selectedEmails}
					// customerList={customerList}
					// // emails={formik?.values?.email_to}
					/>
					{/* )} */}
				</Paper>

				<Box
					style={{
						position: 'fixed',
						bottom: 0,
						width: '83.2%',
						zIndex: 9,
					}}
				>
					<Paper elevation={5}>
						<Grid container style={{ padding: '0 1rem 1.2rem 1rem' }}>
							<Grid
								item
								xs={12}
								display='flex'
								alignItems='center'
								mt='2rem'
								pl='2rem'
							>
								<Stack direction='row' spacing={2}>
									<LoadingButton
										type='submit'
										onClick={() => handleButtonClick('save_as_draft')}
										//			  disabled={saveAsDraftLoading}
										//			  loading={saveAsDraftLoading}
										variant='contained'
									>
										Save as Draft
									</LoadingButton>
									<LoadingButton
										variant='contained'
										type='submit'
										onClick={() => handleButtonClick('save_and_send')}
										//		  disabled={saveAndSendLoading}
										//		  loading={saveAndSendLoading}
									>
										Save and send
									</LoadingButton>
									<MUIButton variant='outlined' router to='/price-quote'>
										Cancel
									</MUIButton>
								</Stack>
							</Grid>
						</Grid>
					</Paper>
				</Box>
			</div>
			<CustomDrawer
				open={openDrawer}
				onClose={() => setOpenDrawer(false)}
				dWidth
			>
				<SaleOrderCustomerView
					onClose={() => setOpenDrawer(false)}
					// customerList={customerList}
				/>
			</CustomDrawer>
			<CustomDrawer open={billView} onClose={() => setBillView(false)}>
				<BillTemplateDrawer />
			</CustomDrawer>
			<CopyModel
				open={openModel}
				onClose={() => setOpenModel(false)}
				handlePaste={handlePaste}
				pastedImage={pastedImage}
			/>
			<CustomerSearchModel open={open} onClose={() => setOpen(false)} />
		</Grid>
	);
};

export default NewVendorCredit;
const labelStyle = {
	display: 'flex',
	alignItems: 'center',
};
