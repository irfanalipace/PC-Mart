import { useEffect, useState } from 'react';
import {
	getAllPayables,
	exportPayable,
	deletePayableApi,
} from '../../../core/api/payables.js';
import { Box, IconButton, Grid, Typography, Button } from '@mui/material';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import {
	Add,
	Cached,
	Close,
	Delete,
	Edit,
	KeyboardArrowDown,
	MailOutline,
	MoreHoriz,
	SaveAlt,
	UploadFile,
} from '@mui/icons-material';
import DataTable from '../../Components/DataTable/DataTable';
import { useNavigate } from 'react-router-dom';
import useHash from '../../../core/hooks/useHash';
import {
	decryptId,
	extractNumberFromHash,
	formatDate,
	generateEncryptedID,
} from '../../../core/utils/helpers';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
// import './Payable.css';
import {
	StyledListbox,
	TriggerButton,
	HeaderMenuButton,
	StyledMenuItem,
	headerIconButton,
	headerMenuBox,
} from './PayableStylesConst';
import TableContainer from '../../Components/Containers/TableContainer';
import DetailViewContainer from '../../Components/Containers/DetailViewContainer';
import ImportFileModal from '../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../Components/Containers/TableGrid';
import AccountPayableView from './AccountPayableView/AccountPayableView'

const AccountPayable = ({ reRender }) => {
	// console.log('reRender', reRender);
	const navigate = useNavigate();
	const [selectedRows, setSelectedRows] = useState([]);
	const [openImport, setOpenImport] = useState(false);
	const [openExport, setOpenExport] = useState(false);
	const [viewPayable, setViewPayable] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [id, setId] = useState(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const handleSendMail = id => {
		navigate(`/send/email/account-payable/${generateEncryptedID(id)}`);
	};
	const intialColumns = [
		{
			accessorKey: 'created_at',
			header: 'Date',
			Cell: ({ cell }) => {
				const date = cell.getValue();
				const formatedDate = formatDate(date);
				return <Box component='span'>{formatedDate}</Box>;
			},
		},
		{
			accessorKey: 'id',
			header: 'Payment #',
		},
		// {
		//   accessorKey: 'Type',
		//   header: 'payment_method'
		// },
		{
			accessorKey: 'reference_number',
			header: 'Reference Number',
		},
		{
			accessorKey: 'customer.display_name',
			header: 'Customer Name',
		},
		{
			accessorKey: 'invoice.invoice_number',
			header: 'Invoice #',
		},
		{
			accessorKey: 'payment_mode',
			header: 'Mode',
			Cell: ({ cell }) => (
				<Typography variant='body2' className='TextCapitalize'>
					{cell.getValue()}
				</Typography>
			),
		},
		{
			accessorKey: 'payment_made',
			header: 'Amount',
			Cell: ({ cell }) => (
				<Typography variant='body2'>${cell.getValue()}</Typography>
			),
		},
		// {
		//   accessorKey: 'invoice.status',
		//   header: 'Status',
		//   Cell: ({ row }) =>
		//     <Typography variant="body2" className='TextCapitalize'>{row?.original?.status}</Typography>
		// },
	];

	const collapsedColumns = [
		{
			accessorKey: 'display_name',
			header: 'Company Name',
			Cell: ({ row }) => {
				const wholedata = row?.original;
				const formatedDate = formatDate(row?.original?.created_at);
				return (
					<Box>
						<Grid container sx={{ justifyContent: 'space-between' }}>
							<Grid item x={6}>
								<Typography variant='subtitle2'>
									{row?.original?.customer?.display_name}
								</Typography>
								<Typography
									component='span'
									variant='body2Grey'
									sx={{ fontSize: '12px' }}
								>
									{wholedata?.invoice?.invoice_number} |{' '}
								</Typography>
								<Typography
									component='span'
									variant='body2Grey'
									sx={{ fontSize: '12px' }}
								>
									{formatedDate}
								</Typography>
								{/* <Typography component='p' variant="body2Grey" sx={{ fontSize: '12px', wordWrap: 'break-word', width: '200px' }}>| {wholedata?.reference_number}</Typography> */}
							</Grid>
							<Grid item x={6} sx={{ textAlign: 'right' }}>
								<Typography variant='body2'>
									${wholedata?.payment_made || 0}
								</Typography>
								<Typography component='p' variant='caption'>
									{wholedata?.payment_method}
								</Typography>
								<Typography variant='caption' className='TextCapitalize'>
									{wholedata?.payment_mode || 'Status: null'}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				);
			},
		},
	];
	const [columns, setColumns] = useState(intialColumns);
	const [hash, setHash] = useHash();

	useEffect(() => {
		const id = extractNumberFromHash(hash);
		const decryptedId = decryptId(id);
		setId(decryptedId);
		if (decryptedId) {
			setColumns(collapsedColumns);
			setViewPayable(true);
		} else {
			setColumns(intialColumns);
			setViewPayable(false);
		}
	}, [hash]);

	useEffect(() => {
		setRefresh(prev => prev + 1);
	}, [reRender]);

	// console.log('refResh: ', refresh);
	const handleEditModal = (e, row) => {
		e.stopPropagation();
		navigate(`/account-payable/edit/${generateEncryptedID(row)}`);
	};

	// const handleDeleteModal = params => {
	// 	console.log('id: ' + params.id);
	// };

	const handleRowClick = row => {
		// setHash('#/' + row?.id);
		setHash('#/' + generateEncryptedID(row?.id));
	};
	// const handleBulkDelete = async () => {
	// 	console.log('selectedRows', selectedRows);
	// 	try {
	// 		await bulkdeletePayableApi({ ids: selectedRows });
	// 		setRefresh(prev => prev + 1);
	// 	} catch (err) {
	// 		console.log('err', err);
	// 	}
	// };
	const PayableCard = ({ data }) => (
		<>
			<Box sx={{}}>
				<Typography variant='body1bold' color='primary'>
					{data?.display_name}
				</Typography>
				<Typography variant='body2'>${data?.opening_balance || 0}</Typography>
			</Box>
		</>
	);

	const handleDelete = async id => {
		try {
			await deletePayableApi(id);
			setRefresh(prev => prev + 1);
		} catch (err) {
			console.log('err', err);
		}
	};

	const Actions = ({ id }) => {
		return (
			<Box
				className='show-on-hover'
				sx={{ display: 'none' }}
				// sx={{ textAlign:'right',marginRight:'80px' }}
			>
				<Dropdown>
					<TriggerButton onClick={e => e.stopPropagation()}>
						<KeyboardArrowDown />
					</TriggerButton>
					<Menu slots={{ listbox: StyledListbox }}>
						<StyledMenuItem onClick={e => handleEditModal(e, id)}>
							<Edit /> Edit
						</StyledMenuItem>
						<StyledMenuItem
							onClick={e => {
								e.stopPropagation();
								handleSendMail(id);
							}}
						>
							<MailOutline /> Email Payable
						</StyledMenuItem>
						<StyledMenuItem
							onClick={e => {
								e.stopPropagation();
								setOpenConfirmDialog(true);
								setDialogProps({
									onConfirm: () => handleDelete(id),
								});
							}}
						>
							<Delete /> Delete
						</StyledMenuItem>
					</Menu>
				</Dropdown>
			</Box>
		);
	};
	// const ImportTypeEnum = [
	// 	{
	// 		key: 'customers_import',
	// 		label: 'Customer Complete Detail',
	// 		filePath: '/files/sample_contacts_new',
	// 	},
	// 	{
	// 		key: 'customers_contacts_persons_import',
	// 		label: 'Customer' + 's Contact Persons',
	// 		filePath: '/files/sample_contactpersons',
	// 	},
	// ];
	// const ExportTypeEnum = [
	// 	{
	// 		key: 'customers_export',
	// 		label: 'Customers Complete Detail',
	// 	},
	// 	{
	// 		key: 'customers_contacts_persons_export',
	// 		label: 'Customer' + 's Contact Persons',
	// 	},
	// 	{
	// 		key: 'customers_addresses_export',
	// 		label: 'Customer' + 's Addresses',
	// 	},
	// ];

	const headerIconButton = {
		backgroundColor: 'WHITE',
		border: '1px solid #1976d2',
		fontSize: '12px',
		borderRadius: '3px',
		textTransform: 'none',
		padding: '4px',
	};

	return (
		<>
			<Grid container>
				<TableGrid sm={viewPayable ? 3.2 : 12}>
					<HeaderPaper>
						<Grid
							container
							rowSpacing={1}
							columnSpacing={{ xs: 1, sm: 2, md: 3 }}
							sx={{ display: 'flex', alignItems: 'center', paddingY: '1px' }}
						>
							<Grid item xs={8}>
								{selectedRows.length > 0 ? (
									<Box sx={headerMenuBox}>
										{/* <IconButton sx={headerIconButton}>
											<Mail sx={{ fontSize: '18px' }} />
										</IconButton>
										<IconButton sx={headerIconButton}>
											<Print sx={{ fontSize: '18px' }} />
										</IconButton> */}
										{/* <Button
											sx={headerIconButton}
											onClick={() => {
												setOpenConfirmDialog(true);
												setDialogProps({
													onConfirm: handleBulkDelete,
												});
											}}
										>
											<Delete /> {''}Delete
										</Button> */}
										{/* <Button
											sx={headerIconButton}
											style={{
												color: 'black',
												margin: '0 10px',
												fontSize: '12px'
											}}
											>
											Bulk Update
										</Button> */}
										{/* <Dropdown>
											<HeaderMenuButton onClick={e => e.stopPropagation()}>
												<MoreHoriz sx={{ fontSize: '18px' }} />
											</HeaderMenuButton>
											<Menu slots={{ listbox: StyledListbox }}>
												<StyledMenuItem> Enable Portal</StyledMenuItem>
												<StyledMenuItem> Merge</StyledMenuItem>
												<StyledMenuItem> Accociate Templates</StyledMenuItem>
												<StyledMenuItem> Mark as Inactive</StyledMenuItem>
											</Menu>
										</Dropdown> */}
									</Box>
								) : (
									<Dropdown>
										<MenuButton
											onClick={e => e.stopPropagation()}
											style={{ backgroundColor: 'transparent', border: 'none' }}
										>
											<Typography
												noWrap
												variant='h6'
												className='TextCapitalize'
											>
												All Payables
												{/* <ArrowDropDown sx={{ margin: '0 -5px -5px 0' }} /> */}
											</Typography>
										</MenuButton>
										{/* <Menu slots={{ listbox: StyledListbox }}>
											<StyledMenuItem> Active Payables</StyledMenuItem>
											<StyledMenuItem> CRM Payables</StyledMenuItem>
											<StyledMenuItem> Duplicate Payables</StyledMenuItem>
											<StyledMenuItem> Inactive Payables</StyledMenuItem>
											<StyledMenuItem> Payable Portal Enabled</StyledMenuItem>
											<StyledMenuItem> Payable Portal Disabled</StyledMenuItem>
											<StyledMenuItem> Overdue Payables</StyledMenuItem>
											<StyledMenuItem> Unpaid Payables</StyledMenuItem>
											<StyledMenuItem>
												Associate with Payment Options
											</StyledMenuItem>
											<StyledMenuItem
												sx={{ color: '#2196F3' }}
												onClick={e => {
													e.stopPropagation();
													navigate('/account-payable/new');
												}}
											>
												<Add />
												New Payable View
											</StyledMenuItem>
										</Menu> */}
									</Dropdown>
								)}
							</Grid>
							<Grid item xs={4} sx={{ textAlign: 'right' }}>
								{selectedRows.length > 0 ? (
									<IconButton onClick={() => setRefresh(prev => prev + 1)}>
										<Close />
									</IconButton>
								) : (
									<Box>
										<Button
											size='medium'
											onClick={() => navigate('/account-payable/new')}
											variant='contained'
											sx={{ minWidth: '0', padding: '5px 7px' }}
										>
											<Add fontSize='small' />
											{!viewPayable && 'New'}
										</Button>
										<IconButton
											component={'span'}
											sx={{ padding: '0', marginLeft: '10px' }}
										>
											<Dropdown>
												<HeaderMenuButton
													onClick={e => e.stopPropagation()}
													sx={{ padding: '7px' }}
												>
													<MoreHoriz fontSize='small' />
												</HeaderMenuButton>
												<Menu slots={{ listbox: StyledListbox }}>
													{/* <StyledMenuItem onClick={() => setOpenImport(true)}>
														<SaveAlt /> Import Payables
													</StyledMenuItem> */}
													<StyledMenuItem onClick={() => setOpenExport(true)}>
														<UploadFile /> Export Payables
													</StyledMenuItem>
													<StyledMenuItem
														onClick={() => setRefresh(prev => prev + 1)}
													>
														<Cached /> Refresh List
													</StyledMenuItem>
												</Menu>
											</Dropdown>
										</IconButton>
									</Box>
								)}
							</Grid>
						</Grid>
					</HeaderPaper>
					<TableContainer>
						<DataTable
							api={getAllPayables}
							columns={columns}
							setSelectedRows={setSelectedRows}
							onRowClick={handleRowClick}
							collapsed={viewPayable}
							refresh={refresh}
							manualFilter
						/>
					</TableContainer>
				</TableGrid>
				{viewPayable && (
					<Grid item sm={8.7}  sx={{ marginLeft: '10px' }}>
						<DetailViewContainer>
							<AccountPayableView id={id} setRefresh={setRefresh} />
						</DetailViewContainer>
					</Grid>
				)}
			</Grid>
			<ConfirmDialog
				title='Are you sure you want to delete'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				{...dialogProps}
			/>
			{/* <ImportFileModal
				isOpen={openImport}
				onClose={() => setOpenImport(false)}
				importApi={importPayables}
				setRefresh={setRefresh}
			/> */}
			<ExportFileModal
				isOpen={openExport}
				onClose={() => setOpenExport(false)}
				exportApi={exportPayable}
			/>
		</>
	);
};

export default AccountPayable;
