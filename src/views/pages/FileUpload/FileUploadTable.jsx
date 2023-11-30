/* eslint-disable react/prop-types */
import { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import notyf from 'comp/NotificationMessage/notyfInstance';
import OverlayLoader from 'comp/OverlayLoader/OverlayLoader.jsx';
import {
	Box,
	Grid,
	Stack,
	Typography,
	Button,
	Tooltip,
	Link,
	LinearProgress,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import {
	DownloadSingleFile,
	DownloadSingleSoldFile,
	convertNotReadyItemsToReady,
	getFileUploadError,
	getUploadFile,
	getSoldUploadFile,
	DownloadProblematicFile,
} from 'core/api/fileupload';
import DataTable from 'comp/DataTable/DataTable';
import TableContainer from 'comp/Containers/TableContainer';
import { downloadFile, formatDateToYYYYMMDD } from 'core/utils/helpers';
import ConfirmDialog from 'comp/ConfirmDialog/ConfirmDialog.jsx';
import ImportFile from 'comp/ImportFile/index.jsx';
import DataTableExtendedHeader from 'comp/DataTable/DataTableExtendedHeader.jsx';
import DownloadOptionModel from './DownloadOptionModel.jsx';
import FileUploadErrorModal from 'comp/FileUpload/FileUploadErrorModal.jsx';

const FileUploadTable = ({ type, sx, importFileHeading }) => {
	const [errorModal, setErrorModal] = useState(false);

	const [errorloading, setErrorLoading] = useState(false);
	const [downloading, setDownloading] = useState(null);
	const [refresh, setRefresh] = useState(0);
	const [bathcNumber, setBatchNumber] = useState(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [convertLoaidng, setconvertLoading] = useState('');
	const [errorData, setErrorData] = useState('');
	const [downloadModal, setDownloadModal] = useState(false);
	const [fileDownloadId, setFileDownLoadId] = useState(null);
	const [search, setSearch] = useState('');
	const [batchNo, setBatchNo] = useState('');

	const handleStatusClick = async row => {
		if (row.original.status === 'error') {
			setErrorLoading(true);
			const res = await getFileUploadError(row.original.id);
			setErrorData(res?.data);
			setErrorLoading(false);
			setErrorModal(true);
		}
	};
	const downloadErrorFile = async id => {
		try {
			const resp = await DownloadProblematicFile(id);
			downloadFile(resp?.data?.route);
		} catch (err) {
			console.log(err);
		}
	};

	const FileDownload = async value => {
		try {
			setDownloadModal(false);
			setDownloading(fileDownloadId);
			const resp = await DownloadSingleFile(batchNo, value);
			downloadFile(resp?.data?.url);
		} catch (err) {
			console.log(err);
		} finally {
			setDownloading(null);
		}
	};
	const FileSoldDownload = async id => {
		try {
			const resp = await DownloadSingleSoldFile(id);
			console.log(resp?.data);
			downloadFile(resp?.data?.route);
		} catch (err) {
			console.log(err);
		}
	};
	const intialColumns = [
		{
			accessorKey: 'name',
			header: 'File Name',
			maxSize: 90,
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
						padding: 0,
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
			minSize: 200,
			Cell: ({ row }) => (
				<Stack direction={'row'} spacing={2} alignItems={'center'}>
					{row?.original?.status === 'processed' ? (
						<Button
							id={row?.original?.id}
							variant='contained'
							onClick={() => {
								type === 'sold'
									? FileSoldDownload(row?.original?.id)
									: setDownloadModal(true);
								setBatchNo(row?.original?.batch_number);
							}}
							disabled={downloading === row?.original?.id}
						>
							{downloading === row?.original?.id ? (
								<Box sx={{ width: '100%' }}>....</Box>
							) : (
								<Download />
							)}
						</Button>
					) : (
						<Button
							id={row?.original?.id}
							variant='contained'
							onClick={() => {
								downloadErrorFile(row?.original?.id);
							}}
							disabled={downloading === row?.original?.id}
						>
							{downloading === row?.original?.id ? (
								<Box sx={{ width: '100%' }}>....</Box>
							) : (
								<Download />
							)}
						</Button>
					)}

					{(row?.original?.non_ready_items_count > 0 ||
						(row?.original?.ready_items_count > 0 && type !== 'sold')) && (
						<Stack>
							<Link
								variant='body2'
								underline={
									convertLoaidng === row?.original?.id ? 'none' : 'always'
								}
								color='#2E7D32'
								onClick={() => {
									if (convertLoaidng === row?.original?.id) return;
									setOpenConfirmDialog(true);
									setDialogProps({
										onConfirm: () => handleFileConvert(row?.original?.id),
									});
								}}
								disabled={convertLoaidng === row?.original?.id}
							>
								Convert to Sold
							</Link>
							{convertLoaidng === row?.original?.id && <LinearProgress />}
						</Stack>
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

	const handleBatchChange = e => {
		setBatchNumber(e.target.value);
		setRefresh(prev => prev + 1);
	};

	const getFiles = (e, bathcNumber) => {
		if (type === 'sold') {
			return getSoldUploadFile(e, bathcNumber, search);
		} else {
			return getUploadFile(e, bathcNumber, search);
		}
	};

	return (
		<>
			<Grid container sx={sx}>
				<Grid item sm={12}>
					<ImportFile
						type={type}
						title={importFileHeading}
						setRefresh={setRefresh}
					/>
					<TableContainer>
						<DataTableExtendedHeader
							onSearchSubmit={input => {
								setSearch(input);
								setRefresh(prev => prev + 1);
							}}
							onBatchChange={handleBatchChange}
							type='Files'
						/>

						<DataTable
							api={e => getFiles(e, bathcNumber)}
							columns={intialColumns}
							onRowClick={() => {}}
							collapsed={false}
							refresh={refresh}
							manualFilter
							type={type}
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
			<FileUploadErrorModal
				open={errorModal}
				onClose={() => setErrorModal(false)}
				errorData={errorData}
			/>
			<DownloadOptionModel
				onDownload={FileDownload}
				open={downloadModal}
				onClose={() => setDownloadModal(false)}
			/>
			<OverlayLoader open={errorloading} />
		</>
	);
};

export default FileUploadTable;
