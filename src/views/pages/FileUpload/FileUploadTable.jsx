import { useEffect, useState } from 'react';
import TableCell from '@mui/material/TableCell';

import notyf from '../../Components/NotificationMessage/notyfInstance';
import OverlayLoader from '../../Components/OverlayLoader/OverlayLoader.jsx';
import {
	Box,
	Grid,
	Stack,
	Typography,
	MenuItem,
	Button,
	CircularProgress,
	Tooltip,
	Divider,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { Download } from '@mui/icons-material';
import {
	DownloadSingleFile,
	convertNotReadyItemsToReady,
	getFileUploadError,
	getUploadFile,
} from '../../../core/api/fileupload';
import DataTable from '../../Components/DataTable/DataTable';
import TableContainer from '../../Components/Containers/TableContainer';
import { getBatchNumber } from '../../../core/api/batchNumber';
import {
	downloadFile,
	formatDateToYYYYMMDD,
} from '../../../core/utils/helpers';
import LinearProgressWithLabel from '../../Components/Progress/Progress.jsx';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog.jsx';
import Modal from '../../Components/Modal/Dialog.jsx';
import ImportFile from '../../Components/ImportFile/index.jsx';

const FileUploadTable = () => {
	const [progress, setProgress] = useState(10);
	const [errorModal, setErrorModal] = useState(false);

	const [errorloading, setErrorLoading] = useState(false);
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
	const [errorData, setErrorData] = useState('');
	const [downloadModal, setDownloadModal] = useState(false);
	const [fileDownloadId, setFileDownLoadId] = useState(null);

	const handleRadioButton = e => {
		console.log(e.target.value);
	};

	const handleChange = event => {
		setSelectedValue(event.target.value);
	};

	const handleStatusClick = async row => {
		if (row.original.status === 'error') {
			setErrorLoading(true);
			const res = await getFileUploadError(row.original.id);
			setErrorData(res?.data);
			setErrorLoading(false);
			setErrorModal(true);
		}
	};

	const FileDownload = async () => {
		try {
			setDownloadModal(false);
			setDownloading(fileDownloadId);
			for (let i = 0; i <= 100; i += 10) {
				await new Promise(resolve => setTimeout(resolve, 1));
				setProgress(i);
				if (i === 100) {
					const resp = await DownloadSingleFile(fileDownloadId);
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
			size: 100,
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
					onClick={() => handleStatusClick(row)}
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
			header: 'Actions',
			size: 300,
			Cell: ({ row }) => (
				<Stack direction={'row'} spacing={2}>
					<Button
						id={row?.original?.id}
						variant='contained'
						onClick={() => {
							setFileDownLoadId(row?.original?.id);
							setDownloadModal(true);
						}}
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

	useEffect(() => {
		fetchBatchNumbers();
	}, [refresh]);

	const fetchBatchNumbers = async () => {
		try {
			const resp = await getBatchNumber();
			setBatchList(resp?.data);
		} catch (e) {
			console.error(e);
		}
	};

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
			setRefresh(prev => prev + 1);
		}
	};
	return (
		<>
			<Grid container>
				<Grid item sm={12}>
					{/* here */}
					<ImportFile title='Upload Inventory File' setRefresh={setRefresh} />
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
												MenuProps={{
													anchorOrigin: {
														vertical: 'bottom',
														horizontal: 'left',
													},
													transformOrigin: {
														vertical: 'top',
														horizontal: 'left',
													},
													getContentAnchorEl: null,
													PaperProps: {
														style: {
															maxHeight: '500px',
														},
													},
												}}
											>
												<MenuItem
													onClick={() => {
														setBatchNumber(null);
														setRefresh(prev => prev + 1);
													}}
												>
													All Files
												</MenuItem>
												<Divider />
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
			<Modal
				open={errorModal}
				title='Error Found'
				onClose={() => setErrorModal(false)}
			>
				<Box mb={5} mt={2}>
					{errorData &&
						errorData?.map((item, index) => {
							return (
								<Box sx={{ pl: 2.7, mt: 1 }} key={index}>
									{item?.errors?.map((error, index) => {
										return (
											<Stack key={index} direction={'row'} spacing={1}>
												<Typography sx={{ color: '#E0E0E0' }} as='li'>
													<span style={{ color: '#D32F2F' }}>
														{`${error.replace(/\.$/, '')} at row ${item.row}`}
													</span>
												</Typography>
											</Stack>
										);
									})}
								</Box>
							);
						})}
				</Box>
			</Modal>
			<Modal
				open={downloadModal}
				title='Downalod'
				onClose={() => setDownloadModal(false)}
			>
				<Box mb={5} mt={2} ml={3}>
					<FormControl sx={{ width: '100%' }}>
						<FormLabel id='demo-row-radio-buttons-group-label'>
							What do you want to download?
						</FormLabel>
						<RadioGroup
							defaultValue={'all'}
							sx={{ ml: 1, mt: 1 }}
							aria-labelledby='demo-row-radio-buttons-group-label'
							name='row-radio-buttons-group'
							onChange={handleRadioButton}
						>
							<FormControlLabel
								value='all'
								control={<Radio />}
								label='All Inventory Items'
							/>
							<FormControlLabel
								value='ready'
								control={<Radio />}
								label='Ready Items'
							/>
							<FormControlLabel
								value='non_ready'
								control={<Radio />}
								label='Non Ready Items'
							/>
						</RadioGroup>
						<Box ml={'auto'} mr={3}>
							<Stack direction={'row'} spacing={2}>
								<Button variant='contained' onClick={FileDownload}>
									Download
								</Button>
								<Button
									variant='outlined'
									onClick={() => setDownloadModal(false)}
								>
									Cancel
								</Button>
							</Stack>
						</Box>
					</FormControl>
				</Box>
			</Modal>
			<OverlayLoader open={errorloading} />
		</>
	);
};

export default FileUploadTable;
