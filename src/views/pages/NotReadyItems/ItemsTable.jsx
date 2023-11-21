import { useState } from 'react';
import { Grid } from '@mui/material';
import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import { getNonReadyItems } from '../../../core/api/readyItems';
import DataTableHeading from '../../Components/DataTable/DataTableHeading';
import DataTableExtendedHeader from '../../Components/DataTable/DataTableExtendedHeader';
const ItemsTable = () => {
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
						<DataTableExtendedHeader
							onSearchSubmit={handleSearchChange}
							onBatchChange={handleBatchChange}
						/>
						<DataTable
							api={e => getNonReadyItems(e, bathcNumber, searchText)}
							columns={intialColumns}
							setSelectedRows={setSelectedRows}
							onRowClick={() => {}}
							manualFilter
							collapsed={false}
							refresh={refresh}
						/>
					</TableContainer>
				</Grid>
			</Grid>
		</>
	);
};

export default ItemsTable;
