import { Grid, Table, Typography } from '@mui/material';
import {
	TableBody,
	TableBodyCell,
	TableContainer,
	TableHead,
	TableHeadCell,
	TableRow,
} from '../Table/Table';

const TemplateAddress = ({ data, shippingAddress, headings }) => {
	const billingAddress = data?.default_billing_address
		? data?.default_billing_address
		: data?.customer_billing_address &&
		  data?.customer_billing_address?.find(item => item.is_default == 1);
	const shipping_Address = data?.default_shipping_address
		? data?.default_shipping_address
		: data?.customer_shipping_address &&
		  data?.customer_shipping_address?.find(item => item.is_default == 1);
	return (
		<Grid item container mt={6}>
			<Grid item sm={12}>
				<TableContainer>
					<Table sx={{ minWidth: 650 }} aria-label='simple table'>
						<TableHead>
							<TableRow sx={{ backgroundColor: '#f0f0f0' }}>
								<TableHeadCell sx={{ padding: '0px 16px' }}>
									<Typography variant='templateBody2'>
										{/* Bill To */}
										{headings?.first}
									</Typography>
								</TableHeadCell>
								{shippingAddress && (
									<TableHeadCell sx={{ padding: '6px 16px' }}>
										<Typography variant='templateBody2'>
											{/* Ship To  */}
											{headings?.second}
										</Typography>
									</TableHeadCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableBodyCell sx={{ padding: '5px 10px' }}>
									<Typography variant='templateBody' style={{ lineHeight: 0 }}>
										{billingAddress?.attention || ''} <br />{' '}
										{billingAddress?.address || ''}
										{billingAddress?.city || ''}
										{billingAddress?.state?.name || ''}
										<br /> {billingAddress?.zipcode || ''}
										{billingAddress?.country?.name || ''}
										<br />
										{billingAddress?.phone || ''}
										<br />
										{data?.email || ''}
									</Typography>
								</TableBodyCell>
								{shippingAddress && (
									<TableBodyCell sx={{ padding: '0px', width: '40%' }}>
										<Typography
											variant='templateBody'
											style={{ lineHeight: 0 }}
										>
											{shipping_Address?.attention || ''}
											<br /> {shipping_Address?.address || ''}
											{shipping_Address?.city || ''}
											{shipping_Address?.state?.name || ''}
											<br /> {shipping_Address?.zipcode || ''}
											<br />
											{shipping_Address?.phone || ''}
											<br />
											{data?.email || ''}
										</Typography>
									</TableBodyCell>
								)}
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	);
};

export default TemplateAddress;
