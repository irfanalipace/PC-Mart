import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import { getSolditems } from '../../../core/api/readyItems';
import DataTableHeading from '../../Components/DataTable/DataTableHeading';
import DataTableExtendedHeader from '../../Components/DataTable/DataTableExtendedHeader';
import FileUploadTable from '../FileUpload/FileUploadTable';
import { getBatchNumber } from '../../../core/api/batchNumber';
import { SearchData } from '../../../core/api/fileupload';

const SoldItems = () => {
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
			const resp = await getBatchNumber('sold');
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
					<DataTableHeading title='Sold Items' />

					<FileUploadTable
						sx={{ my: 3 }}
						importFileHeading='Upload Sold Items File'
						type='sold'
					/>
					<TableContainer>
						{/* <DataTableExtendedHeader
							onSearchSubmit={handleSearchChange}
							onBatchChange={handleBatchChange}
							type='Sold'
						/> */}

						<DataTable
							api={e => getSolditems(e, bathcNumber, searchText)}
							columns={intialColumns}
							onRowClick={() => {}}
							refresh={refresh}
							manualFilter
							searchApi={e => SearchData(e, 'items', 'sold')}
						/>
					</TableContainer>
				</Grid>
			</Grid>
		</>
	);
};

export default SoldItems;
