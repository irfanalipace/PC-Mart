import { useState } from 'react';
import { Grid } from '@mui/material';
import DataTable from 'comp/DataTable/DataTable';
import TableContainer from 'comp/Containers/TableContainer';
import { getSolditems } from 'core/api/readyItems';
import DataTableHeading from 'comp/DataTable/DataTableHeading';
import DataTableExtendedHeader from 'comp/DataTable/DataTableExtendedHeader';
import FileUploadTable from '../FileUpload/FileUploadTable';

const SoldItems = () => {
	const [refresh, setRefresh] = useState(0);
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
					<DataTableHeading title='Sold Items' />

					<FileUploadTable
						sx={{ my: 3 }}
						importFileHeading='Upload Sold Items File'
						type='sold'
					/>
					<TableContainer>
						<DataTableExtendedHeader
							onSearchSubmit={handleSearchChange}
							onBatchChange={handleBatchChange}
							type='Sold'
						/>

						<DataTable
							api={e => getSolditems(e, bathcNumber, searchText)}
							columns={intialColumns}
							onRowClick={() => {}}
							refresh={refresh}
						/>
					</TableContainer>
				</Grid>
			</Grid>
		</>
	);
};

export default SoldItems;
