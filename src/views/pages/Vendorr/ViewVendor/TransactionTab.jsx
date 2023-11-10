import { useState, useEffect } from 'react';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';
import {
	HeaderMenuButton,
	StyledListbox,
	StyledMenuItem,
} from '../VendorStylesConst';
import { Box, useTheme } from '@mui/system';
import {
	AddCircle,
	// FilterAlt,
	KeyboardArrowDown,
	KeyboardArrowRight,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
	StatusColor,
	formatDate,
	generateEncryptedID,
	// snakeCaseToPrettyText,
} from '../../../../core/utils/helpers';
import { getVendorTransactions } from '../../../../core/api/vendor';
import GridRow from '../../../Components/GridRow/GridRow';

function TransactionTab({ vendorID }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState('');
	const [transactionKey, setTransactionKey] = useState();
	const [transactionData, setTransactionData] = useState();
	const transactionsParams = {
		vendor_id: vendorID,
		search: transactionKey,
	};
	useEffect(() => {
		async function fetchData() {
			if (
				[
					'estimate', // estimate will replace with purchse-order key
					'saleOrder', // this key will replace with bill key
					'paymentLinks', // this key will replace with bill-payment key
					'creditMemo', // this key will replace with vendor-credit key
				].includes(transactionKey)
			) {
				try {
					const transactions = await getVendorTransactions(transactionsParams);
					console.log('transactions', transactions?.data[0]);
					setTransactionData(transactions?.data);
				} catch (error) {
					console.error('Error fetching transactions:', error);
				}
			}
		}
		fetchData();
	}, [transactionKey]);
	const handleChangeAcc = panel => (event, newExpanded) => {
		console.log('tabpanel', panel);
		setExpanded(newExpanded ? panel : false);
		if (newExpanded && panel === 'purchaseOrderTab')
			setTransactionKey('estimate');
		else if (newExpanded && panel === 'billsTab')
			setTransactionKey('saleOrder');
		else if (newExpanded && panel === 'billPaymentTab')
			setTransactionKey('paymentLinks');
		else if (newExpanded && panel === 'invoiceTab')
			setTransactionKey('invoices');
		else if (newExpanded && panel === 'VendorCreditTab')
			setTransactionKey('creditMemo');
		else {
			setTransactionKey('');
		}
	};
	return (
		<Box>
			<Dropdown>
				<HeaderMenuButton
					onClick={e => e.stopPropagation()}
					style={{
						backgroundColor: 'transparent',
						marginBottom: '20px',
					}}
				>
					<Typography variant='body1' sx={{ fontSize: '18px' }}>
						Go to transactions
						<KeyboardArrowDown
							color='primary'
							sx={{ fontSize: '20px', marginBottom: '-3px' }}
						/>
					</Typography>
				</HeaderMenuButton>
				<Menu slots={{ listbox: StyledListbox }}>
					<StyledMenuItem
						onClick={() => {
							setExpanded('purchaseOrderTab');
							setTransactionKey('estimate');
						}}
					>
						Purchase Order
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('billsTab');
							setTransactionKey('saleOrder');
						}}
					>
						Bills
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('billPaymentTab');
							setTransactionKey('paymentLinks');
						}}
					>
						Bill Payment
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('VendorCreditTab');
							setTransactionKey('creditMemo');
						}}
					>
						Vendor Credit
					</StyledMenuItem>
				</Menu>
			</Dropdown>
			{/* Purchase Order Accordion */}
			<Accordion
				expanded={expanded === 'purchaseOrderTab'}
				onChange={handleChangeAcc('purchaseOrderTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel4d-content'
					id='panel4d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Purchase Orders</Typography>
					{/* <Dropdown>
						<HeaderMenuButton
							onClick={e => e.stopPropagation()}
							style={{
								position: 'absolute',
								right: '150px',
								marginTop: '-3px',
								backgroundColor: 'transparent',
							}}
						>
							{expanded === 'purchaseOrderTab' && (
								<>
									<FilterAlt
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
									Status: All
									<KeyboardArrowDown
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
								</>
							)}
						</HeaderMenuButton>
						<Menu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								All
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Draft
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Sent
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Client Viewed
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Accepted
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Invoiced
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Declined
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Expired
							</StyledMenuItem>
						</Menu>
					</Dropdown> */}
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/purchase-orders/new?vendorID=${generateEncryptedID(vendorID)}`
							);
						}}
					>
						<AddCircle color='primary' sx={{ fontSize: '15px' }} />
						<Typography variant='body2' color='black'>
							Add New
						</Typography>
					</IconButton>
				</AccordionSummary>
				<AccordionDetails>
					{transactionData?.length > 0 &&
					transactionData[0]?.estimate?.length > 0 ? (
						<>
							<GridRow style={{ paddingBottom: '8px' }}>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Date</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Purchase Order#</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Vendor Name</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Status</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Billed Status</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>Amount</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>Status</Typography>
								</Grid>
							</GridRow>
							{transactionData[0]?.estimate?.map(estimate => (
								<GridRow style={{ paddingBottom: '8px' }} key={estimate?.id}>
									<Grid item xs={1.7}>
										<Typography variant='body2'>
											{formatDate(estimate?.estimate_date)}
										</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>
											{estimate?.estimate_number}
										</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>vendor name</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>status</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>billed status</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>$ {estimate?.total}</Typography>
									</Grid>
									<Grid
										item
										xs={1.7}
										sx={{
											textAlign: 'right',
											color: StatusColor(estimate?.status, theme),
										}}
										className='TextCapitalize'
									>
										<Typography variant='body2'>
											{estimate?.status || 'unpaid'}
										</Typography>
									</Grid>
								</GridRow>
							))}
						</>
					) : (
						<Box sx={{ textAlign: 'center' }}>
							<Typography variant='body2Grey'>
								There are no Purchase Orders
								<Typography
									component={'span'}
									color='primary'
									fontSize='small'
									sx={{ cursor: 'pointer' }}
									onClick={e => {
										e.stopPropagation();
										navigate(
											`/purchase-orders/new?vendorID=${generateEncryptedID(
												vendorID
											)}`
										);
									}}
								>
									- Add New
								</Typography>
							</Typography>
						</Box>
					)}
				</AccordionDetails>
			</Accordion>
			{/* Bills Accordion */}
			<Accordion
				expanded={expanded === 'billsTab'}
				onChange={handleChangeAcc('billsTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='billsTabd-content'
					id='billsTabd-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Bills</Typography>
					{/* <Dropdown>
						<HeaderMenuButton
							onClick={e => e.stopPropagation()}
							style={{
								position: 'absolute',
								right: '150px',
								marginTop: '-3px',
								backgroundColor: 'transparent',
							}}
						>
							{expanded === 'purchaseOrderTab' && (
								<>
									<FilterAlt
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
									Status: All
									<KeyboardArrowDown
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
								</>
							)}
						</HeaderMenuButton>
						<Menu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								All
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Draft
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Sent
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Client Viewed
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Accepted
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Invoiced
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Declined
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Expired
							</StyledMenuItem>
						</Menu>
					</Dropdown> */}
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(`/bills/new?vendorID=${generateEncryptedID(vendorID)}`);
						}}
					>
						<AddCircle color='primary' sx={{ fontSize: '15px' }} />
						<Typography variant='body2' color='black'>
							Add New
						</Typography>
					</IconButton>
				</AccordionSummary>
				<AccordionDetails>
					{transactionData?.length > 0 &&
					transactionData[0]?.sale_order?.length > 0 ? (
						<>
							<GridRow style={{ paddingBottom: '8px' }}>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Date</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Bill#</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Vendor Name</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Status</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Due Date</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>Amount</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>Balance Due</Typography>
								</Grid>
							</GridRow>
							{transactionData[0]?.sale_order?.map(salesorder => (
								<GridRow style={{ paddingBottom: '8px' }} key={salesorder?.id}>
									<Grid item xs={1.7}>
										<Typography variant='body2'>
											{formatDate(salesorder?.sale_order_date)}
										</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>
											{salesorder?.sale_order_number}
										</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>vendor name</Typography>
									</Grid>
									<Grid
										item
										xs={1.7}
										sx={{
											color: StatusColor(salesorder?.status, theme),
										}}
										className='TextCapitalize'
									>
										<Typography variant='body2'>
											{salesorder?.status || 'unpaid'}
										</Typography>
									</Grid>

									<Grid item xs={1.7}>
										<Typography variant='body2'>Due date</Typography>
									</Grid>

									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>
											$ {salesorder?.total}
										</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'> $ BalanceDue</Typography>
									</Grid>
								</GridRow>
							))}
						</>
					) : (
						<Box sx={{ textAlign: 'center' }}>
							<Typography variant='body2Grey'>
								There are no Bills
								<Typography
									component={'span'}
									color='primary'
									fontSize='small'
									sx={{ cursor: 'pointer' }}
									onClick={e => {
										e.stopPropagation();
										navigate(
											`/bills/new?vendorID=${generateEncryptedID(vendorID)}`
										);
									}}
								>
									- Add New
								</Typography>
							</Typography>
						</Box>
					)}
				</AccordionDetails>
			</Accordion>
			{/* Bill Payments Accordion */}
			<Accordion
				expanded={expanded === 'billPaymentTab'}
				onChange={handleChangeAcc('billPaymentTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel3d-content'
					id='panel3d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Bill Payments</Typography>
					<Dropdown>
						<HeaderMenuButton
							onClick={e => e.stopPropagation()}
							style={{
								position: 'absolute',
								right: '150px',
								marginTop: '-3px',
								backgroundColor: 'transparent',
							}}
						></HeaderMenuButton>
						<Menu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem> All</StyledMenuItem>
							<StyledMenuItem> Draft</StyledMenuItem>
							<StyledMenuItem> Client View</StyledMenuItem>
							<StyledMenuItem> Partially Paid</StyledMenuItem>
							<StyledMenuItem> Unpaid</StyledMenuItem>
							<StyledMenuItem> Paid</StyledMenuItem>
							<StyledMenuItem> Void</StyledMenuItem>
						</Menu>
					</Dropdown>
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/bill-payments/new?vendorID=${generateEncryptedID(vendorID)}`
							);
						}}
					>
						<AddCircle color='primary' sx={{ fontSize: '15px' }} />
						<Typography variant='body2' color='black'>
							Add New
						</Typography>
					</IconButton>
				</AccordionSummary>
				<AccordionDetails>
					{transactionData?.length > 0 &&
					transactionData[0]?.payment_links?.length > 0 ? (
						<>
							<GridRow style={{ paddingBottom: '8px' }}>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Date</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Bill#</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Vendor Name</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Status</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Due Date</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>Amount</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>Balance Due</Typography>
								</Grid>
							</GridRow>
							{transactionData[0]?.payment_links?.map(paymentLink => (
								<GridRow style={{ paddingBottom: '8px' }} key={paymentLink?.id}>
									<Grid item xs={1.7}>
										<Typography variant='body2'>
											{formatDate(paymentLink?.created_at)}
										</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Bill#</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>vendor name</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography
											variant='body2'
											sx={{
												color: StatusColor(paymentLink?.status, theme),
												textTransform: 'capitalize',
											}}
										>
											{paymentLink?.status}
										</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>
											{formatDate(paymentLink?.link_expiration_date)}
										</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>
											$ {paymentLink?.payment_amount}
										</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>$ Balance Due</Typography>
									</Grid>
								</GridRow>
							))}
						</>
					) : (
						<Box sx={{ textAlign: 'center' }}>
							<Typography variant='body2Grey'>
								There are no Bill Payments
								<Typography
									component={'span'}
									color='primary'
									fontSize='small'
									sx={{ cursor: 'pointer' }}
									onClick={e => {
										e.stopPropagation();
										navigate(
											`/bill-payments/new?vendorID=${generateEncryptedID(
												vendorID
											)}`
										);
									}}
								>
									- Add New
								</Typography>
							</Typography>
						</Box>
					)}
				</AccordionDetails>
			</Accordion>
			{/* Vendor Credit Accordion */}
			<Accordion
				expanded={expanded === 'VendorCreditTab'}
				onChange={handleChangeAcc('VendorCreditTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel9d-content'
					id='panel9d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Vendor Credit</Typography>
					{/* <Dropdown>
						<HeaderMenuButton
							onClick={e => e.stopPropagation()}
							style={{
								position: 'absolute',
								right: '150px',
								marginTop: '-3px',
								backgroundColor: 'transparent',
							}}
						>
							{expanded === 'VendorCreditTab' && (
								<>
									<FilterAlt
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
									Status: All
									<KeyboardArrowDown
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
								</>
							)}
						</HeaderMenuButton>
						<Menu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								All
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Open
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Close
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								Void
							</StyledMenuItem>
						</Menu>
					</Dropdown> */}
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/vendor-credits/new?vendorID=${generateEncryptedID(vendorID)}`
							);
						}}
					>
						<AddCircle color='primary' sx={{ fontSize: '15px' }} />
						<Typography variant='body2' color='black'>
							Add New
						</Typography>
					</IconButton>
				</AccordionSummary>
				<AccordionDetails>
					{transactionData?.length > 0 &&
					transactionData[0]?.credit_memo?.length >= 0 ? (
						<>
							<GridRow style={{ paddingBottom: '8px' }}>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Date</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Vendor Credits</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Vendor Name</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Status</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Bill</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>Amount</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>Balance</Typography>
								</Grid>
							</GridRow>
							{/* {transactionData[0]?.credit_memo?.map(creditmemo => ( */}
							<GridRow
								style={{ paddingBottom: '8px' }}
								// key={creditmemo?.id}
							>
								<Grid item xs={1.7}>
									<Typography variant='body2'>
										{formatDate('2022-oct-2')}
									</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>vendor credit #</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>vendor name</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography
										variant='body2'
										sx={{
											color: StatusColor('draft', theme),
											textTransform: 'capitalize',
										}}
									>
										{/* {creditmemo?.status || 'N/A'} */}
										status
									</Typography>
								</Grid>
								<Grid item xs={1.7}>
									<Typography variant='body2'>Bill number</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>$ {55.0}</Typography>
								</Grid>
								<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
									<Typography variant='body2'>$ Balance</Typography>
								</Grid>
							</GridRow>
							{/* ))} */}
						</>
					) : (
						<Box sx={{ textAlign: 'center' }}>
							<Typography variant='body2Grey'>
								There are no Vendor Credits
								<Typography
									component={'span'}
									color='primary'
									fontSize='small'
									sx={{ cursor: 'pointer' }}
									onClick={e => {
										e.stopPropagation();
										navigate(
											`/vendor-credits/new?vendorID=${generateEncryptedID(
												vendorID
											)}`
										);
									}}
								>
									- Add New
								</Typography>
							</Typography>
						</Box>
					)}
				</AccordionDetails>
			</Accordion>
		</Box>
	);
}
const TransactionAccordion = {
	backgroundColor: '#E4F2FE',
	color: 'black',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-content': {
		'.MuiTypography-root': {
			fontSize: '15px',
			fontWeight: '500',
		},
	},
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
};
export default TransactionTab;
