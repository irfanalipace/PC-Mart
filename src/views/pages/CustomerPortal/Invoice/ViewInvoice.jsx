import React, { useState, useEffect } from 'react';

import { Box, Grid, IconButton, Paper, Typography, Stack } from '@mui/material';
import {
	StatusColor,
	convertDateToLongFormat,
	decryptId,
	formatDate,
	snakeCaseToPrettyText,
} from '../../../../core/utils/helpers';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import CloseIcon from '@mui/icons-material/Close';
import {
	getInvoiceDashboardDetailsApi,
	downloadInvoiceDashboradApi,
} from '../../../../core/api/CustomerPortal/customerportal';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import TableAccordian from '../../../Components/TableAccordian/TableAccordian';
import PayNow from './PayNow';
import { useTheme } from '@emotion/react';

const ViewInvoice = () => {
	const navigate = useNavigate();
	const { customerId, id } = useParams();

	const [invoiceData, setInvoiceData] = useState(null);
	const [loading, setIsLoading] = useState(true);
	console.log('invoiceData', invoiceData);
	const navigating = () => {
		navigate(`/customer-portal/${customerId}/invoices`);
	};
	useEffect(() => {
		fetchingSingleInvoice();
	}, []);

	const fetchingSingleInvoice = async () => {
		try {
			const resp = await getInvoiceDashboardDetailsApi({
				customer_id: customerId,
				invoice_id: id,
			});
			setInvoiceData(resp?.data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			navigating();
		}
	};

	const columns = [
		{ id: '', label: 'No.', key: 'index' },
		{ id: '', label: 'Items Name', key: 'item_name' },
		{ id: '', label: 'Qty', key: 'quantity' },
		{ id: '', label: 'UOM', key: 'uom' },
		{ id: '', label: 'Rate(USD)', key: 'rate' },
		{ id: '', label: 'Amount(USD)', key: 'total' },
	];

	const info = [
		{
			label: 'Invoice Ref:',
			value:
				invoiceData?.invoice_number !== null
					? invoiceData?.invoice_number
					: '-',
		},
		{
			label: 'Invoice Date:',
			value:
				invoiceData?.invoice_date !== null
					? convertDateToLongFormat(invoiceData?.invoice_date)
					: '-',
		},
		{
			label: 'P.O. Reference:',
			value:
				invoiceData?.po_reference_no !== null
					? invoiceData?.po_reference_no
					: '-',
		},
		{
			label: 'Terms:',
			value: invoiceData?.term_name || invoiceData?.term?.name || '-',
		},
		{
			label: 'Payment Mode:',
			value: invoiceData?.mode_of_payment || '-',
		},
		{
			label: 'Delivery Terms:',
			value:
				invoiceData?.delivery_source !== null
					? invoiceData?.delivery_source
					: '-',
		},
	];
	const theme = useTheme();
	const tbCols = [
		{ id: '', label: 'No.', key: 'index' },

		{ id: '', label: 'Invoice', key: 'sale_order_number' },
		{ id: '', label: 'Status', key: 'status' },
		// { id: '', label: 'Due Date', key: 'sale_order_date' },
		{ id: '', label: 'Amount', key: 'total' },
		// { id: '', label: 'Balance Due', key: 'rate' },
		{ id: '', label: 'Date', key: 'sale_order_date' },
	];

	const tbData = [
		{
			sale_order_number: invoiceData?.sale_order?.sale_order_number,
			status: (
				<Typography
					variant='body2'
					sx={{
						color: StatusColor(invoiceData?.sale_order?.status, theme),
					}}
				>
					{snakeCaseToPrettyText(invoiceData?.sale_order?.status)}
				</Typography>
			),
			total: `$${invoiceData?.sale_order?.total}`,
			sale_order_date: formatDate(invoiceData?.sale_order?.sale_order_date),
		},
	];

	const downloadingPdf = async () => {
		const decId = decryptId(id);

		try {
			const resp = await downloadInvoiceDashboradApi({ id: decId });
			window.open(resp?.data?.url, '_blank');
		} catch (error) {}
	};
	return (
		<>
			<OverlayLoader open={loading} />
			<Box sx={{ padding: '0 1rem' }}>
				<HeaderPaper
					sx={{
						paddingLeft: '2rem',
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography variant='h6'>Invoice</Typography>
					<IconButton onClick={() => navigating()}>
						<CloseIcon />
					</IconButton>
				</HeaderPaper>
				<Paper sx={{ padding: '3rem 5rem', margin: '' }}>
					<Grid item xs={12} mb={3} display='flex' justifyContent='flex-end'>
						<PayNow />
					</Grid>
					{/* <Grid item container display='flex' justifyContent='center'>
						<Grid item sm={12}>
							<TableAccordian
								title='Price Quote'
								data={invoiceData?.invoice_items}
								columns={tbCols}
							></TableAccordian>
						</Grid>
					</Grid>*/}

					<Grid item container display='flex' justifyContent='center' my={3}>
						<Grid item sm={12}>
							{invoiceData?.sale_order && (
								<TableAccordian
									title='Sales Orders'
									data={tbData}
									columns={tbCols}
								/>
							)}
						</Grid>
					</Grid>
					<Box mt={3} mb={3}>
						<ViewTemplates
							title='INVOICE'
							apiData={invoiceData}
							data={invoiceData?.invoice_items}
							columns={columns}
							status={invoiceData?.status}
							headerInfo={info}
							bankDetails
							showAddress
							shippingAddress={true}
							addressData={invoiceData?.customer}
							download
							downloadingPdf={downloadingPdf}
						/>
					</Box>
				</Paper>
			</Box>
		</>
	);
};

export default ViewInvoice;
