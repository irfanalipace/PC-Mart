/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';

const DataTable = ({
	api, // Function that fetches data from an API.
	extraParams, // Function that fetches data from an API.
	columns, // Array of column configuration objects for the table.
	setSelectedRows, // Callback function to set the selected row IDs.
	onRowClick, // Callback function when a table row is clicked.
	collapsed, //  variable that check if table is collapsed or not
	refresh, // force refetching data
	searchApi, // Function that search data from an API.
	manualFilter = false, // A boolean to enable manual filtering
	enableRowSelection, // conditionaly boolean to disable selection in table,
	showApiError = true, // wheather api errors be shown in datatable or nor
	type,
	...rest
}) => {
	//data and fetching state
	const [data, setData] = useState([]);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [rowCount, setRowCount] = useState(0);
	const [rowSelection, setRowSelection] = useState({});

	//table state
	const [columnFilters, setColumnFilters] = useState([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [isMounted, setIsMounted] = useState(false);
	const [searchString, setSearchString] = useState('');

	const fetchData = async (_params = {}) => {
		setIsLoading(true);
		const params = {
			page: _params?.page || pagination.pageIndex + 1,
			per_page: _params?.per_page || pagination.pageSize,
			...extraParams,
			..._params,
		};
		try {
			const response = await api(params);
			setData(response?.data?.data);

			setRowCount(response?.data?.total);
			setIsMounted(true); // to prevent refetching on first mount
			setIsError(false);
		} catch (error) {
			setIsError(showApiError || false);
			console.error(error);
			setData([]);
		}
		setIsLoading(false);
	};

	const searchData = async globalFilter => {
		setIsLoading(true);
		const params = {
			// page: searchString !== globalFilter ? 1 : pagination.pageIndex + 1,
			// per_page: searchString !== globalFilter ? 10 : pagination.pageSize,
			// search: globalFilter,
			// name: globalFilter,
			column:
				globalFilter?.id === 'file.batch_number'
					? 'batch_number'
					: globalFilter?.id,
			value: globalFilter?.value,
		};
		console.log('abc', columnFilters);
		try {
			if (manualFilter && typeof searchApi === 'function') {
				const response = await searchApi(params);
				setData(response?.data);

				// setPagination(prev => {
				// 	return {
				// 		pageIndex:
				// 			searchString !== globalFilter ? 1 : response.data.current_page,
				// 		pageSize: searchString !== globalFilter ? 10 : response.data.per_page,
				// 	};
				// });
				setRowCount(response?.data.total);
				setIsError(false);
			}
		} catch (error) {
			setIsError(true);
			setIsLoading(false);
			console.error(error);
			// setPagination(prev => {
			// 	return {
			// 		pageIndex: searchString !== globalFilter ? 1 : prev.pageIndex,
			// 		pageSize: searchString !== globalFilter ? 10 : prev.pageSize,
			// 	};
			// });
		}
		setIsLoading(false);
		setSearchString(globalFilter);
	};

	useEffect(() => {
		if (columnFilters?.length > 0) {
			const lastColumnFilter = columnFilters[columnFilters?.length - 1];
			searchData(lastColumnFilter);
			// setColumnFilters([lastColumnFilter]);
			console.log('column Filter', columnFilters);
			// searchData(columnFilters);
			// console.log('global', searchString);
		} else fetchData();
	}, [
		pagination?.pageIndex,
		pagination?.pageSize,
		globalFilter,
		columnFilters,
	]);

	useEffect(() => {
		if (columnFilters?.length > 1) {
			const lastColumnFilter = columnFilters[columnFilters?.length - 1];
			setColumnFilters([lastColumnFilter]);
			console.log('column Filter', columnFilters);
			// searchData(columnFilters);
			// console.log('global', searchString);
		}
	}, [searchString]);

	useEffect(() => {
		if (isMounted) {
			// prevent refetching on first mount
			fetchData();
			setRowSelection({});
		}
	}, [refresh]);

	// useEffect(() => {
	// 	if (globalFilter.length > 0 ) {
	// searchData(globalFilter);
	// 	}
	// 	console.log('manual filtering: ', globalFilter);
	// }, [globalFilter]);

	useEffect(() => {
		const selectedIds = Object.keys(rowSelection);
		if (setSelectedRows === 'function') {
			setSelectedRows(() => selectedIds);
		}
	}, [rowSelection]);

	const onPaginationChange = args => {
		window.scrollTo(0, 0);
		setPagination(args);
	};

	return (
		<MaterialReactTable
			// table={table}
			columns={columns}
			data={data}
			// enableRowSelection={
			// 	typeof enableRowSelection === 'function'
			// 		? enableRowSelection
			// 		: enableRowSelection === false
			// 		? false
			// 		: true
			// }
			// onRowSelectionChange={setRowSelection}
			getRowId={row => row?.id}
			showColumnFilters={true}
			setPagination
			manualPagination
			manualFiltering={
				typeof searchApi === 'function' || manualFilter ? true : false
			}
			enableStickyHeader={true}
			enableFullScreenToggle={false}
			enableColumnActions={true}
			enableDensityToggle={!collapsed}
			enableHiding={true}
			enableFilters={true}
			enableColumnOrdering={true}
			enableColumnFilters={true}
			enableTableHead={!collapsed}
			onColumnFiltersChange={e => {
				setColumnFilters(e);
				e();
				console.log('hello', e);
			}}
			onGlobalFilterChange={setGlobalFilter}
			onPaginationChange={onPaginationChange}
			onSortingChange={setSorting}
			rowCount={rowCount}
			state={{
				columnFilters,
				globalFilter,
				isLoading,
				pagination,
				showAlertBanner: isError,
				showProgressBars: isLoading,
				sorting,
				rowSelection,
				showColumnFilters: true,
				singleFilter: true,
			}}
			muiTableBodyRowProps={({ row }) => ({
				onClick: () => onRowClick(row),
				sx: {
					cursor: 'pointer',
					'& .MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-e3lgss-MuiTableCell-root':
						{
							lineHeight: '2.43',
						},
					'&:hover .show-on-hover': {
						display: 'inline',
					},
				},
			})}
			muiToolbarAlertBannerProps={
				isError
					? {
							color: 'error',
							children: globalFilter ? 'Data Not Found' : 'Error loading data',
					  }
					: undefined
			}
			muiTableBodyProps={
				collapsed
					? {
							sx: {
								'& tr td:first-of-type': { width: '0', minWidth: '0' },
								'& .css-nx5x10-MuiTableRow-root ': {
									// '&:hover':{backgroundColor:'red'},
								},
								'& tr td:nth-of-type(2)': {
									paddingLeft: '0',
									paddingTop: '10px',
									paddingBottom: '10px',
								},
							},
					  }
					: undefined
			}
			muiTopToolbarProps={
				collapsed
					? {
							sx: { display: 'none' },
					  }
					: undefined
			}
			muiTablePaginationProps={
				collapsed
					? {
							sx: {
								'&  .MuiTablePagination-toolbar': {
									paddingLeft: '0',
								},
								'&  .MuiTablePagination-actions': {
									marginLeft: '4px',
								},
							},
					  }
					: undefined
			}
			muiTableProps={
				!collapsed
					? {
							sx: {
								'&.MuiTable-root': {
									paddingBottom: '10px',
								},
							},
					  }
					: undefined
			}
			muiTableContainerProps={
				!collapsed
					? {
							sx: {
								// height: 'calc(100vh - 280px)',
								overflow: 'auto',
								'&::-webkit-scrollbar': {
									height: '7px',
								},
							},
					  }
					: undefined
			}
			{...rest}
		/>
	);
};

export default DataTable;
