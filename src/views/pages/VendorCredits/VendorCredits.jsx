import { Box, Grid, Stack, Typography } from '@mui/material';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import MUIButton from '../../Components/Button/MUIButton';
import { TableContainer } from '../../Components/Table/Table';
import DetailViewContainer from '../../Components/Containers/DetailViewContainer';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import MoreOpt from '../../Components/MoreOpt/MoreOpt';
import { SaveAlt, UploadFile } from '@mui/icons-material';
import DataTable from '../../Components/DataTable/DataTable';
import { getAllVendorCredits } from '../../../core/api/vendorcredits';
import {
	// EstimateStatusColor,
	extractNumberFromHash,
	formatDate,
	generateEncryptedID,
} from '../../../core/utils/helpers';
import useHash from '../../../core/hooks/useHash';
import ViewVendorCredits from './ViewVendorCredits';

const VendorCredits = () => {
	const intialColumns = [
		{
			accessorKey: 'created_at',
			header: 'Date',
		},
		{
			accessorKey: 'vendor_credit',
			header: 'Vendor Credit',
		},
		{
			header: 'RMA No.',
			accessorKey: 'rma_number',
		},
		{
			accessorKey: 'name',
			header: 'Vendor Name',
		},
		{
			accessorKey: 'status',
			header: 'Status',
			Cell: ({ renderedCellValue }) => {
				// const estStatusColor = EstimateStatusColor(renderedCellValue);
				return (
					<Typography
						variant='caption'
						// sx={{ color: estStatusColor }}
						fontWeight={500}
						fontSize={11}
					>
						{renderedCellValue?.toUpperCase()}
					</Typography>
				);
			},
		},
		{
			accessorKey: 'bill',
			header: 'Bill#',
		},
		{
			accessorKey: 'amount',
			header: 'Amount',
		},
		{
			accessorKey: 'balance',
			header: 'Balance',
		},
	];
	const [viewVendorCredits, setViewVendorCredits] = useState(false);
	const [refresh, setRefresh] = useState();
	const [hash, setHash] = useHash();
	const [id, setId] = useState(null);
	const [columns, setColumns] = useState(intialColumns);
	const navigate = useNavigate();
	const moreList = [
		{
			name: 'Import Vendor Creidts',
			icon: <SaveAlt sx={{ color: '#2196F3' }} />,
			onClick: () => console.log('import'),
		},
		{
			name: 'Export Vendor Creidts',
			icon: <UploadFile sx={{ color: '#2196F3' }} />,
			onClick: () => console.log('export'),
		},
	];

	const handleRowClick = row => {
		setHash('#/' + generateEncryptedID(row?.id));
	};

	const collapsedColumns = [
		{
			accessorKey: 'customer',
			header: 'Company Name',
			Cell: ({ row }) => {
				const estStatusColor =
					//  EstimateStatusColor(
					row?.original?.status;
				// );
				return (
					<Box>
						<Grid container sx={{ justifyContent: 'space-between' }}>
							<Grid item x={6}>
								<Typography variant='subtitle2' sx={{ color: '#2196F3' }}>
									{row?.original?.name}
								</Typography>
								<Typography component='span' fontSize={12}>
									{row?.original?.vendor_credit} |{' '}
									{formatDate(row?.original?.created_at)}
								</Typography>
							</Grid>
							<Grid item x={6} sx={{ textAlign: 'right' }}>
								<Typography sx={{ fontSize: '12px' }} variant='subtitle1'>
									${row?.original?.balance || 0}
								</Typography>
								<Typography
									variant='caption'
									sx={{ color: estStatusColor }}
									fontWeight={500}
									fontSize={11}
								>
									{row?.original?.status?.toUpperCase()}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				);
			},
		},
	];
	useEffect(() => {
		const id = extractNumberFromHash(hash);
		setId(id);
		if (id) {
			setColumns(collapsedColumns);
			setViewVendorCredits(true);
		} else {
			setColumns(intialColumns);
			setViewVendorCredits(false);
		}
	}, [hash]);
	return (
		<>
			<Grid container>
				<Grid item sm={viewVendorCredits ? 3 : 12}>
					<HeaderPaper sx={{ padding: '10px 20px' }}>
						<Grid item container>
							<>
								<Grid sm={6} display='flex' alignItems='center'>
									<Stack
										direction='row'
										display='flex'
										alignItems='center'
										spacing={0}
									>
										<Typography
											variant='h6'
											component='span'
											fontSize={viewVendorCredits && 15}
										>
											All Vendor Credits
										</Typography>
									</Stack>
								</Grid>
								<Grid
									sm={6}
									display='flex'
									justifyContent='end'
									alignItems='center'
									spacing={2}
								>
									<MUIButton
										size='medium'
										onClick={() => navigate('/vendor-credits/new')}
										variant='contained'
									>
										<Add fontSize='small' />
										New
									</MUIButton>{' '}
									<MoreOpt moreList={moreList} />
								</Grid>
							</>
						</Grid>
					</HeaderPaper>

					<TableContainer>
						<DataTable
							api={getAllVendorCredits}
							columns={columns}
							setSelectedRows={() => {}}
							onRowClick={handleRowClick}
							collapsed={viewVendorCredits}
							refresh={refresh}
							manualFilter
						/>
					</TableContainer>
				</Grid>
				{viewVendorCredits && (
					<Grid item sm={8.9} sx={{ marginLeft: '10px' }}>
						<DetailViewContainer>
							<ViewVendorCredits />
						</DetailViewContainer>
					</Grid>
				)}
			</Grid>
		</>
	);
};

export default VendorCredits;
