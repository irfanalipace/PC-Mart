import React, { useEffect, useState } from 'react';

import notyf from '../../Components/NotificationMessage/notyfInstance';
import {
	Box,
	IconButton,
	Grid,
	Stack,
	Typography,
	Menu,
	MenuItem,
	TextField,
    Button,
} from '@mui/material';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import { Add, Edit, Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useNavigate } from 'react-router-dom';
import { getCondition, deleteCondition } from '../../../core/api/condition';
import { extractNumberFromHash,generateEncryptedID, } from '../../../core/utils/helpers';
import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import MUIButton from '../../Components/Button/MUIButton';
import { styled } from '@mui/material/styles';
import { getNonReadyItems } from '../../../core/api/nonreadyitems';
import SearchIcon from '@mui/icons-material/Search';
import SearchBar from '../../Components/SearchBar/SearchBar';
const CustomMUIButton = styled(MUIButton)(({ theme, viewItem }) => ({
	fontSize: viewItem ? '0.75rem' : '1rem',
	width: viewItem ? '55%' : '70%',
	height: viewItem ? '30px' : '35px',
	padding: '8px 16px',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
}));




const ReadyItemsTable = () => {
	const [id, setId] = useState(null);
	const [viewItem, setViewItem] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [anchorE2, setAnchorE2] = React.useState(null);
	const [selectedValue, setSelectedValue] = useState('');
	const [searchText, setSearchText] = useState('');

	const handleSearchChange = (event) => {
	  setSearchText(event.target.value);
	  // Add any additional logic you need based on the search text
	};
	const handleChange = (event) => {
	  setSelectedValue(event.target.value);
	};
	const navigate = useNavigate();

	

	const intialColumns = [
		{
			accessorKey: 'make',
			header: 'Batch No',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
        {
			accessorKey: 'serial_number',
			header: 'Serial No',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
        {
			accessorKey: 'type',
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
			header: 'Cost',
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
					<IconButton
						variant='outlined'
						// onClick={e => {
						// 	e.stopPropagation();
						// 	setOpenConfirmDialog(true);
						// 	setDialogProps({
						// 		onConfirm: handleDelete,
						// 		onConfirmParams: row.original.id,
						// 	});
						// }}
					>
						{/* <Delete sx={{ color: 'red' }} fontSize='small' /> */}
					</IconButton>
					{/* <IconButton
						onClick={e => handleEditModal(e, row?.original.id)}
						variant='outlined'
					>
						<Edit fontSize='small' color='primary' />
					</IconButton> */}
				</Box>
			),
		},
	];
	const handleDelete = async Id => {
		try {
			await deleteCondition(Id);
			setRefresh(prev => prev + 1);
			notyf.success('conditions Item deleted');
		} catch (error) {
			console.log('error', error);
		}
	};
	const handleEditModal = (e, id) => {
		e.stopPropagation(); // Stop the event from propagating
		navigate(`/conditions/edit/${generateEncryptedID(id)}`);
	};
	const [columns, setColumns] = useState(intialColumns);

	const collapsedColumns = [
		{
			accessorKey: 'name',
			header: 'Name',
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
		},
	];


	const goBack = () => {
		navigate('/conditions');
	};


	// bulk menu oprn close
	const open = Boolean(anchorEl);
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	// tansaction menu
	const tansactionOpen = Boolean(anchorE2);
	const handleTransactions = event => {
		setAnchorE2(event.currentTarget);
	};
	const closeTransactions = () => {
		setAnchorE2(null);
	};

	// const changingStatus = async status => {
	// 	try {
	// 		await BulkUpdateStatusMarketplace({ ids: selectedRows, action: status });
	// 		notyf.success('Status Updated Successfully');
	// 		setRefresh(prev => prev + 1);
	// 	} catch (error) {
	// 		console.log('error', error);
	// 	}
	// };

	// const handleBulkDelete = async () => {
	// 	try {
	// 		await bulkdeleteCondition({ ids: selectedRows });
	// 		setRefresh(prev => prev + 1);
	// 	} catch (err) {
	// 		console.log('err', err);
	// 	}
	// };

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
											}}
										>
                                          
                                            <IconButton
											
												onClick={() =>
													viewItem
														? navigate(`/conditions`)
														: setRefresh(prev => prev + 1)
												}
											>
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
											spacing={0}
										>
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
										}}
									>
										{/* {viewItem ? (
											<IconButton onClick={goBack}>
												<CloseIcon />
											</IconButton>
										) : (
											<MUIButton
												size='medium'
												onClick={() => navigate('/conditions/new')}
												variant='contained'
											>
												<Add fontSize='small' />
												New
											</MUIButton>
										)} */}
									</Grid>
								</>
							</Grid>
						)}
					</HeaderPaper>
					<TableContainer>
					<Box sx={{padding:'23px'}}>
      <Grid container spacing={2}>
	  <Grid item xs={3}>
          <TextField
            id="search"
            label="Search"
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              ),
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="dropdown-label">Batch No</InputLabel>
            <Select
              labelId="dropdown-label"
              id="dropdown"
              value={selectedValue}
              label="Select an Option"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
              <MenuItem value="option3">Option 3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
	
      </Grid>
    </Box>

	
					
						<DataTable
							api={getNonReadyItems}
							columns={columns}
							setSelectedRows={setSelectedRows}
							onRowClick={() => {}}
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

// const headerIconButton = {
// 	backgroundColor: '#EEEEEE',
// 	border: '1px solid #d1d1d1',
// 	borderRadius: '4px',
// 	textTransform: 'none',
// };

export default ReadyItemsTable;
