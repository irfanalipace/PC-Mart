import { useState } from 'react';
import {
	Box,
	Button,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TableCell,
	Tooltip,
	Typography,
} from '@mui/material';
import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import { getSolditems } from '../../../core/api/readyItems';
import DataTableHeading from '../../Components/DataTable/DataTableHeading';
import DataTableExtendedHeader from '../../Components/DataTable/DataTableExtendedHeader';
import ImportFile from '../../Components/ImportFile';
import { getUploadFile } from '../../../core/api/fileupload';
import { formatDateToYYYYMMDD } from '../../../core/utils/helpers';
import { Download } from '@mui/icons-material';

const SoldItems = () => {
	const [refresh, setRefresh] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [bathcNumber, setBatchNumber] = useState(null);

	const handleSearchChange = serchValue => {
		setSearchText(serchValue);
		setRefresh(prev => prev + 1);
	};

	const handleBatchChange = e => {
		setBatchNumber(e.target.value);
		setRefresh(prev => prev + 1);
	};
	const getColorForStatus = status => {
		switch (status) {
			case 'error':
				return 'red';
			case 'pending':
				return '#ED6C02';
			case 'processing':
				return '#2196F3';
			case 'processed':
				return '#2E7D32';
			default:
				return 'black'; // or any default color
		}
	};
	const intialColumns = [
		{
			accessorKey: 'file.batch_number',
			header: 'Batch No',
		},
		{
			accessorKey: 'serial_number',
			header: 'Serial No',
		},
		{
			accessorKey: 'make',
			header: 'Make',
		},
		{
			accessorKey: 'model',
			header: 'Model',
		},
		{
			accessorKey: 'cpu',
			header: 'CPU',
		},
		{
			accessorKey: 'ram',
			header: 'RAM',
		},
		{
			accessorKey: 'hdd',
			header: 'HDD',
		},
		{
			accessorKey: 'price',
			header: 'Price',
		},
	];

	const uploadsoldColumns = [
		{
			accessorKey: 'name',
			header: 'File Name',
			size: 100,
		},
		{
			accessorKey: 'uploaded_date_time',
			header: 'Upload Date, Time',
			Cell: ({ renderedCellValue }) => (
				<>{formatDateToYYYYMMDD(renderedCellValue)}</>
			),
		},

		{
			accessorKey: 'status',
			header: 'Status',
			Cell: ({ row }) => (
				<TableCell
					// onClick={() => handleStatusClick(row)}
					style={{
						color: getColorForStatus(row.original.status),
						border: 'none',
						background: 'none',
					}}
				>
					<Typography sx={{ textTransform: 'capitalize' }}>
						{row.original.status}
					</Typography>
				</TableCell>
			),
		},
		{
			accessorKey: 'batch_number',
			header: 'Batch No',
			Cell: ({ row }) => (
				<Tooltip
					title={
						<>
							{`Total Ready: ${row?.original?.ready_items_count}`}
							<br />
							{`Total Non Ready: ${row?.original?.non_ready_items_count}`}
							<br />
							{`Total Sold: ${row?.original?.sold_items_count}`}
						</>
					}
					sx={{ padding: '20px' }}
				>
					{row?.original?.batch_number}
				</Tooltip>
			),
		},
		{
			accessorKey: 'batch_number',
			header: 'Actions',
			size: 300,
			Cell: ({ row }) => (
				<Stack direction={'row'} spacing={2}>
					<Button
						id={row?.original?.id}
						variant='contained'
						// onClick={() => {
						// 	setFileDownLoadId(row?.original?.id);
						// 	setDownloadModal(true);
						// }}
						// disabled={downloading === row?.original?.id}
					>
						{/* {downloading === row?.original?.id ? (
							<Box sx={{ width: '100%' }}>
								<LinearProgressWithLabel value={progress} />
							</Box>
						) : ( */}
						<Download />
						{/* )} */}
					</Button>
				</Stack>
			),
		},
	];
	return (
		<>
			<Grid container>
				<Grid item sm={12}>
					<DataTableHeading title='Sold Items' />
					<ImportFile title='Upload Ready Items File' type='sold' />
					<TableContainer>
						<Grid item container>
							<>
								<Grid item sm={6} display='flex' alignItems='center'>
									<Stack
										direction='row'
										display='flex'
										alignItems='center'
										spacing={0}
									>
										<Typography
											variant='h6'
											component='span'
											sx={{ padding: '24px' }}
										>
											Uploaded Inventory Files
										</Typography>
									</Stack>
								</Grid>

								<Grid
									item
									sm={6}
									sx={{
										display: 'flex',
										justifyContent: 'end',
										alignItems: 'center',
									}}
								>
									<Box sx={{ width: '400px', marginRight: '22px' }}>
										<FormControl fullWidth>
											<InputLabel id='dropdown-label'>Batch No</InputLabel>
											<Select
												labelId='dropdown-label'
												id='dropdown'
												// value={selectedValue}
												label='Select an Option'
												// onChange={handleChange}
												MenuProps={{
													anchorOrigin: {
														vertical: 'bottom',
														horizontal: 'left',
													},
													transformOrigin: {
														vertical: 'top',
														horizontal: 'left',
													},
													getContentAnchorEl: null,
													PaperProps: {
														style: {
															maxHeight: '500px',
														},
													},
												}}
											>
												<MenuItem
													onClick={() => {
														setBatchNumber(null);
														setRefresh(prev => prev + 1);
													}}
												>
													All Files
												</MenuItem>
												<Divider />
												{/* {batchList?.map(row => (
														<MenuItem
															key={row.id}
															value={row?.id}
															onClick={() => {
																setBatchNumber(row?.batch_number);
																setRefresh(prev => prev + 1);
															}}
														>
															{row?.batch_number}
														</MenuItem>
													))} */}
											</Select>
										</FormControl>
									</Box>
								</Grid>
							</>
						</Grid>

						<DataTable
							api={e => getUploadFile(e, bathcNumber)}
							columns={uploadsoldColumns}
							setSelectedRows={setSelectedRows}
							onRowClick={() => {}}
							collapsed={false}
							refresh={refresh}
							manualFilter
						/>
					</TableContainer>
					<Box mt={2}>
						<TableContainer>
							<DataTableExtendedHeader
								onSearchSubmit={handleSearchChange}
								onBatchChange={handleBatchChange}
								type='Sold'
							/>
							<DataTable
								api={e => getSolditems(e, bathcNumber, searchText)}
								columns={intialColumns}
								setSelectedRows={setSelectedRows}
								onRowClick={() => {}}
								// collapsed={viewItem}
								refresh={refresh}
							/>
						</TableContainer>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

export default SoldItems;
