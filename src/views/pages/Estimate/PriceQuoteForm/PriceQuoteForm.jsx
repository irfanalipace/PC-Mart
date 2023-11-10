import React, { useEffect } from 'react';
import Select from 'react-select';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
	Box,
	Grid,
	Paper,
	TextField,
	Typography,
	Divider,
} from '@mui/material';

import FormField from '../../../Components/InputField/FormField';
import { useState } from 'react';
import MUIButton from '../../../Components/Button/MUIButton';

import { LoadingButton } from '@mui/lab';

// apis
import { customersSingleApi, getTaxesApi } from '../../../../core/api/customer';
import { getPeymentTermsApi } from '../../../../core/api/termsTaxesReasonsAuthorities';

import {
	getCustomersApi,
	getSalesPersonApi,
} from '../../../../core/api/estimate/';
import Address from '../../../Components/Address/Address/Address';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import CustomerConatctsList from '../../../Components/CustomerContacts/CustomerConatctsList';
import {
	createEstimateApi,
	deleteEstimateFielsApi,
	showEstimateApi,
	updateEstimateApi,
} from '../../../../core/api/estimate';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
import {
	addDaysToDate,
	decryptId,
	formatDateToYYYYMMDD,
} from '../../../../core/utils/helpers';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import TaxSection from '../../../Components/TaxSection/TaxSection';
import CustomSelect from '../../../Components/Select/Select';
import TextArea from '../../../Components/TextArea/TextArea';
import { useGenerateNumber } from '../../../Components/GenerateNumber/GenerateNumber';
import CustomFileupload from '../../../Components/CustomeFileUpload/CustomeFileupload';
import AddItem from '../NewEstimate/AddItem/AddItem';
import FilesModule from '../../../Components/FileUpload/FilesModule';

const PriceQuoteForm = ({ edit }) => {
	const params = useParams();
	const id = decryptId(params.id);
	const navigate = useNavigate();
	const [customerOptions, setCustomerOptions] = useState([]);
	const [salesPersonList, setSalesPersonList] = useState([]);
	const [selectedEmails, setSelectedEmails] = useState([]);
	const [customerList, setCustomerList] = useState('');
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
	const [btnType, setBtnType] = useState('');
	const [customerLoading, setCustomerLoading] = useState(false);
	const [salesLoading, setSalesLoading] = useState(false);
	const [termLoading, setTermsLoading] = useState(false);
	const [selectedPaymentTerms, setSelectedPayTerms] = useState('');
	const [taxableCustomer, setTaxableCustomer] = useState('taxable');
	const [taxIdCustomer, setTaxIdCustomer] = useState(1);
	const [texValues, setTexValues] = useState([]);
	const [saveAsDraftLoading, setSaveAsDraftLoading] = useState(false);
	const [saveAndSendLoading, setSaveAndSendLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isStatus, setIsStatus] = useState('draft');

	// date terms
	const [selectedTerm, setSelectedTerm] = useState();
	const [paymentTerms, setPaymentTerms] = useState([]);
	const [terms, setTerms] = useState([]);
	const [clicked, setClicked] = useState(false);
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
		// setSubmitting(false);
	}

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		// initialTouched: {}, // Initialize touched as an empty object
		onSubmit: async values => {
			if (edit && id) {
				console.log(' P Number edit', values);

				try {
					returningType(btnType);
					const resp = await updateEstimateApi({
						...values,
						button_type: btnType,
						id,
						_method: 'PUT',
					});
					notyf.success(resp?.message);

					navigate('/price-quote');
				} catch (error) {
					if (
						error?.data?.errors &&
						Object.keys(error?.data?.errors)?.length > 0
					)
						formik.setErrors(error?.data?.errors);
					else notyf.error(error.data);
					formik.setErrors(error?.data?.errors);
				} finally {
					runningFinally();
				}
			} else {
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
						navigate('/price-quote');
					} catch (error) {
						if (
							error?.data?.errors &&
							Object.keys(error?.data?.errors)?.length > 0
						)
							formik.setErrors(error?.data?.errors);
						else notyf.error(error.data);
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
	}, [estimateDate, formik.values?.customer_id]);

	const handleChange = selected => {
		setSelectedPayTerms(selected);
		formik.setFieldValue('term_id', selected.id);
		setEstimateDate(formatDateToYYYYMMDD(new Date(selected?.value)));
	};

	// fetch customer
	const fetchCustomerOptions = async () => {
		try {
			setCustomerLoading(true);
			const resp = await getCustomersApi();
			setCustomerOptions(prev => resp?.data?.Customers);
		} catch (error) {
		} finally {
			setCustomerLoading(false);
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

	useEffect(() => {
		fetchSalesPersonList();
		fetchCustomerOptions();
	}, []);
	const gettingCustomerList = async () => {
		try {
			setLoading(true);
			if (formik.values?.customer_id) {
				const resp = await customersSingleApi(formik.values?.customer_id);
				setTaxIdCustomer(resp.tax_id);
				setTaxableCustomer(resp.tax_preference);
				setSelectedEmails(resp?.customer_contacts);
				setCustomerList(resp);
				Updating(); // formik values set , now set def options in select
			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (formik.values?.customer_id) {
			gettingCustomerList();
		}
	}, [formik.values?.customer_id]);

	useEffect(() => {
		if (customerList?.term_id && formik.values?.customer_id) {
			const defValue = terms?.find(item => item?.id == customerList?.term_id);
			setSelectedPayTerms({
				label: defValue?.term_name,
				value: defValue?.due_date,
			});
			setEstimateDate(defValue?.due_date);
			formik.setFieldValue('term_id', parseInt(defValue?.id));
		}
	}, [customerList?.term_id, formik.values?.customer_id]);

	useEffect(() => {
		const selectedEmailss = selectedEmails
			?.filter(item => item.is_selected === 1)
			.map(item => item.email);
		formik.setFieldValue(
			'email_to',
			(selectedEmailss.length > 0 && selectedEmailss) || 'null'
		);
	}, [formik.values?.customer_id, selectedEmails]);

	// const handleFileInputChange = event => {
	//   const files = event.target.files;
	//   if (files.length > 0) {
	//     const newFiles = Array.from(files);
	//     setEstimatedFiles(prevFiles => [...prevFiles, ...newFiles]);
	//     const allFiles = [...formik.values?.estimate_files, ...newFiles]; // formik files plus new uploading files

	//     // only these files to be sent to backend / not fiels which are alreaddy in database r files from backend
	//     formik.setFieldValue('estimate_files', allFiles);
	//   }
	// };

	// delete/remove added files from list / api and added file
	const deleteFileFromApi = async fileId => {
		try {
			const resp = await deleteEstimateFielsApi(fileId);
			notyf.success('File Deleted');
			formik.setFieldValue(
				'estimate_files',
				formik.values?.estimate_files.filter(f => f.id !== fileId)
			);
		} catch (error) {}
	};
	const deletingFile = fileId => {
		if (fileId.id) {
			deleteFileFromApi(fileId?.id);
		} else {
			// setEstimatedFiles(prevFiles => prevFiles.filter(f => f !== fileId));
			formik.setFieldValue(
				'estimate_files',
				formik.values?.estimate_files.filter(f => f !== fileId)
			);
			notyf.success('File Deleted');
		}
	};

	// const [singleEstimate, setSingleEstimate] = useState("");

	useEffect(() => {
		if (id) {
			fetchingSingleEstimate();
		}
	}, [id]);

	const fetchingSingleEstimate = async () => {
		try {
			const resp = await showEstimateApi(id);
			setIsStatus(resp?.data?.status);
			formik.setValues(resp.data);
			// setSingleEstimate(resp.data);
			setInitialValues(resp.data);
			// setEstimatedFiles(resp?.data?.estimate_files);
			formik.setFieldValue('estimate_files', resp?.data?.estimate_files);
		} catch (error) {}
	};

	const handleSelectChange = (newOption, type) => {
		if (type === 'customer_id') {
			setSelectedCustomer(newOption);
		}
		if (type === 'sales_person_id') {
			setSelectedSalesPerson(newOption);
		}
		if (newOption !== null && newOption !== undefined) {
			formik.setFieldValue(type, newOption.value);
		} else if (newOption === null || newOption === undefined) {
			formik.setFieldValue(type, '');
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

	const Updating = () => {
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

	const updatingContacts = newContacts => {
		setSelectedEmails(prev => [...prev, ...newContacts]);
	};

	// generate number
	useGenerateNumber('estimate', 'estimate_number', formik, edit, id);

	const labelStyle = {
		display: 'flex',
		alignItems: 'start',
	};

	const MyDivider = () => (
		<Grid item xs={12} mt={3}>
			<Divider />
		</Grid>
	);

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
				<>
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
									value={selectedCustomer}
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

						{/* address container  */}
						<Grid item container>
							<Grid item xs={2}></Grid>
							{formik.values?.customer_id ? (
								<Grid
									item
									sm={4}
									bgcolor='#f9f9fb'
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
											customer_id={formik.values?.customer_id}
										/>
									</Grid>
								</Grid>
							) : null}
							{/* tax  */}
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

						<>
							<Grid item container mt={2}>
								<Grid item xs={2} sx={{ ...labelStyle }}>
									<InputLabel>
										Price Quote<span style={{ color: 'red' }}>*</span>
									</InputLabel>
								</Grid>
								<Grid item sm={4}>
									<FormField
										name='estimate_number'
										size='small'
										fullWidth
										value={formik.values?.estimate_number}
										handleChange={formik.handleChange}
										isTouched={formik.touched?.estimate_number}
										disabled={edit}
										error={
											formik.touched?.estimate_number &&
											formik.errors?.estimate_number &&
											formik.errors?.estimate_number
										}
									/>
								</Grid>
							</Grid>

							<Grid item container mt={2}>
								<Grid item xs={2} display='flex' alignItems='center'>
									<InputLabel>
										Price Quote Date<span style={{ color: 'red' }}>*</span>
									</InputLabel>{' '}
								</Grid>
								<Grid item xs={4}>
									<TextField
										name='estimate_date'
										value={formik.values?.estimate_date}
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
									<InputLabel>Validity</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<Select
										name='colors'
										options={paymentTerms}
										value={selectedPaymentTerms}
										// className="basic-multi-select"
										// classNamePrefix="select"
										placeholder='Select Validity Date'
										onChange={handleChange}
										isLoading={termLoading}
										styles={{
											control: (baseStyles, state) => ({
												...baseStyles,
												fontSize: '16px',
												fontWeight: 400,
												fontFamily: 'Roboto',
												color: 'black',
												background: 'transparent',
												// borderColor:
												//   formik.touched?.customer_id && formik.errors?.customer_id
												//     ? "red"
												//     : "rgba(0, 0, 0, 0.2)",
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
								</Grid>
							</Grid>
							<Grid item container mt={2}>
								<Grid item xs={2}>
									<InputLabel>
										Validity Date<span style={{ color: 'red' }}>*</span>
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
									{formik.touched?.expiry_date &&
										formik.errors?.expiry_date && (
											<Typography variant='caption' color='error'>
												{formik.errors?.expiry_date}
											</Typography>
										)}
								</Grid>
							</Grid>

							<MyDivider />

							{/* sales  */}
							<Grid item container sx={{ margin: '2rem 0' }}>
								<Grid item xs={2} display='flex' alignItems='center'>
									<InputLabel>
										Sales Person<span style={{ color: 'red' }}>*</span>
									</InputLabel>
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
							{/* Subject  */}
							<Grid item container sx={{ margin: '1rem 0' }}>
								<Grid item xs={2} sx={{ ...labelStyle }}>
									<InputLabel>
										Subject
										<HoverPopover text='You can add upto 250 characters '></HoverPopover>
									</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<TextArea
										minRows={2}
										aria-label='textarea'
										className='textarea-autosize'
										placeholder='Let your customer know what this Price Quote for'
										name='subject'
										value={formik.values?.subject || ''}
										onChange={formik.handleChange}
									/>
								</Grid>
								<MyDivider />
							</Grid>
							{/* item rates  */}
						</>

						<>
							<Grid
								item
								container
								sx={{ marginTop: '2rem' }}
								display='flex'
								justifyContent='flex-end'
							>
								<Grid item xs={12} md={6}></Grid>

								<Grid item container spacing={1} mt={1}>
									<Grid item sm={12}>
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
												value={formik.values?.customer_note || ''}
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
												value={formik.values?.terms_and_condition || ''}
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
											<FilesModule
												files={formik.values?.estimate_files}
												onDelete={deletingFile}
												setFiles={files =>
													formik.setFieldValue('estimate_files', files)
												}
											/>
										</Box>
									</Grid>
								</Grid>
							</Grid>
						</>

						{/* add new email/contact section  */}
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
							{isStatus === 'draft' && (
								<LoadingButton
									type='submit'
									variant='contained'
									onClick={() => handleButtonClick('save_as_draft')}
									disabled={saveAsDraftLoading}
									loading={saveAsDraftLoading}
								>
									Save as Draft
								</LoadingButton>
							)}
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
				</>
			</div>
		</form>
	);
};
export default PriceQuoteForm;
