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

	useEffect(() => {
		fetchBatchNumbers();
	}, [refresh]);

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
					<TableContainer>
						<DataTableHeading title='Sold Items' />
						<DataTable
							api={e => getSolditems(e, bathcNumber, searchText)}
							columns={intialColumns}
							onRowClick={() => {}}
							refresh={refresh}
							manualFilter
							searchApi={e => SearchData(e, 'items', 'sold')}
						/>
					</TableContainer>
					<FileUploadTable
						sx={{ my: 3 }}
						importFileHeading='Uploaded Sold File Items.'
						type='sold'
						refreshOtherTable={() => setRefresh(prev => prev + 1)}
					/>
				</Grid>
			</Grid>
		</>
	);
};

export default SoldItems;
