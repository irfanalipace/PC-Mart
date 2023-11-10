import React, { useEffect, useRef } from 'react';
import Select from 'react-select';
import { useParams, useNavigate } from 'react-router-dom';
import './NewBills.css';
// yup  / formik
import * as Yup from 'yup';
import { useFormik, validateYupSchema } from 'formik';
import { BillFormLayout } from './BillFormLayout';
// mui
// import PageWrapper from '../../../Components/PageWrapper/PageWrapper'
import {
	Box,
	Button,
	Container,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	Paper,
	Stack,
	TextField,
	Typography,
	styled,
	TextareaAutosize,
	Tooltip,
	Checkbox,
	// List,
	// ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	CircularProgress,
	Menu,
	Alert,
	MenuItem,
} from '@mui/material';

// components
import Modal from '../../../Components/Modal/Dialog';

// import EstimateTitle from "./NewEstimateTitle";
import FormField from '../../../Components/InputField/FormField';
import useResponsiveStyles from '../../../../core/hooks/useMedaiQuery';
import { useState } from 'react';
import MUIButton from '../../../Components/Button/MUIButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';

// apis
import { customersSingleApi, getTaxesApi } from '../../../../core/api/customer';
import { getPeymentTermsApi } from '../../../../core/api/termsTaxesReasonsAuthorities';

import {
	getCustomersApi,
	getSalesPersonApi,
} from '../../../../core/api/estimate/';
import Address from '../../../Components/Address/Address/Address';
import PageLayout from '../../../Components/PageLayout/PageLayout';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import CustomerContactsForm from '../../../Components/CustomerContacts/CustomerContactsForm';
import CustomerConatctsList from '../../../Components/CustomerContacts/CustomerConatctsList';
import {
	addEstimatesFileApi,
	createEstimateApi,
	deleteEstimateFielsApi,
	generateNumberApi,
	getExemtionsReasonsApi,
	getTaxAuthoritiesApi,
	showEstimateApi,
	updateCustomerTaxApi,
	updateEstimateApi,
} from '../../../../core/api/estimate';
import { Autocomplete } from '@mui/lab';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
// helper
import {
	addDaysToDate,
	formatDateToYYYYMMDD,
} from '../../../../core/utils/helpers';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import AddItemBill from './AddItemBill';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import TaxSection from '../../../Components/TaxSection/TaxSection';
import CustomSelect from '../../../Components/Select/Select';
import TextArea from '../../../Components/TextArea/TextArea';
import Search from '@mui/icons-material/Search';
export const MainTitleStyled = styled(Paper)(({ theme }) => ({
	width: '100%',
	padding: '20px 40px',
	display: 'flex',
	justifyContent: 'flex-end',
	border: '8px',
}));

export const NewEstimateFormTitle = styled(Typography)(({ theme }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	// margin: "1rem 0 .4rem 0",
}));

export const FieldTitle = styled(Typography)(({ theme, fontWeight }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0 .4rem 0',
	fontFamily: 'Roboto',
	fontWeight: fontWeight || 400,
}));

export const AddRowTitle = styled(Typography)(({ theme }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0',
}));

export const FormMainTitle = styled(Typography)(({ theme, margin }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	fontWeight: 600,
	margin: margin && '.4rem 0',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(2),
	marginTop: theme.spacing(2),
	// backgroundColor: theme.palette.primary.main,
	// boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Add your desired shadow here
}));

const itemRatesOption = [
	{
		id: 1,
		label: 'Tax inclusive',
		value: 'tax_inclusive',
	},
	{
		id: 2,
		label: 'Tax exulsive',
		value: 'tax_exulsive',
	},
];

const BillsForm = ({ edit }) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [customerOptions, setCustomerOptions] = useState([]);
	const [salesPersonList, setSalesPersonList] = useState([]);
	const [selectedEmails, setSelectedEmails] = useState([]);
	const [customerList, setCustomerList] = useState('');
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
	const [estimateFiles, setEstimatedFiles] = useState([]);
	const [fieldError, setFieldError] = useState('');
	const [btnType, setBtnType] = useState('');
	const [customerLoading, setCsutomerLoading] = useState(false);
	const [salesLoading, setSalesLoading] = useState(false);
	const [termLoading, setTermsLoading] = useState(false);
	const [selectedPaymentTerms, setSelectedPayTerms] = useState('');
	///const [isEdit, seIsEdit] = useState(false);
	const [taxableCustomer, setTaxableCustomer] = useState('taxable');
	const [taxIdCustomer, setTaxIdCustomer] = useState(1);
	const [texValues, setTexValues] = useState([]);
	const [saveAsDraftLoading, setSaveAsDraftLoading] = useState(false);
	const [saveAndSendLoading, setSaveAndSendLoading] = useState(false);

	// tax menu

	const [loading, setLoading] = useState(false);
	// date terms
	const [selectedTerm, setSelectedTerm] = useState();
	const [paymentTerms, setPaymentTerms] = useState([]);
	const [terms, setTerms] = useState([]);
	const [clicked, setClicked] = useState(false);

	// console.log("salesPersonList", salesPersonList);

	const [estimateDate, setEstimateDate] = useState(
		formatDateToYYYYMMDD(new Date())
	);

	//  formik/ new estimate
	const initialValues_ = {
		customer_id: '',
		taxCheckBox: 'taxExempt',
		sales_person_id: '',
		estimate_number: '',
		reference_number: '',
		estimate_date: formatDateToYYYYMMDD(new Date()), // current Date
		expiry_date: estimateDate || '',
		term_id: '',
		subject: '',
		adjustment_description: '',
		customer_note: '',
		terms_and_condition: '',
		estimate_files: [],
		email_to: [],
		// selectedCustomer: null,
		sub_total: 0,
		discount: 0,
		tax_amount: 0,
		discount_type: 'Percentage',
		shipping_charges: 0,
		adjustment: 0,
		items_rates_are:
			taxableCustomer === 'taxable' ? 'tax_exclusive' : 'tax_inclusive',
		total: 0,
		estimate_items: [
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
		estimate_number: Yup.string().required('Price Quote number is required'),
		estimate_date: Yup.string().required('Price Quote date is required'),
		sales_person_id: Yup.string().required('Sales person is required'),
	});
	const [isSubmit, setIsSubmit] = useState(false);
	const handleButtonClick = type => {
		setIsSubmit(true);
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
		// initialTouched: {}, // Initialize touched as an empty object
		onSubmit: async (values, { setSubmitting }) => {
			console.log('onSubmit', values);
			console.log(
				'onSubmit values.estimate_items>>>>>>>',
				//  values.estimate_items.length ,
				values.estimate_items[0]?.total
			);
			if (edit && id) {
				try {
					returningType(btnType);
					const resp = await updateEstimateApi({
						...values,
						button_type: btnType,
						id,
						_method: 'PUT',
					});
					notyf.success(resp?.message);

					navigate('/bills');
				} catch (error) {
					setFieldError(error?.data?.errors);
				} finally {
					runningFinally();
				}
			} else {
				// if (values.estimate_items.length === 1) {
				//   if (values.estimate_items[0]?.total === 0) {
				//     console.log("onSubmit values.estimate_items[0]?.total === 0 true ");
				//   } else {
				//     try {
				//       returningType(btnType);
				//       const resp = await createEstimateApi({
				//         ...values,
				//         button_type: btnType,
				//       });
				//       notyf.success(resp.message);
				//       navigate("/price-quote");
				//     } catch (error) {
				//       setFieldError(error?.data?.errors);
				//     } finally {
				//       runningFinally();
				//     }
				//   }
				// } else {
				//   try {
				//     returningType(btnType);
				//     const resp = await createEstimateApi({
				//       ...values,
				//       button_type: btnType,
				//     });
				//     notyf.success(resp.message);
				//     navigate("/price-quote");
				//   } catch (error) {
				//     setFieldError(error?.data?.errors);
				//   } finally {
				//     runningFinally();
				//   }
				// }
				if (
					values.estimate_items.length === 1 &&
					values.estimate_items[0]?.total === 0
				) {
					console.log('onSubmit values at 0 index amount is 0');
				} else {
					try {
						returningType(btnType);
						const resp = await createEstimateApi({
							...values,
							button_type: btnType,
						});
						notyf.success(resp.message);
						navigate('/bills');
					} catch (error) {
						setFieldError(error?.data?.errors);
					} finally {
						runningFinally();
					}
				}
			}
		},
	});

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

	const fetchTerms = async () => {
		try {
			setTermsLoading(true);
			let response = await getPeymentTermsApi();
			setTerms(response?.data);
			let termsOptions = response?.data?.map(term => {
				return {
					label: term?.term_name,
					value: term?.due_date,
					id: term?.id,
				};
			});
			// termsOptions = [termsOptions];
			setPaymentTerms(termsOptions);
		} catch (error) {
		} finally {
			setTermsLoading(false);
		}
	};

	useEffect(() => {
		fetchTerms();
	}, []);

	useEffect(() => {
		formik.setFieldValue('expiry_date', estimateDate);
	}, [estimateDate, formik.values.customer_id]);

	const handleChange = selected => {
		setSelectedPayTerms(selected);
		formik.setFieldValue('term_id', selected.id);
		setEstimateDate(formatDateToYYYYMMDD(new Date(selected?.value)));
	};

	//  generate Number

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

	// Sales Person List
	const fetchSalesPersonList = async () => {
		try {
			setSalesLoading(true);
			const resp = await getSalesPersonApi();
			setSalesPersonList(resp?.data?.SalesPersons);
			// console.log("customerOptions", resp);
		} catch (error) {
		} finally {
			setSalesLoading(false);
		}
	};

	const generateNumber = async () => {
		try {
			const resp = await generateNumberApi({ type: 'purchase_order' });
			formik.setFieldValue('estimate_number', resp?.data[0]);
		} catch (error) {
			// alert(error)
		}
	};

	useEffect(() => {
		fetchCustomerOptions();
		fetchSalesPersonList();
		generateNumber();
	}, []);

	//  get customerId from url when user coming from view customer(new estimate btn) , and  update customer name on the basis of customerId
	const params = new URLSearchParams(window.location.search);
	const customerId = params.get('customerId');
	useEffect(() => {
		formik.setFieldValue('customer_id', customerId); // customerId to be assign to  customer_id, so where customer_id need to be used it will b either customerId or customer_id itself
	}, [customerId]);
	useEffect(() => {
		if (customerId && customerOptions.length > 0) {
			const defaultVal = customerOptions?.find(item => item?.id == customerId);
			setSelectedCustomer({
				label: defaultVal?.display_name,
				value: defaultVal.id,
			});
		}
	}, [customerId, customerOptions]);

	// update customer  selectedEmails when customer_id changes
	const gettingCustomerList = async () => {
		// alert()
		try {
			setLoading(true);
			if (formik.values.customer_id) {
				const resp = await customersSingleApi(formik.values.customer_id);
				// setSelectedPayTerms(resp?.term)
				setTaxIdCustomer(resp.tax_id);
				setTaxableCustomer(resp.tax_preference);
				setSelectedEmails(resp?.customer_contacts);
				setCustomerList(resp);
			}
		} catch (error) {
		} finally {
			setLoading(false);
			// setUpdateCustomer(false)
		}
	};

	useEffect(() => {
		if (formik.values.customer_id) {
			gettingCustomerList();
		}
	}, [formik.values.customer_id]);

	useEffect(() => {
		if (customerList?.term_id && formik.values.customer_id) {
			const defValue = terms?.find(item => item?.id == customerList?.term_id);
			setSelectedPayTerms({
				label: defValue?.term_name,
				value: defValue?.due_date,
			});
			setEstimateDate(defValue?.due_date);
			formik.setFieldValue('term_id', parseInt(defValue?.id));
		}
	}, [customerList?.term_id, formik.values.customer_id]);

	// handle  customer email list  lists , checked and unchecked sending to backend
	useEffect(() => {
		const selectedEmailss = selectedEmails
			?.filter(item => item.is_selected === 1)
			.map(item => item.email);
		formik.setFieldValue(
			'email_to',
			(selectedEmailss.length > 0 && selectedEmailss) || 'null'
		);
	}, [formik.values.customer_id, selectedEmails]);

	// file work
	const handleFileInputChange = event => {
		const files = event.target.files;
		if (files.length > 0) {
			const newFiles = Array.from(files);
			setEstimatedFiles(prevFiles => [...prevFiles, ...newFiles]);
			const allFiles = [...formik.values.estimate_files, ...newFiles]; // formik files plus new uploading files

			// only these files to be sent to backend / not fiels which are alreaddy in database r files from backend
			formik.setFieldValue('estimate_files', allFiles);
		}
	};

	// delete/remove added files from list / api and added file
	const deleteFileFromApi = async fileId => {
		try {
			const resp = await deleteEstimateFielsApi(fileId);
			notyf.success('File Deleted');
			setEstimatedFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
		} catch (error) {}
	};
	const deletingFile = fileId => {
		if (fileId.id) {
			deleteFileFromApi(fileId?.id);
		} else {
			setEstimatedFiles(prevFiles => prevFiles.filter(f => f !== fileId));
			formik.setFieldValue(
				'estimate_files',
				formik.values.estimate_files.filter(f => f !== fileId)
			); //delete uploaded file from formik key on delete click
			notyf.success('File Deleted');
		}
	};

	const [singleEstimate, setSingleEstimate] = useState('');

	// console.log("singleEstimate", singleEstimate);
	useEffect(() => {
		if (id) {
			fetchingSingleEstimate();
		}
	}, [id]);

	const fetchingSingleEstimate = async () => {
		try {
			const resp = await showEstimateApi(id);
			formik.setValues(resp.data);
			setSingleEstimate(resp.data);
			setInitialValues(resp.data);
			setEstimatedFiles(resp?.data?.estimate_files);
			// formik.setFieldValue(
			//   'estimate_date',
			//   formatDateToYYYYMMDD(new Date(resp?.data?.estimate_date))
			// );

			formik.setFieldValue('estimate_files', []);
		} catch (error) {
			//  seIsEdit(false);
		}
	};

	// setting estimate default options for customer

	useEffect(() => {
		if (id && customerOptions.length > 0 && singleEstimate) {
			const defaultVal = customerOptions.find(
				item => item.id === formik.values.customer_id
			);

			// Set the selectedCustomer state with the default value
			setSelectedCustomer({
				label: defaultVal?.display_name,
				value: defaultVal?.id,
			});
		}
	}, [id, customerOptions, singleEstimate]);

	useEffect(() => {
		if (id && salesPersonList.length > 0 && singleEstimate) {
			const defaultVal = salesPersonList.find(
				item => item.id === formik.values.sales_person_id
			);

			setSelectedSalesPerson({ label: defaultVal?.name, value: defaultVal.id });
		}
	}, [id, customerOptions, singleEstimate]);

	const handleSelectChange = (newOption, type) => {
		if (type === 'customer_id') {
			setSelectedCustomer(newOption); // Field Value / Label
		}
		if (type === 'sales_person_id') {
			setSelectedSalesPerson(newOption);
		}
		if (newOption !== null && newOption !== undefined) {
			formik.setFieldValue(type, newOption.value);
		} else if (newOption === null || newOption === undefined) {
			// clear the selected value from select , so make the formik key empty
			formik.setFieldValue(type, '');
		}
	};
	useEffect(() => {
		if (fieldError) {
			for (const field in fieldError) {
				if (fieldError.hasOwnProperty(field)) {
					formik.setFieldError(field, fieldError[field][0]);
				}
			}
		}
	}, [fieldError]);

	const labelStyle = {
		display: 'flex',
		alignItems: 'center',
	};

	const MyDivider = () => (
		<Grid item xs={12} mt={3}>
			<Divider />
		</Grid>
	);

	// tax update

	return (
		<form onSubmit={formik.handleSubmit}>
			<div style={{ position: 'relative' }}>
				<Grid container>
					{/* top title / page header  */}
					<Grid item sm={12}>
						<HeaderPaper
							sx={{
								paddingLeft: '2rem',
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<Typography variant='h6'>
								{edit ? 'Edit Bills' : 'New Bill'}
							</Typography>
							<IconButton onClick={() => navigate('/bills')}>
								<CloseIcon />
							</IconButton>
						</HeaderPaper>
					</Grid>
					{/* main layout   */}
					<BillFormLayout>
						{/* <Grid item container>
              <Grid item xs={12}>
                <Box mb={2}>
                  {isSubmit &&
                    Object.keys(formik.errors).length > 0 &&
                    Object.keys(formik.errors).map((fieldName) => (
                      <Alert severity="error" key={fieldName}>
                        {formik.errors[fieldName]}
                      </Alert>
                    ))}
                </Box>
              </Grid>
            </Grid> */}
						<Grid item container>
							{/* {Object.keys(formik.errors).length > 0  ?  (
            <Grid item xs={12}>
              <Typography >Something went wrong , check your all fields</Typography>

            </Grid>
           ) : null } */}
							<Grid container spacing={2}>
								<Grid item xs={2}>
									<InputLabel>
										Vendor Name <span style={{ color: 'red' }}>*</span>
									</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<Select
										id='customer-select'
										options={customerOptions || []}
										loading={customerLoading}
										getOptionLabel={option => option.display_name}
										value=''
										renderInput={params => (
											<FormField {...params} variant='outlined' />
										)}
									/>
								</Grid>
								<Grid item xs={1}>
									<Button
										variant='contained'
										color='primary'
										onClick={() => {
											// Add your search functionality here
											console.log('Search button clicked');
										}}
									>
										<Search />
									</Button>
								</Grid>
							</Grid>
						</Grid>
						{/* address container  */}
						<Grid item container>
							<Grid item xs={2}></Grid>
							{selectedCustomer ? (
								<Grid
									item
									sm={4}
									bgcolor='#f9f9fb'
									display='flex'
									justifgit
									yContent='space-between'
								>
									<Grid item xs={6}>
										<Address
											billing
											selectedCustomer={selectedCustomer}
											gettingCustomerList={gettingCustomerList}
											customer_id={formik.values.customer_id}
											customer_billing_address={
												customerList?.customer_billing_address
											}
											customerList={customerList}
											loading={loading}
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
											customer_id={formik.values.customer_id}
										/>
									</Grid>
								</Grid>
							) : null}
							{/* tax  */}
							{selectedCustomer && (
								<>
									<Grid item xs={6}></Grid>
									<Grid item xs={2}></Grid>
									{/* Tax  */}
									<Grid item xs={4}>
										<TaxSection
											gettingCustomerList={gettingCustomerList}
											texValues={texValues}
											customerList={customerList}
										/>
									</Grid>
								</>
							)}
						</Grid>

						<>
							<Grid item container mt={2}>
								<Grid item xs={2} sx={{ ...labelStyle }}>
									<InputLabel>
										Bill#<span style={{ color: 'red' }}>*</span>
									</InputLabel>
								</Grid>
								<Grid item sm={4}>
									<FormField
										name='estimate_number'
										size='small'
										fullWidth
										value=''
										handleChange={formik.handleChange}
										isTouched={formik.touched.estimate_number}
										error={
											formik.touched.estimate_number &&
											formik.errors.estimate_number &&
											formik.errors.estimate_number
										}
									/>
								</Grid>
							</Grid>
							<Grid item container mt={2}>
								<Grid item xs={2} sx={{ ...labelStyle }}>
									<InputLabel>
										Order Number<span style={{ color: 'red' }}>*</span>
									</InputLabel>
								</Grid>
								<Grid item sm={4}>
									<FormField
										name='estimate_number'
										size='small'
										fullWidth
										value=''
										handleChange={formik.handleChange}
										isTouched={formik.touched.estimate_number}
										error={
											formik.touched.estimate_number &&
											formik.errors.estimate_number &&
											formik.errors.estimate_number
										}
									/>
								</Grid>
							</Grid>

							<Grid item container mt={2}>
								<Grid item xs={2} display='flex' alignItems='center'>
									<InputLabel>
										Bill Date<span style={{ color: 'red' }}>*</span>
									</InputLabel>{' '}
								</Grid>
								<Grid item xs={4}>
									<TextField
										name='estimate_date'
										value={formik.values.estimate_date}
										onChange={formik.handleChange}
										size='small'
										fullWidth
										type='date'
										InputProps={{
											style: {
												fontSize: '16px',
												fontFamily: 'Roboto',
												color: 'black',
											},
										}}
									/>
								</Grid>
							</Grid>

							<Grid item container mt={2}>
								<Grid item xs={2}>
									<InputLabel>
										Due Date<span style={{ color: 'red' }}>*</span>
									</InputLabel>{' '}
								</Grid>
								<Grid item xs={4}>
									<TextField
										// name="expiry_date"
										value={estimateDate}
										onChange={e => setEstimateDate(e.target?.value)}
										size='small'
										fullWidth
										type='date'
										InputProps={{
											style: {
												fontSize: '16px',
												fontFamily: 'Roboto',
												color: 'black',
											},
										}}
									/>
									{formik.touched.expiry_date && formik.errors.expiry_date && (
										<Typography variant='caption' color='error'>
											{formik.errors.expiry_date}
										</Typography>
									)}
								</Grid>
								<Grid item xs={1}></Grid>
								<Grid item xs={1}>
									<InputLabel>
										Payment Term <span style={{ color: 'red' }}>*</span>
									</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<Select
										id='customer-select'
										options={customerOptions || []}
										loading={customerLoading}
										getOptionLabel={option => option.display_name}
										value=''
										renderInput={params => (
											<FormField {...params} variant='outlined' />
										)}
									/>
								</Grid>
							</Grid>

							<MyDivider />
						</>
						{/* add row comp  */}
						<>
							<Grid
								item
								container
								sx={{ marginTop: '2rem' }}
								display='flex'
								justifyContent='flex-end'
							>
								<Grid item container spacing={1} mt={1}>
									<Grid item sm={12}>
										{/* formik.values.estimate_items.length > 0 */}
										<AddItemBill
											initialValues={initialValues}
											formik={formik}
											isEdit={edit}
											clicked={clicked}
											setClicked={setClicked}
											taxIdCustomer={taxIdCustomer}
											taxableCustomer={taxableCustomer}
										/>
									</Grid>
									<Grid item xs={6}>
										<Grid item xs={12}>
											<FieldTitle>Customer Notes</FieldTitle>
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
										<Grid item xs={12}>
											<FieldTitle>Terms and conditions</FieldTitle>
											<TextField
												fullWidth
												label='Terms and conditions'
												multiline
												rows={3}
												id='terms_and_condition'
												onChange={formik.handleChange}
												value={formik.values.terms_and_condition}
												// variant="outlined"
											/>
										</Grid>
									</Grid>
									<Grid
										item
										xs={6}
										display='flex'
										justifyContent='center'
										mt={1}
									>
										<Box
											sx={{
												width: '60%',
											}}
										>
											<FieldTitle textAlign='center'>
												Attach file(s) to Price Quote
											</FieldTitle>

											<label htmlFor='file-input'>
												<MUIButton
													startIcon={<SendIcon />}
													sx={{
														border: '1px solid grey',
														color: 'black',
														textTransform: 'capitalize',
													}}
													variant='outlined'
													component='span'
													fullWidth
												>
													Upload File
												</MUIButton>

												<input
													id='file-input'
													type='file'
													multiple
													style={{ display: 'none' }}
													onChange={handleFileInputChange}
												/>
											</label>
											<List>
												{formik.values.estimate_files?.map((file, index) => (
													<ListItem key={index}>
														<Typography>
															{(id && file.file_name) || file.name}
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
						{customerList?.id && (
							<CustomerConatctsList
								setSelectedEmails={setSelectedEmails}
								gettingCustomerList={gettingCustomerList}
								selectedEmails={selectedEmails}
								customerList={customerList}
							/>
						)}
					</BillFormLayout>
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
								type='submit'
								variant='contained'
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
export default BillsForm;
