import {
	Box,
	Chip,
	Divider,
	Grid,
	IconButton,
	Paper,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import OverlayLoader from '../../Components/OverlayLoader/OverlayLoader';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import CloseIcon from '@mui/icons-material/Close';
import ContainerPaper from '../../Components/Containers/ContainerPaper';
import MUIButton from '../../Components/Button/MUIButton';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import ViewTemplates from '../../Components/ViewTemplate/ViewTemplates';
import { Table, TableBody, TableHeadCell } from '../../Components/Table/Table';

const ViewVendorCredits = ({ id }) => {
	const [emailMenuAnchor, setEmailMenuAnchor] = useState(null);
	const [loading, setLoading] = useState(false);
	const openEmailMenu = event => {
		setEmailMenuAnchor(event.currentTarget);
	};
	const closeEmailMenu = () => {
		setEmailMenuAnchor(null);
	};
	const menuItems = [
		{
			label: 'Send Mail',
			onClick: () => {
				closeEmailMenu();
				// navigate(`/send/email/credit-memo/${id}`);
			},
		},
	];
	const columns = [
		{ id: '', label: 'No.', key: 'index' },
		{ id: '', label: 'Items Decription', key: 'item_name' },
		{ id: '', label: 'Qty', key: 'quantity' },
		{ id: '', label: 'UOM', key: 'uom' },
		{ id: '', label: 'Rate(USD)', key: 'rate' },
		{ id: '', label: 'Amount(USD)', key: 'total' },
	];
	const info = [
		{ label: 'Credit #:', value: '0002' },
		{
			label: 'Credit Date:',
			value: 'Aud 2, 2023',
		},
	];
	const headings = { first: 'From', second: 'To' };
	const data = {
		sub_total: 100,
		tax_amount: 0,
		discount: 50,
		shipping_charges: 20,
		adjustment: 30,
		total: 200,
		status: 'draft',
		vendor_credit_items: [
			{ item_name: 'something', quantity: '2', uom: 2, rate: 20, total: 40 },
			{ item_name: 'something', quantity: '2', uom: 2, rate: 20, total: 40 },
			{ item_name: 'something', quantity: '2', uom: 2, rate: 20, total: 40 },
		],
	};
	return (
		<Box sx={{ position: 'relative' }}>
			<HeaderPaper sx={{ marginBottom: 1 }}>
				<Grid item container>
					<Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant='h6'>CN-0001</Typography>
					</Grid>
					<Grid
						sm={6}
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
						}}
					>
						<IconButton>
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
			</HeaderPaper>
			<Paper sx={{ padding: '1rem', mb: 1 }}>
				<MUIButton
					variant='outlined'
					// onClick={() => navigate(`/credit-memo/edit/${id}`)}
					startIcon={<EditIcon />}
				>
					Edit
				</MUIButton>

				<MUIButton
					onClick={openEmailMenu}
					startIcon={<EmailOutlinedIcon fontSize='small' />}
					variant='outlined'
					sx={{ margin: '0 .2rem' }}
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

				<MUIButton
					startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
					variant='outlined'
					sx={{ margin: '0 .2rem' }}
					// onClick={downloadPDF}
				>
					Pdf/Print
				</MUIButton>
			</Paper>

			<ContainerPaper sx={{ padding: '1.5rem' }}>
				<ViewTemplates
					title='Vendor Credits'
					apiData={data}
					data={data?.vendor_credit_items}
					columns={columns}
					status={data?.status}
					headerInfo={info}
					addressData={data?.customer}
					showAddress
					bankDetails
					shippingAddress={true}
					headings={headings}
				/>

				<Grid mt={5} ml={2}>
					<Typography>Journal</Typography>
					<Divider />
				</Grid>
				<Grid mt={5} ml={2}>
					<Typography>
						Amount is displayed in your base currenct USD &ensp;{' '}
						<Chip label='USD' color='success' sx={{ padding: 0 }} />{' '}
					</Typography>
				</Grid>
				<Grid mt={3} ml={2}>
					<Typography>Vendor Credits</Typography>
				</Grid>
				<Grid mt={3} ml={2}>
					<Table sx={{ minWidth: 650 }} mt={3} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableHeadCell sx={{ padding: '6px 16px' }}>
									<Typography variant='templateBody2'>Head</Typography>
								</TableHeadCell>
								<TableHeadCell sx={{ padding: '6px 16px' }}>
									<Typography variant='templateBody2'>Debt</Typography>
								</TableHeadCell>
								<TableHeadCell sx={{ padding: '6px 16px' }}>
									<Typography variant='templateBody2'>Credit</Typography>
								</TableHeadCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableHeadCell>
									<Typography fontSize={13}>Acccounts Recievable</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>0.00</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>130.00</Typography>
								</TableHeadCell>
							</TableRow>
							<TableRow>
								<TableHeadCell>
									<Typography fontSize={13}>Unearned Revenue</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>130.00</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>0.00</Typography>
								</TableHeadCell>
							</TableRow>
							<TableRow>
								<TableHeadCell>
									<Typography fontSize={13}>Tax Payable</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>0.00</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>0.00</Typography>
								</TableHeadCell>
							</TableRow>
							<TableRow>
								<TableHeadCell></TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>20.00</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>20.00</Typography>
								</TableHeadCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
			</ContainerPaper>
			<OverlayLoader open={loading} />
		</Box>
	);
};

export default ViewVendorCredits;
