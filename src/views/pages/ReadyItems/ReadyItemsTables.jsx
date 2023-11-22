import { useState } from 'react';
import { Grid } from '@mui/material';

import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import { getReadyItems } from '../../../core/api/readyItems';
import DataTableHeading from '../../Components/DataTable/DataTableHeading';
import DataTableExtendedHeader from '../../Components/DataTable/DataTableExtendedHeader';

const ReadyItemsTable = () => {
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

	return (
		<>
			<Grid container>
				<Grid item sm={12}>
					{/* here */}
					<DataTableHeading title='Ready Items' />
					<TableContainer>
						<DataTableExtendedHeader
							onSearchSubmit={handleSearchChange}
							onBatchChange={handleBatchChange}
							type='Ready'
						/>

						<DataTable
							api={e => getReadyItems(e, bathcNumber, searchText)}
							columns={intialColumns}
							setSelectedRows={setSelectedRows}
							onRowClick={() => {}}
							// collapsed={viewItem}
							refresh={refresh}
						/>
					</TableContainer>
				</Grid>
			</Grid>
		</>
	);
};

export default ReadyItemsTable;
