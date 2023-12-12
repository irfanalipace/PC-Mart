import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import DataTable from '../../../views/Components/DataTable/DataTable';
import TableContainer from '../../../views/Components/Containers/TableContainer';
import { getNonReadyItems } from '../../../core/api/readyItems';
('../../../views/Components');
import DataTableHeading from '../../../views/Components/DataTable/DataTableHeading';
import DataTableExtendedHeader from '../../../views/Components/DataTable/DataTableExtendedHeader';
import { getBatchNumber } from '../../../core/api/batchNumber';
import { SearchData } from '../../../core/api/fileupload';

const ItemsTable = () => {
	const [refresh, setRefresh] = useState(0);
	const [searchText, setSearchText] = useState('');
	const [bathcNumber, setBatchNumber] = useState(null);
	const [batchList, setBatchList] = useState([]);

	const handleSearchChange = serchValue => {
		setSearchText(serchValue);
		setRefresh(prev => prev + 1);
	};

	const handleBatchChange = e => {
		setBatchNumber(e.target.value);
		setRefresh(prev => prev + 1);
	};

	useEffect(() => {
		fetchBatchNumbers();
	}, []);

	const fetchBatchNumbers = async () => {
		try {
			const resp = await getBatchNumber('all');
			setBatchList(resp?.data.map(row => row?.batch_number));
		} catch (err) {
			console.error(err);
		}
	};

	const intialColumns = [
		{
			accessorKey: 'file.batch_number',
			filterFn: 'equals',
			header: 'Batch No',
			filterVariant: 'select',
			filterSelectOptions: batchList,
			//      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
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

	return (
		<>
			<Grid container>
				<Grid item sm={12}>
					<DataTableHeading title='Non Ready Items' />

					<TableContainer>
						{/* <DataTableExtendedHeader
							onSearchSubmit={handleSearchChange}
							onBatchChange={handleBatchChange}
							type='Non Ready'
						/> */}
						<DataTable
							api={e => getNonReadyItems(e, bathcNumber, searchText)}
							columns={intialColumns}
							// setSelectedRows={setSelectedRows}
							onRowClick={() => {}}
							manualFilter
							collapsed={false}
							refresh={refresh}
							searchApi={e => SearchData(e, 'items', 'non_ready')}
						/>
					</TableContainer>
				</Grid>
			</Grid>
		</>
	);
};

export default ItemsTable;
