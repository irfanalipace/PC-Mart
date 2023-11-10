import { useEffect, useState } from 'react';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import { Add } from '@mui/icons-material';
import MUIButton from '../../../Components/Button/MUIButton';
import { Box, Grid, Typography, Stack } from '@mui/material';
import TableContainer from '../../../Components/Containers/TableContainer';
import DataTable from '../../../Components/DataTable/DataTable';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import Name from '../../../Components/InputLabel/Name';
import {
	StatusColor,
	extractNumberFromHash,
	formatDate,
	generateEncryptedID,
} from '../../../../core/utils/helpers';
import useHash from '../../../../core/hooks/useHash';
import DetailViewContainer from '../../../Components/Containers/DetailViewContainer';
import TitleDropMenu from '../../../Components/TitleDropMenu/TitltDropMenu.';
import { useNavigate } from 'react-router-dom';
import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import {
	bulkDeleteCreditMemo,
	getAllCreditMemo,
} from '../../../../core/api/creditmemo';
import CreditMemoView from '../CreditMemoView/CreditMemoView';
import BulkActionButton from '../../../Components/BulkActionButtons/BulkActionButton';
import CreditMoreOpt from '../CreditMoreOpt';
import notyf from '../../../Components/NotificationMessage/notyfInstance';

const CreditMemoList = () => {
	const navigate = useNavigate();
	const intialColumns = [
		{
			accessorKey: 'created_at',
			header: 'Date',
			Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue)}</>,
		},
		{
			accessorKey: 'credit_memo_number',
			header: 'Credit Notes',
			Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>,
		},
		// {
		// 	accessorKey: 'reference_number',
		// 	header: 'Reference#',
		// },
		{
			header: 'Customer Name',
			Cell: ({ renderedCellValue, row }) => (
				<>{row?.original?.customer?.display_name}</>
			),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			Cell: ({ renderedCellValue }) => {
				const estStatusColor = StatusColor(renderedCellValue);
				return (
					<Typography
						variant='caption'
						sx={{ color: estStatusColor }}
						fontWeight={500}
						fontSize={11}
					>
						{renderedCellValue?.toUpperCase()}
					</Typography>
				);
			},
		},
		{
			accessorKey: 'invoice_id',
			header: 'Invoice',
		},
		{
			accessorKey: 'tax_amount',
			header: 'Amount',
			Cell: ({ renderedCellValue }) => <>${renderedCellValue}</>,
		},
		{
			accessorKey: 'total',
			header: 'Balance',
			Cell: ({ renderedCellValue }) => <>${renderedCellValue}</>,
		},
	];
	const [viewOrders, setViewOrders] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);
	const [refresh, setRefresh] = useState(0);
	const [columns, setColumns] = useState(intialColumns);
	const [openImport, setOpenImport] = useState(false);
	const [openExport, setOpenExport] = useState(false);
	const [id, setId] = useState(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [hash, setHash] = useHash();

	const handleRowClick = row => {
		setHash('#/' + generateEncryptedID(row?.id));
	};

	const collapsedColumns = [
		{
			accessorKey: 'customer',
			header: 'Company Name',
			Cell: ({ row }) => {
				const estStatusColor = StatusColor(row?.original?.status);
				return (
					<Box>
						<Grid container sx={{ justifyContent: 'space-between' }}>
							<Grid item x={6}>
								<Typography variant='subtitle2'>
									{row?.original?.customer?.display_name}
								</Typography>
								<Typography
									component='span'
									sx={{ fontSize: '12px', color: '#2196F3' }}
								>
									{row?.original?.credit_memo_number} |{' '}
									{formatDate(row?.original?.created_at)}
								</Typography>
							</Grid>
							<Grid item x={6} sx={{ textAlign: 'right' }}>
								<Typography sx={{ fontSize: '12px' }} variant='subtitle1'>
									${row?.original?.total || 0}
								</Typography>
								<Typography
									variant='caption'
									sx={{ color: estStatusColor }}
									fontWeight={500}
									fontSize={11}
								>
									{row?.original?.status?.toUpperCase()}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				);
			},
		},
	];

	useEffect(() => {
		const id = extractNumberFromHash(hash);
		setId(id);
		if (id) {
			setColumns(collapsedColumns);
			setViewOrders(true);
		} else {
			setColumns(intialColumns);
			setViewOrders(false);
		}
	}, [hash]);

	return (
		<>
			<Grid container>
				<Grid item sm={viewOrders ? 3 : 12}>
					<HeaderPaper sx={{ padding: '10px 20px' }}>
						<Grid item container>
							<>
								<Grid sm={6} display='flex' alignItems='center'>
									<Stack
										direction='row'
										display='flex'
										alignItems='center'
										spacing={0}
									>
										<Typography
											variant='h6'
											component='span'
											fontSize={viewOrders && 15}
										>
											All Credit Memos
										</Typography>
									</Stack>
								</Grid>
								<Grid
									sm={6}
									display='flex'
									justifyContent='end'
									alignItems='center'
									spacing={2}
								>
									<MUIButton
										size='medium'
										onClick={() => navigate('/credit-memo/new')}
										variant='contained'
									>
										<Add fontSize='small' />
										New
									</MUIButton>{' '}
									<CreditMoreOpt
										refreshList={() => setRefresh(prev => prev + 1)}
										setOpenImport={() => setOpenImport(true)}
										setOpenExport={() => setOpenExport(true)}
									/>
								</Grid>
							</>
						</Grid>
					</HeaderPaper>

					<TableContainer>
						<DataTable
							api={getAllCreditMemo}
							columns={columns}
							setSelectedRows={setSelectedRows}
							onRowClick={handleRowClick}
							collapsed={viewOrders}
							refresh={refresh}
							manualFilter
						/>
					</TableContainer>
				</Grid>
				{viewOrders && (
					<Grid item sm={8.9} sx={{ marginLeft: '10px' }}>
						<DetailViewContainer>
							<CreditMemoView id={id} />
						</DetailViewContainer>
					</Grid>
				)}
			</Grid>
			<ConfirmDialog
				title='Are you sure you want to delete'
				isOpen={openConfirmDialog}
				onClose={() => {
					setOpenConfirmDialog(false);
				}}
				{...dialogProps}
			/>
			<ImportFileModal
				isOpen={openImport}
				onClose={() => setOpenImport(false)}
				// ImportTypeEnum={ImportTypeEnum}
				// importApi={importSaleOrder}
			/>
			<ExportFileModal
				isOpen={openExport}
				onClose={() => setOpenExport(false)}
				// exportApi={exportSaleOrder}
			/>
		</>
	);
};

export default CreditMemoList;
