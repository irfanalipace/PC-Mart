import { Grid, IconButton, Paper, Typography } from '@mui/material';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	convertDateToLongFormat,
	decryptId,
	formatDate,
} from '../../../../core/utils/helpers';
import {
	acceptSalesOrderApi,
	declineSalesOrderApi,
	downloadCustomerSalesApi,
	showCustomerSaleOrderApi,
} from '../APIs/CustomerPortalAPIs';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import CloseIcon from '@mui/icons-material/Close';
import CustomerStatus from '../CustomerStatus/CustomerStatus';
import notyf from 'invoicing/src/Components/NotificationMessage/notyfInstance';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import { formToJSON } from 'axios';

const ViewSalesOrder = () => {
	const [saleorder, setSaleOrder] = useState([]);
	const [errors, setErrors] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [btnLoading, setbtnLoading] = useState(false);
	const [btnLoading2, setbtnLoading2] = useState(false);

	const navigate = useNavigate();
	const { customerId, id } = useParams();

	// getting specific sales order
	const showSalesOrder = async () => {
		try {
			setIsLoading(true);

			const saleorder = await showCustomerSaleOrderApi({
				customer_id: customerId,
				sale_order_id: id,
			});
			setSaleOrder(saleorder);
		} catch (error) {
			navigating();
		} finally {
			setIsLoading(false);
		}
	};
	const navigating = () => {
		navigate(`/customer-portal/${customerId}/sales-orders`);
	};

	useEffect(() => {
		showSalesOrder();
	}, []);

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
			value:
				saleorder?.sale_order_date &&
				formatDate(saleorder?.sale_order_date),
		},
		{
			label: 'Terms:',
			value: saleorder?.terms?.term_name,
		},
		{ label: 'Payment Mode:', value: 'Bank Transfer' },
		{ label: 'Delivery Terms:', value: 'Fedex' },
	];

	const accept = async () => {
		try {
			setbtnLoading2(true);

			await acceptSalesOrderApi({
				customer_id: customerId,
				sale_order_id: id,
			});
			notyf.success('Sales Order Accepted');
			showSalesOrder();
		} catch (error) {
			setErrors(error?.data?.message?.error);
		} finally {
			setbtnLoading2(false);
		}
	};

	const decline = async () => {
		try {
			setbtnLoading(true);

			await declineSalesOrderApi({
				customer_id: customerId,
				sale_order_id: id,
			});
			notyf.success('Sales Order Declined');
			showSalesOrder();
		} catch (error) {
			setErrors(error?.data?.message?.error);
		} finally {
			setbtnLoading(false);
		}
	};

	//   download
	const downloadingPdf = async () => {
		const decId = decryptId(id);

		try {
			const resp = await downloadCustomerSalesApi({ id: decId });
			window.open(resp?.data?.url, '_blank');
		} catch (error) {}
	};

	return (
		<Grid container>
			<Grid item sm={12}>
				<HeaderPaper
					sx={{
						paddingLeft: '2rem',
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography variant='h6'>Sales Order</Typography>
					<IconButton
						onClick={() =>
							navigating()
						}
					>
						<CloseIcon />
					</IconButton>
				</HeaderPaper>
			</Grid>
			{isLoading ? (
				<OverlayLoader open={isLoading} />
			) : (
				<Paper>
					<Grid item container my={2} display='flex' justifyContent='center'>
						<CustomerStatus
							errors={errors}
							setErrors={setErrors}
							status={saleorder?.status}
							accept={accept}
							decline={decline}
							btnLoading2={btnLoading2}
							btnLoading={btnLoading}
						/>
					</Grid>
					<Grid
						item
						container
						sx={{ position: 'relative' }}
						display='flex'
						justifyContent='center'
					>
						<Grid item sm={9} mt={2}>
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
								download
								downloadingPdf={downloadingPdf}
							/>
						</Grid>
					</Grid>
				</Paper>
			)}
		</Grid>
	);
};

export default ViewSalesOrder;
