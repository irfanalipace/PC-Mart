import { useEffect, useState } from 'react';
import TableCell from '@mui/material/TableCell';

import notyf from '../../Components/NotificationMessage/notyfInstance';
import {
	Box,
	Grid,
	Stack,
	Typography,
	MenuItem,
	Button,
	CircularProgress,
	Tooltip,
} from '@mui/material';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import { Download } from '@mui/icons-material';
import {
	DownloadSingleFile,
	convertNotReadyItemsToReady,
	getUploadFile,
} from '../../../core/api/fileupload';
import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import MUIButton from '../../Components/Button/MUIButton';
import { importItemsFile } from '../../../core/api/readyItems';
import { getBatchNumber } from '../../../core/api/batchNumber';
import {
	downloadFile,
	formatDateToYYYYMMDD,
} from '../../../core/utils/helpers';
import LinearProgressWithLabel from '../../Components/Progress/Progress.jsx';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog.jsx';

const FileUploadTable = () => {
	const [progress, setProgress] = useState(10);

	const [loading, setLoading] = useState(false);
	const [downloading, setDownloading] = useState(null);
	const [refresh, setRefresh] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	const [selectedValue, setSelectedValue] = useState('');
	const [file, setFile] = useState(null);
	const [batchList, setBatchList] = useState([]);
	const [fileName, setFileName] = useState('');
	const [bathcNumber, setBatchNumber] = useState(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [convertLoaidng, setconvertLoading] = useState('');

	const handleChange = event => {
		setSelectedValue(event.target.value);
	};

	const handleFileUpload = event => {
		const file = event.target.files[0];
		setFile(file);
		const reader = new FileReader();
		setFileName(file?.name);
		reader.onloadend = () => {};
	};

	const FileDownload = async id => {
		try {
			setDownloading(id);
			for (let i = 0; i <= 100; i += 10) {
				await new Promise(resolve => setTimeout(resolve, 1));
				setProgress(i);
				if (i === 100) {
					const resp = await DownloadSingleFile(id);
					downloadFile(resp?.data?.route);
				}
			}
		} catch (err) {
			console.log(err);
		} finally {
			setDownloading(null);
		}
	};

	const intialColumns = [
		{
			accessorKey: 'name',
			header: 'File Name',
		},
		{
			accessorKey: 'uploaded_date_time',
			header: 'Upload Date, Time',
			Cell: ({ renderedCellValue }) => (
				<>{formatDateToYYYYMMDD(renderedCellValue)}</>
			),
		},

		{
			accessorKey: 'status',
			header: 'Status',
			Cell: ({ row }) => (
				<TableCell
					style={{
						color: getColorForStatus(row.original.status),
						border: 'none',
						background: 'none',
					}}
				>
					<Typography sx={{ textTransform: 'capitalize' }}>
						{row.original.status}
					</Typography>
				</TableCell>
			),
		},
		{
			accessorKey: 'batch_number',
			header: 'Batch No',
			Cell: ({ row }) => (
				<Tooltip
					title={
						<>
							{`Total Ready: ${row?.original?.ready_items_count}`}
							<br />
							{`Total Non Ready: ${row?.original?.non_ready_items_count}`}
							<br />
							{`Total Sold: ${row?.original?.sold_items_count}`}
						</>
					}
					sx={{ padding: '20px' }}
				>
					{row?.original?.batch_number}
				</Tooltip>
			),
		},
		{
			accessorKey: 'batch_number',
			header: 'ACTIONS',
			size: 300,
			Cell: ({ row }) => (
				<Stack direction={'row'} spacing={2}>
					<Button
						id={row?.original?.id}
						variant='contained'
						onClick={() => FileDownload(row?.original?.id)}
						disabled={downloading === row?.original?.id}
					>
						{downloading === row?.original?.id ? (
							<Box sx={{ width: '100%' }}>
								<LinearProgressWithLabel value={progress} />
							</Box>
						) : (
							<Download />
						)}
					</Button>
					{(row?.original?.non_ready_items_count > 0 ||
						row?.original?.ready_items_count > 0) && (
						<Button
							sx={{ width: '170px' }}
							variant='contained'
							onClick={() => {
								setOpenConfirmDialog(true);
								setDialogProps({
									onConfirm: () => handleFileConvert(row?.original?.id),
								});
							}}
							disabled={convertLoaidng === row?.original?.id}
						>
							{convertLoaidng === row?.original?.id ? (
								<CircularProgress size={20} />
							) : (
								'Convert to Sold'
							)}
						</Button>
					)}
				</Stack>
			),
		},
	];

	const getColorForStatus = status => {
		switch (status) {
			case 'error':
				return 'red';
			case 'pending':
				return '#ED6C02';
			case 'processing':
				return '#2196F3';
			case 'processed':
				return '#2E7D32';
			default:
				return 'black'; // or any default color
		}
	};

	const importFile = async () => {
		try {
			setLoading(true);
			await importItemsFile(file);
			setRefresh(prev => prev + 1);
			notyf.success('File Imported Successfully');
		} catch (err) {
			console.log(err);
			notyf.error(err?.data?.message);
		} finally {
			setLoading(false);
			setFile(null);
			setFileName('');
		}
	};

	useEffect(() => {
		fetchBatchNumbers();
	}, []);

	const fetchBatchNumbers = async () => {
		try {
			const resp = await getBatchNumber();
			setBatchList(resp?.data);
		} catch (e) {
			console.error(e);
		}
	};

	const downloadSample = async () => {
		try {
			const url = import.meta.env.VITE_API_BASE_URL + '/sample-download';
			const modifiedUrl = url.replace('/api/', '/');
			window.open(modifiedUrl);
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		// return () => {
		//   clearInterval(timer);
		// };
	}, []);

	const handleFileConvert = async id => {
		try {
			setconvertLoading(id);
			const res = await convertNotReadyItemsToReady(id);
			if (res.success) {
				notyf.success(res?.message);
			} else {
				notyf.error(res?.message || 'Somthing went wrong');
			}
		} catch (error) {
			console.log(error);
			notyf.error('Failed to convert item to ready state.');
		} finally {
			setconvertLoading('');
		}
	};
	return (
		<>
			<Grid container>
				<Grid item sm={12}>
					<HeaderPaper sx={{ padding: '10px 20px' }}>
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
											Upload Inventory File
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
									<Box sx={{ margin: '5px' }}>
										<MUIButton
											sx={{ padding: '10px' }}
											onClick={() => downloadSample()}
										>
											<Download />
											&ensp;Download Sample
										</MUIButton>
									</Box>
								</Grid>
							</>
							<Grid
								item
								sm={6}
								sx={{
									display: 'flex',
									justifyContent: 'end',
									alignItems: 'center',
								}}
							></Grid>

							<Grid
								item
								sm={12}
								direction='row'
								display='flex'
								alignItems='center'
								spacing={0}
							>
								<Stack sx={{ marginTop: '22px' }}>
									<label htmlFor='upload-image'>
										<Button
											variant=''
											component='span'
											sx={{ border: '1px solid #1976d2', color: '#1976d2' }}
										>
											CHOOSE FILE
										</Button>
										<input
											id='upload-image'
											hidden
											accept='/*'
											type='file'
											onChange={handleFileUpload}
										/>
										&ensp;
										{fileName && <>{fileName}</>}
									</label>
								</Stack>
							</Grid>
							<Grid
								item
								sm={12}
								direction='row'
								display='flex'
								alignItems='center'
								spacing={0}
							>
								<Stack sx={{ marginTop: '22px', marginBottom: '12px' }}>
									<Button
										variant='contained'
										onClick={importFile}
										disabled={!file || loading}
									>
										{loading ? <CircularProgress size={25} /> : 'IMPORT FILE'}
									</Button>
								</Stack>
							</Grid>
						</Grid>
					</HeaderPaper>
					<TableContainer>
						<Grid item container>
							<>
								<Grid item sm={6} display='flex' alignItems='center'>
									<Stack
										direction='row'
										display='flex'
										alignItems='center'
										spacing={0}
									>
										<Typography
											variant='h6'
											component='span'
											sx={{ padding: '24px' }}
										>
											Uploaded Inventory Files
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
									<Box sx={{ width: '400px', marginRight: '22px' }}>
										<FormControl fullWidth>
											<InputLabel id='dropdown-label'>Batch No</InputLabel>
											<Select
												labelId='dropdown-label'
												id='dropdown'
												value={selectedValue}
												label='Select an Option'
												onChange={handleChange}
											>
												<MenuItem
													onClick={() => {
														setBatchNumber(null);
														setRefresh(prev => prev + 1);
													}}
												>
													All Files
												</MenuItem>
												{batchList?.map(row => (
													<MenuItem
														key={row.id}
														value={row?.id}
														onClick={() => {
															setBatchNumber(row?.batch_number);
															setRefresh(prev => prev + 1);
														}}
													>
														{row?.batch_number}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Box>
								</Grid>
							</>
						</Grid>

						<DataTable
							api={e => getUploadFile(e, bathcNumber)}
							columns={intialColumns}
							setSelectedRows={setSelectedRows}
							onRowClick={() => {}}
							collapsed={false}
							refresh={refresh}
							manualFilter
						/>
					</TableContainer>
				</Grid>
			</Grid>
			<ConfirmDialog
				title='Are you sure you want to convert all items to Sold State'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				{...dialogProps}
			/>
		</>
	);
};

export default FileUploadTable;
