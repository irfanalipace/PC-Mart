import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
	Box,
	IconButton,
	Grid,
	TextField,
	Stack,
	Typography,
	MenuItem,
} from '@mui/material';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import { getNonReadyItems } from '../../../core/api/readyItems';
import InputLabel from '@mui/material/InputLabel';
import { useEffect } from 'react';
import { getBatchNumber } from '../../../core/api/batchNumber';
const ItemsTable = () => {
	const [viewItem, setViewItem] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [searchText, setSearchText] = useState('');
	const [batchList, setBatchList] = useState([]);
	const [bathcNumber, setBatchNumber] = useState(null);

	const handleSearchChange = (e) => {
		e.preventDefault();
		setRefresh((prev) => prev + 1);
	};
	const [selectedValue, setSelectedValue] = useState('');

	const handleChange = (event) => {
		setSelectedValue(event.target.value);
	};
	const navigate = useNavigate();

	const intialColumns = [
		{
			accessorKey: 'file.batch_number',
			header: 'Batch No',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
		{
			accessorKey: 'serial_number',
			header: 'Serial No',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
		{
			accessorKey: 'make',
			header: 'Make',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
		{
			accessorKey: 'model',
			header: 'Model',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
		{
			accessorKey: 'cpu',
			header: 'CPU',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
		{
			accessorKey: 'ram',
			header: 'RAM',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
		{
			accessorKey: 'hdd',
			header: 'HDD',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
		{
			accessorKey: 'price',
			header: 'Price',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
		{
			accessorKey: ' ',
			header: 'ACTIONS',
			enableColumnActions: false,
			enableColumnFilter: false,
			enableColumnOrdering: false,
			enableSorting: false,
			size: 200,
			Cell: ({ row }) => (
				<Box>
					<IconButton variant='outlined'>
						{/* <Delete sx={{ color: 'red' }} fontSize='small' /> */}
					</IconButton>
				</Box>
			),
		},
	];

	useEffect(() => {
		fetchBatchNumbers();
	}, []);
	const fetchBatchNumbers = async () => {
		try {
			const resp = await getBatchNumber();
			setBatchList(resp?.data);
		} catch (err) {}
	};
	return (
		<>
			<Grid container>
				<Grid item sm={viewItem ? 3 : 12}>
					<HeaderPaper sx={{ padding: '10px 20px' }}>
						{selectedRows.length > 0 && (
							<Grid item container>
								<Grid item sm={12}>
									<Grid item container>
										<Grid item sm={6} display='flex' alignItems='center'>
											{/* <Button>Delete</Button> */}
										</Grid>
										<Grid
											item
											sm={6}
											sx={{
												display: 'flex',
												justifyContent: 'end',
												alignItems: 'center',
											}}>
											<IconButton
												onClick={() =>
													viewItem
														? navigate(`/conditions`)
														: setRefresh((prev) => prev + 1)
												}>
												<CloseIcon />
											</IconButton>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						)}
						{selectedRows.length === 0 && (
							<Grid item container>
								<>
									<Grid item sm={6} display='flex' alignItems='center'>
										<Stack
											direction='row'
											display='flex'
											alignItems='center'
											spacing={0}>
											<Typography variant='h6' component='span'>
												Non Ready Items
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
										}}></Grid>
								</>
							</Grid>
						)}
					</HeaderPaper>

					<TableContainer>
						<Box sx={{ padding: '23px' }}>
							<Grid container spacing={2}>
								<Grid item xs={3}>
									<form onSubmit={(e) => handleSearchChange(e)}>
										<TextField
											id='search'
											label='Search'
											variant='outlined'
											fullWidth
											value={searchText}
											onChange={(e) => setSearchText(e.target.value)}
											InputProps={{
												startAdornment: (
													<SearchIcon
														sx={{ color: 'action.active', mr: 1, my: 0.5 }}
													/>
												),
											}}
										/>
									</form>
								</Grid>

								<Grid item xs={2}>
									<FormControl fullWidth>
										<InputLabel id='dropdown-label'>Batch No</InputLabel>
										<Select
											labelId='dropdown-label'
											id='dropdown'
											value={selectedValue}
											label='Select an Option'
											onChange={handleChange}>
											<MenuItem
												onClick={() => {
													setBatchNumber(null);
													setRefresh((prev) => prev + 1);
												}}>
												All Non Ready Items
											</MenuItem>
											{batchList?.map((row) => (
												<MenuItem
													key={row.id}
													value={row?.id}
													onClick={() => {
														setBatchNumber(row?.batch_number);
														setRefresh((prev) => prev + 1);
													}}>
													{row?.batch_number}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						</Box>
						<DataTable
							api={(e) => getNonReadyItems(e, bathcNumber, searchText)}
							columns={intialColumns}
							setSelectedRows={setSelectedRows}
							onRowClick={() => {}}
							manualFilter
							collapsed={viewItem}
							refresh={refresh}
						/>
					</TableContainer>
				</Grid>
			</Grid>
			<ConfirmDialog
				title='Are you sure you want to delete'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				{...dialogProps}
			/>
		</>
	);
};

export default ItemsTable;
