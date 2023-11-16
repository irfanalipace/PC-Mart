import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import {
	Box,
	IconButton,
	Grid,
	TextField,
	Stack,
	Typography,
	MenuItem,
} from '@mui/material';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import CloseIcon from '@mui/icons-material/Close';

import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import { getReadyItems } from '../../../core/api/readyItems';
import { getBatchNumber } from '../../../core/api/batchNumber';

const ReadyItemsTable = () => {
	const [refresh, setRefresh] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [selectedValue, setSelectedValue] = useState('');
	const [searchText, setSearchText] = useState('');
	const [batchList, setBatchList] = useState([]);
	const [bathcNumber, setBatchNumber] = useState(null);

	const handleSearchChange = (e) => {
		e.preventDefault();
		setRefresh((prev) => prev + 1);
	};

	const handleChange = (event) => {
		setSelectedValue(event.target.value);
	};
	const navigate = useNavigate();

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
					<IconButton variant='outlined'></IconButton>
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
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<>
			<Grid container>
				<Grid item sm={12}>
					<HeaderPaper sx={{ padding: '10px 20px' }}>
						{selectedRows?.length > 0 && (
							<Grid item container>
								<Grid item sm={12}>
									<Grid item container>
										<Grid item sm={6} display='flex' alignItems='center'></Grid>
										<Grid
											item
											sm={6}
											sx={{
												display: 'flex',
												justifyContent: 'end',
												alignItems: 'center',
											}}>
											<IconButton
												onClick={() => setRefresh((prev) => prev + 1)}>
												<CloseIcon />
											</IconButton>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						)}
						{selectedRows?.length === 0 && (
							<Grid item container>
								<>
									<Grid item sm={6} display='flex' alignItems='center'>
										<Stack
											direction='row'
											display='flex'
											alignItems='center'
											spacing={0}>
											<Typography variant='h6' component='span'>
												Ready Items
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
											label='Batch No'
											value={selectedValue}
											onChange={handleChange}>
											<MenuItem
												onClick={() => {
													setBatchNumber(null);
													setRefresh((prev) => prev + 1);
												}}>
												All Ready Items
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

									{/* <FormControl fullWidth>
										<InputLabel id='demo-simple-select-label'>Age</InputLabel>
										<Select
											labelId='demo-simple-select-label'
											id='demo-simple-select'
											value={selectedValue}
											label='Age'
											onChange={handleChange}>
											<MenuItem value={10}>Ten</MenuItem>
											<MenuItem value={20}>Twenty</MenuItem>
											<MenuItem value={30}>Thirty</MenuItem>
										</Select>
									</FormControl> */}
								</Grid>
							</Grid>
						</Box>

						<DataTable
							api={(e) => getReadyItems(e, bathcNumber, searchText)}
							columns={intialColumns}
							setSelectedRows={setSelectedRows}
							onRowClick={() => {}}
							collapsed={false}
							manualFilter
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

export default ReadyItemsTable;
