import { useEffect, useState } from 'react';
import Select from 'react-select';

// mui components
import {
	Grid,
	Typography,
	Box,
	TextField,
	Divider,
	IconButton,
	Paper,
	Link,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';

// yup
import * as Yup from 'yup';

import { useFormik } from 'formik';

// apis
import {
	getCustomersApi,
	getPriceListApi,
	getSalesPersonApi,
	getSingeSaleOrderApi,
} from '../../../../core/api/estimate';
import {
	customersSingleApi,
	getPeymentTermsApi,
	getTaxesApi,
} from '../../../../core/api/customer';
// common
import Address from '../../../Components/Address/Address/Address';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import FormField from '../../../Components/InputField/FormField';
import AddItem from '../../Estimate/NewEstimate/AddItem/AddItem';
import MUIButton from '../../../Components/Button/MUIButton';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import {
	decryptId,
	formatDateToYYYYMMDD,
	goBack,
} from '../../../../core/utils/helpers';
import CustomerConatctsList from '../../../Components/CustomerContacts/CustomerConatctsList';
import {
	createSaleOrderApi,
	deleteSalesOrderFielApi,
	updateSaleOrderApi,
} from '../../../../core/api/salesorders';
import TaxSection from '../../../Components/TaxSection/TaxSection';
import { useNavigate, useParams } from 'react-router-dom';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import CustomDrawer from '../../../Components/Drawer/Drawer';
import SaleOrderCustomerView from './SaleOrderCustomerView';
import { LoadingButton } from '@mui/lab';
import CustomSelect from '../../../Components/Select/Select';
import CustomerField from '../../../Components/CustomerField/CustomerField';
import { useGenerateNumber } from '../../../Components/GenerateNumber/GenerateNumber';
import CustomFileupload from '../../../Components/CustomeFileUpload/CustomeFileupload';
import FilesModule from '../../../Components/FileUpload/FilesModule';

const SalesOrderForm = ({ edit }) => {
	const navigate = useNavigate();
	let params = useParams();
	const id = decryptId(params.id);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [customerList, setCustomerList] = useState('');
	const [selectedEmails, setSelectedEmails] = useState([]);
	const [customerLoading, setCsutomerLoading] = useState(false);
	const [salesPersonList, setSalesPersonList] = useState([]); //options
	const [salesLoading, setSalesLoading] = useState(false);
	const [selectedSalesPerson, setSelectedSalesPerson] = useState(null); //def value
	const [terms, setTerms] = useState([]);
	const [selectedTerms, setSelectedTerms] = useState('');
	const [termsLoading, setTermsLoading] = useState(false);
	const [taxIdCustomer, setTaxIdCustomer] = useState(1);
	const [taxableCustomer, setTaxableCustomer] = useState('taxable');
	const [btnType, setBtnType] = useState('');
	const [texValues, setTexValues] = useState([]);
	const [singleSaleOrder, setSingleSaleOrder] = useState('');
	const [clicked, setClicked] = useState(false);
	const [customerViewOpen, setCustomerViewOpen] = useState(false);

	const [saveAsDraftLoading, setSaveAsDraftLoading] = useState(false);
	const [saveAndSendLoading, setSaveAndSendLoading] = useState(false);
	const closeCustomerView = () => {
		setCustomerViewOpen(!customerViewOpen);
	};
	const paymentMode = [
		{ value: 'cc', text: 'Credit Card' },
		{ value: 'paypal', text: 'PayPal' },
		{ value: 'cheque', text: 'Cheque' },
		{ value: 'wire', text: 'Wire' },
		{ value: 'ach', text: 'ACH' },
	];
	// formikmode of payent : wire, cc, ach, square, cheque
	const initialValues_ = {
		customer_id: '',
		// taxCheckBox: "taxExempt",
		sales_person_id: '',
		sale_order_number: '',
		reference_number: '',
		sale_order_date: formatDateToYYYYMMDD(new Date()), // current Date,
		// shipment_date:  formatDateToYYYYMMDD(new Date()),
		// reference_number: "",
		mode_of_payment: '',
		term_id: '',
		// subject: "",
		adjustment_description: '',
		customer_note: '',
		terms_and_condition: '',
		sale_order_files: [],
		email_to: [],
		sub_total: 0,
		discount: 0,
		tax_amount: 0,
		discount_type: 'Percentage',
		shipping_charges: 0,
		adjustment: 0,
		items_rates_are:
			taxableCustomer === 'taxable' ? 'tax_exclusive' : 'tax_inclusive',
		total: 0,
		sale_order_items: [
			{
				// item_id: '' ,
				item_name: 'Type or click to select an item',
				quantity: 1,
				rate: 0,
				tax_amount: 0,
				tax_id: { taxIdCustomer },
				total: 0,
			},
		],
	};
	const [initialValues, setInitialValues] = useState(initialValues_);
	const validationSchema = Yup.object().shape({
		customer_id: Yup.string().required('Customer  is required'),
		sales_person_id: Yup.string().required('Sale person is required'),
		// reference_number: Yup.string().required("Reerence number is required"),
		term_id: Yup.string().required('This field  is required'),

		// sale_order_date: Yup.string().required("Price Quote date is required"),
		// sales_person_id: Yup.string().required("Sales person is required"),
		// sale_order_items[0].taxt:Yup.string().required("Sales person is required")
	});

	const handleButtonClick = type => {
		setBtnType(type);
		setClicked(true);
	};

	function returningType(type) {
		if (type === 'save_as_draft') {
			setSaveAsDraftLoading(true);
		} else if (type === 'save_and_send') {
			setSaveAndSendLoading(true);
		}
	}

	function runningFinally() {
		setSaveAsDraftLoading(false);
		setSaveAndSendLoading(false);
		setSubmitting(false);
	}

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: async (values, { setSubmitting }) => {
			console.log('first', values);
			if (edit && id) {
				try {
					returningType(btnType);

					const resp = await updateSaleOrderApi({
						...values,
						button_type: btnType,
						id,
						//      sale_order_items: formik.values?.estimate_items,
						_method: 'PUT',
					});
					notyf.success(resp?.message);
					navigate('/sales-orders');
				} catch (error) {
					if(error?.data?.errors && Object.keys(error?.data?.errors)?.length > 0)formik.setErrors(error?.data?.errors);
					else notyf.error(error.data);
					formik.setErrors(error?.data?.errors);
				} finally {
					runningFinally();
				}
			} else {
				if (
					values.sale_order_items.length === 1 &&
					values.sale_order_items[0]?.total === 0
				) {
					console.log('onSubmit values at 0 index amount is 0');
				} else {
					try {
						returningType(btnType);
						const resp = await createSaleOrderApi({
							...values,
							//       sale_order_items: formik.values?.estimate_items,
							button_type: btnType,
						});

						navigate('/sales-orders');
						notyf.success(resp?.message);
					} catch (error) {
						if(error?.data?.errors && Object.keys(error?.data?.errors)?.length > 0)formik.setErrors(error?.data?.errors);
					else notyf.error(error.data);
						formik.setErrors(error.data.errors);
					} finally {
						runningFinally();
					}
				}
			}
		},
	});

	//   customer list / single  / when customer is selected from dropdown
	const gettingCustomerList = async () => {
		try {
			//   setLoading(true);
			if (formik.values?.customer_id) {
				const resp = await customersSingleApi(formik.values?.customer_id);
				setSelectedEmails(resp?.customer_contacts);
				setCustomerList(resp);
				setTaxIdCustomer(resp?.tax_id);
				setTaxableCustomer(resp.tax_preference);
				updating();
			}
		} catch (error) {
		} finally {
			//   setLoading(false);
			// setUpdateCustomer(false)
		}
	};

	const updatingContacts = newContacts => {
		setSelectedEmails(prev => [...prev, ...newContacts]);
	};
	useEffect(() => {
		if (formik.values?.customer_id) {
			gettingCustomerList();
		}
	}, [formik.values?.customer_id]);

	// generate sale order number
	useGenerateNumber('sale_order', 'sale_order_number', formik, edit, id);

	// fetch data on load
	useEffect(() => {
		fetchSalesPersonList();
		fetchCustomerOptions();
	}, []);

	// fetch customer
	const fetchCustomerOptions = async () => {
		try {
			setCsutomerLoading(true);
			const resp = await getCustomersApi();
			setCustomerOptions(prev => resp?.data?.Customers);
		} catch (error) {
		} finally {
			setCsutomerLoading(false);
		}
	};

	//   sales
	const fetchSalesPersonList = async () => {
		try {
			setSalesLoading(true);
			const resp = await getSalesPersonApi();
			setSalesPersonList(resp?.data?.SalesPersons);
		} catch (error) {
		} finally {
			setSalesLoading(false);
		}
	};

	//   handle select change
	const handleSelectChange = (newOption, type) => {
		if (type === 'customer_id') {
			setSelectedCustomer(newOption); // Field Value / Label
		}
		if (type === 'sales_person_id') {
			setSelectedSalesPerson(newOption);
		}
		if (type === 'term_id') {
			console.log('newoption', newOption);
			setSelectedTerms(newOption);
			formik.setFieldValue();
		}
		if (newOption !== null && type === 'term_id') {
			formik.setFieldValue(type, newOption.id);
		} else if (newOption !== null && type !== 'term_id') {
			formik.setFieldValue(type, newOption.value);
		} else {
			formik.setFieldValue(type, '');
		}
	};

	// file work
	// const handleFileInputChange = (event) => {
	//   const files = event.target.files;
	//   if (files.length > 0) {
	//     const newFiles = Array.from(files);
	//     setEstimatedFiles((prevFiles) => [...prevFiles, ...newFiles]);
	//     const allFiles = [...formik.values?.sale_order_files, ...newFiles];
	//     formik.setFieldValue("sale_order_files", allFiles); // upladed files to b sent to backend
	//   }
	// };

	// delete/remove added files from list
	const deleteFileFromApi = async fileId => {
		try {
			const resp = await deleteSalesOrderFielApi(fileId);
			notyf.success(resp.message);
			formik.setFieldValue(
				'sale_order_files', formik.values?.sale_order_files.filter(f => f.id !== fileId));
		} catch (error) {}
	};
	const deletingFile = file => {
		console.log('file: ', file);
		if (file.id) {
			deleteFileFromApi(file?.id);
		} else {
			console.log('else running delete');
			// setEstimatedFiles(prevFiles => prevFiles.filter(f => f !== file));
			formik.setFieldValue(
				'sale_order_files',
				formik.values?.sale_order_files.filter(f => f !== file)
			); //delete uploaded file from formik key
		}
	};
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const customerId = decryptId(params.get('customerId'));
		if (customerId && customerOptions.length > 0) {
			const defaultVal = customerOptions?.find(item => item?.id == customerId);
			setSelectedCustomer({
				label: defaultVal?.display_name,
				value: defaultVal?.id,
			});
			formik.setFieldValue('customer_id', customerId);
		}
	}, [customerOptions]);
	// handle files on changes .set values to formik

	// payement terms
	const fetchTerms = async () => {
		try {
			setTermsLoading(true);
			let response = await getPeymentTermsApi();
			// setTerms(response?.data);
			let termsOptions = response?.data?.map(term => {
				return {
					label: term?.term_name,
					value: term?.due_date,
					id: term?.id,
				};
			});
			// termsOptions = [termsOptions];
			setTerms(termsOptions);
		} catch (error) {
		} finally {
			setTermsLoading(false);
		}
	};
	useEffect(() => {
		if (customerList?.term_id && formik.values?.customer_id) {
			const defValue = terms?.find(item => item?.id == customerList?.term_id);
			setSelectedTerms({
				label: defValue?.label,
				value: defValue?.id,
			});
			formik.setFieldValue('term_id', defValue.id);
		}
	}, [customerList?.term_id, formik.values?.customer_id]);

	const gettingPriceList = async () => {
		try {
			const resp = await getPriceListApi();
		} catch (error) {}
	};

	useEffect(() => {
		fetchTerms();
		gettingPriceList();
	}, []);

	useEffect(() => {
		const selectedEmailss = selectedEmails
			?.filter(item => item.is_selected === 1)
			.map(item => item.email);
		formik.setFieldValue(
			'email_to',
			(selectedEmailss.length > 0 && selectedEmailss) || 'null'
		);
	}, [formik.values?.customer_id, selectedEmails]);
	// tax
	useEffect(() => {
		const respTax = getTaxesApi();
		respTax
			.then(data => {
				const repsTax = data.data;
				const updatedOptions_ = repsTax.map(({ id, name, rate }) => ({
					value: id,
					label: name,
					price: rate,
				}));
				setTexValues(updatedOptions_);
			})
			.catch(error => {
				console.error(error.message);
			});
	}, []);

	// single sales order

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const customerId = decryptId(params.get('customerId'));
		if (customerId && customerOptions.length > 0) {
			const defaultVal = customerOptions?.find(item => item?.id == customerId);
			setSelectedCustomer({
				label: defaultVal?.display_name,
				value: defaultVal?.id,
			});
			formik.setFieldValue('customer_id', customerId);
		}
	}, [customerOptions]);
	const fetchingingSingleSaleOrder = async () => {
		try {
			const resp = await getSingeSaleOrderApi(id);
			// console.log('respppp@' , resp?.data)
			setSingleSaleOrder(resp?.data);
			formik.setValues(resp?.data);
			setInitialValues(resp?.data);
			// setEstimatedFiles(resp?.data?.sale_order_file);

			formik.setFieldValue('sale_order_files', resp?.data?.sale_order_file);
		} catch (error) {}
	};

	useEffect(() => {
		if (id) {
			fetchingingSingleSaleOrder();
		}
	}, [id]);

	const updating = () => {
		if (id) {
			const customer = customerOptions?.find(
				item => item.id === formik.values?.customer_id
			);
			setSelectedCustomer({
				label: customer?.display_name,
				value: customer?.id,
			});

			const salesPerson = salesPersonList?.find(
				item => item.id === formik.values?.sales_person_id
			);

			setSelectedSalesPerson({
				label: salesPerson?.name,
				value: salesPerson.id,
			});
		}
	};

	const MyDivider = () => (
		<Grid item xs={12} mt={3}>
			<Divider />
		</Grid>
	);

	//   styles

	const labelStyle = {
		display: 'flex',
		alignItems: 'start',
	};


	useEffect(() => {
		if (formik.dirty === true) {
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);
	return (
		<form onSubmit={formik.handleSubmit}>
			<div style={{ position: 'relative' }}>
				<Grid container>
					<Grid item sm={12}>
						<HeaderPaper
							sx={{
								paddingLeft: '2rem',
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<Typography variant='h6'>
								{edit ? 'Edit Sales Order' : 'New Sales Order'}
							</Typography>
							<IconButton
								onClick={() => goBack(() => navigate('/sales-orders'))}
							>
								<CloseIcon />
							</IconButton>
						</HeaderPaper>
					</Grid>

					<Paper sx={{ width: '100%', padding: '1.5rem 2rem 10rem 2rem' }}>
						<Grid item container>
							<Grid item xs={2} sx={{ ...labelStyle }}>
								<InputLabel>
									Customer Name<span style={{ color: 'red' }}>*</span>
								</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<CustomSelect
									id='customer_id'
									placeholder='Select or add a  Customer'
									value={selectedCustomer} // Set the default value here
									options={customerOptions?.map(item => ({
										label: item.display_name,
										value: item.id,
									}))}
									loading={customerLoading}
									onChange={selected =>
										handleSelectChange(selected, 'customer_id')
									}
									error={
										formik.touched?.customer_id &&
										formik.errors?.customer_id &&
										formik.errors?.customer_id
									}
									isSearchable
									isClearable
								/>
							</Grid>
						</Grid>

						<Grid item container my={1}>
							<Grid item xs={2}></Grid>
							{formik.values?.customer_id && (
								<>
									<Grid item xs={4}>
										<Box display='flex' alignItems='center'>
											<AccountCircleIcon sx={{ color: '#1976d2' }} />
											<Link
												ml={1}
												sx={{
													fontFamily: 'Roboto',
													cursor: 'pointer',
													fontSize: '14px',
													textDecoration: 'none',
												}}
												onClick={() => setCustomerViewOpen(!customerViewOpen)}
											>
												View Customer Details
											</Link>
										</Box>
										<CustomDrawer
											open={customerViewOpen}
											onClose={closeCustomerView}
											dWidth
										>
											<SaleOrderCustomerView
												onClose={closeCustomerView}
												customerList={customerList}
											/>
										</CustomDrawer>
									</Grid>
								</>
							)}
						</Grid>
						{/* address  */}
						<Grid item container>
							<Grid item xs={2}></Grid>
							{formik.values?.customer_id ? (
								<Grid
									item
									sm={4}
									pl={1}
									bgcolor='#F5F5F5'
									display='flex'
									justifyContent='space-between'
								>
									<Grid item xs={6}>
										<Address
											billing
											selectedCustomer={selectedCustomer}
											gettingCustomerList={gettingCustomerList}
											customer_id={formik.values?.customer_id}
											customer_billing_address={
												customerList?.customer_billing_address
											}
											customerList={customerList}
											//   loading={loading}
										/>
									</Grid>
									<Grid item xs={6}>
										<Address
											shipping
											selectedCustomer={selectedCustomer}
											gettingCustomerList={gettingCustomerList}
											customer_billing_address={
												customerList?.customer_shipping_address
											}
											customerList={customerList}
											customer_id={formik.values?.customer_id}
										/>
									</Grid>
								</Grid>
							) : null}

							{/* tax section  */}
							{formik.values?.customer_id && (
								<>
									<Grid item xs={6}></Grid>
									<Grid item xs={2}></Grid>
									{/* Tax  */}
									<Grid item xs={4}>
										<TaxSection
											onSave={gettingCustomerList}
											texValues={texValues}
											customerList={customerList}
										/>
									</Grid>
								</>
							)}
						</Grid>
						{/* sales order  */}
						<Grid item container mt={2}>
							<Grid item xs={2} sx={{ ...labelStyle }}>
								<InputLabel>
									Sales Order<span style={{ color: 'red' }}>*</span>
								</InputLabel>
							</Grid>
							<Grid item sm={4}>
								<FormField
									name='sale_order_number'
									size='small'
									fullWidth
									value={formik.values?.sale_order_number}
									handleChange={formik.handleChange}
									isTouched={formik.touched?.sale_order_number}
									disabled={edit}
									error={
										formik.touched?.sale_order_number &&
										formik.errors?.sale_order_number &&
										formik.errors?.sale_order_number
									}
								/>
							</Grid>
						</Grid>

						{/* ref  */}
						{/* <Grid item container mt={2}>
              <Grid item xs={2} sx={{ ...labelStyle }}>
                <InputLabel>
                  Reference number
                </InputLabel>
              </Grid>
              <Grid item sm={4}>
                <FormField
                  name="reference_number"
                  size="small"
                  fullWidth
                  value={formik.values?.reference_number}
                  handleChange={formik.handleChange}
                  isTouched={formik.touched?.reference_number}
                  error={
                    formik.touched?.reference_number &&
                    formik.errors?.reference_number &&
                    formik.errors?.reference_number
                  }
                />
              </Grid>
            </Grid> */}

						<Grid item container mt={2}>
							<Grid item xs={2} sx={{ ...labelStyle }}>
								<InputLabel>
									Sales Order Date<span style={{ color: 'red' }}>*</span>
								</InputLabel>
							</Grid>
							<Grid item sm={4}>
								{/* <TextField
                  name="sale_order_date"
                  id='sale_order_date'
                  size="small"
                  fullWidth
                  type="date"
                  value={formik.values?.sale_order_date}
                  handleChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    style: {
                      fontSize: "13px",
                      fontFamily: "Roboto",
                      color: "grey",
                    },
                  }}
              
                /> */}
								<TextField
									name='sale_order_date'
									value={formik.values?.sale_order_date}
									onChange={formik.handleChange}
									size='small'
									fullWidth
									type='date'
									InputProps={{
										style: {
											fontSize: '16px',
											fontFamily: 'Roboto',
											color: 'grey',
										},
									}}
								/>
							</Grid>
						</Grid>
						{/* <Grid item container mt={2}>
              <Grid item xs={2}>
                <InputLabel>Shipping Date</InputLabel>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="shipment_date"
                  value={formik.values?.shipment_date}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                  type="date"
                  InputProps={{
                    style: {
                      fontSize: "13px",
                      fontFamily: "Roboto",
                      color: "grey",
                    },
                  }}
                />
                {formik.touched?.shipment_date &&
                  formik.errors?.shipment_date && (
                    <Typography variant="caption" color="error">
                      {formik.errors?.shipment_date}
                    </Typography>
                  )}
              </Grid>
            </Grid> */}

						<Grid item container mt={2}>
							<Grid item xs={2}>
								<InputLabel sx={{ ...labelStyle }}>Mode of Payments</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<FormField
									id='mode_of_payment'
									value={formik.values?.mode_of_payment}
									handleChange={formik.handleChange}
									error={formik.errors?.mode_of_payment}
									label={'Select mode of payments'}
									type={'select'}
									options={paymentMode}
									fullWidth
								/>
								{formik.touched?.mode_of_payment &&
									formik.errors?.mode_of_payment && (
										<Typography variant='caption' color='error'>
											{formik.errors?.mode_of_payment}
										</Typography>
									)}
							</Grid>
						</Grid>

						<Grid item container mt={2}>
							<Grid item xs={2}>
								<InputLabel sx={{ ...labelStyle }}>Payment Terms</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<Select
									id='term_id'
									placeholder='Due end of the month'
									options={terms}
									value={selectedTerms}
									isLoading={termsLoading}
									onChange={selected => handleSelectChange(selected, 'term_id')}
									styles={{
										control: (baseStyles, state) => ({
											...baseStyles,
											fontSize: '16px',
											fontWeight: 400,
											fontFamily: 'Roboto',
											color: 'black',
											background: 'transparent',
											borderColor:
												formik.touched?.term_id && formik.errors?.term_id
													? 'red'
													: 'rgba(0, 0, 0, 0.2)',
										}),
										menu: baseStyles => ({
											...baseStyles,
											zIndex: 9999,
											fontFamily: 'Roboto',
											fontSize: '16px',
											color: 'black',
										}),
									}}
								/>
								{formik.touched?.term_id && formik.errors?.term_id && (
									<Typography variant='caption' color='error'>
										{formik.errors?.term_id}
									</Typography>
								)}
							</Grid>
						</Grid>
						<MyDivider />
						{/* <Grid item container mt={2}>
              <Grid item xs={2} sx={{ ...labelStyle }}>
                <InputLabel>
                  Delivery Method
                </InputLabel>
              </Grid>
              <Grid item xs={4}>
                <Select
                  name="delivery_method"
                  placeholder="Select Delivery Method"
                
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      fontSize: "13px",
                      fontWeight: 400,
                      fontFamily: "Roboto",
                      color: "black",
                      background: "transparent",
                      borderColor:
                        formik.touched?.customer_id && formik.errors?.customer_id
                          ? "red"
                          : "rgba(0, 0, 0, 0.2)",
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      zIndex: 9999,
                      fontFamily: "Roboto",
                      fontSize: "13px",
                      color: "black",
                    }),
                  }}
                />
              </Grid>
            </Grid> */}

						<Grid item container sx={{ margin: '2rem 0' }}>
							<Grid item xs={2} display='flex' alignItems='center'>
								{' '}
								<InputLabel>Sales Person</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<CustomSelect
									value={selectedSalesPerson}
									name='sales_person_id'
									id='sales_person_id'
									placeholder='Select or add sales persons'
									loading={salesLoading}
									options={salesPersonList?.map(item => ({
										label: item.name,
										value: item.id,
									}))}
									onChange={selected =>
										handleSelectChange(selected, 'sales_person_id')
									}
									error={
										formik.touched?.sales_person_id &&
										formik.errors?.sales_person_id &&
										formik.errors?.sales_person_id
									}
									isSearchable
									isClearable
								/>
							</Grid>
							<MyDivider />
						</Grid>

						<Grid item container spacing={2} my={7}>
							<Grid item sm={12}>
								{/* formik.values?.sale_order_items.length > 0 */}
								<AddItem
									initialValues={initialValues}
									formik={formik}
									isEdit={edit}
									clicked={clicked}
									setClicked={setClicked}
									taxIdCustomer={taxIdCustomer}
									taxableCustomer={taxableCustomer}
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
										value={formik.values?.customer_note}
										onChange={formik.handleChange}
										// variant="outlined"
									/>
								</Grid>
								<Grid item xs={12}>
									<InputLabel>Terms and conditions</InputLabel>
									<TextField
										fullWidth
										label='Terms and conditions'
										multiline
										rows={3}
										id='terms_and_condition'
										onChange={formik.handleChange}
										value={formik.values?.terms_and_condition}
										// variant="outlined"
									/>
								</Grid>
							</Grid>
							<Grid item xs={6} display='flex' justifyContent='center'>
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
									<FilesModule
										files={formik.values?.sale_order_files}
										onDelete={deletingFile}
										setFiles={files =>
											formik.setFieldValue('sale_order_files', files)
										}
									/>
								</Box>
							</Grid>
						</Grid>

						{formik.values?.customer_id && (
							<CustomerConatctsList
								setSelectedEmails={setSelectedEmails}
								gettingCustomerList={gettingCustomerList}
								selectedEmails={selectedEmails}
								customerList={customerList}
								onSave={updatingContacts}
							/>
						)}
					</Paper>

					{/* footer  */}
					<Box
						style={{
							position: 'sticky',
							bottom: 0,
							left: 0,
							right: 0,
							width: '100%',
							zIndex: '1000',
						}}
					>
						<Paper elevation={10} sx={{ padding: '1rem 2.3rem' }}>
							<LoadingButton
								type='submit'
								variant='contained'
								onClick={() => handleButtonClick('save_as_draft')}
								disabled={saveAsDraftLoading}
								loading={saveAsDraftLoading}
							>
								Save as Draft
							</LoadingButton>
							<LoadingButton
								sx={{ marginX: '.5rem' }}
								variant='contained'
								type='submit'
								onClick={() => handleButtonClick('save_and_send')}
								disabled={saveAndSendLoading}
								loading={saveAndSendLoading}
							>
								Save and send
							</LoadingButton>

							<MUIButton
								sx={{ marginX: '.5rem' }}
								variant='outlined'
								router
								to='/sales-orders'
							>
								Cancel
							</MUIButton>
						</Paper>
					</Box>
				</Grid>
			</div>
		</form>
	);
};

export default SalesOrderForm;
