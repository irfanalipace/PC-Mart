import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import { getReadyItems } from '../../../core/api/readyItems';
import DataTableHeading from '../../Components/DataTable/DataTableHeading';
import DataTableExtendedHeader from '../../Components/DataTable/DataTableExtendedHeader';
import { getBatchNumber } from '../../../core/api/batchNumber';
import { SearchData } from '../../../core/api/fileupload';

const ReadyItemsTable = () => {
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
			header: 'Batch No',
			filterFn: 'equals',
			filterVariant: 'select',
			filterSelectOptions: batchList,
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
					{/* here */}
					<DataTableHeading title='Ready Items' />
					<TableContainer>
						{/* <DataTableExtendedHeader
							onSearchSubmit={handleSearchChange}
							onBatchChange={handleBatchChange}
							type='Ready'
						/> */}

						<DataTable
							api={e => getReadyItems(e, bathcNumber, searchText)}
							columns={intialColumns}
							onRowClick={() => {}}
							refresh={refresh}
							manualFilter
							searchApi={e => SearchData(e, 'items', 'ready')}
						/>
					</TableContainer>
				</Grid>
			</Grid>
		</>
	);
};

export default ReadyItemsTable;
