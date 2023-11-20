/* eslint-disable react/prop-types */
import {
	Box,
	Grid,
	Stack,
	Typography,
	Button,
	CircularProgress,
} from '@mui/material';
import MUIButton from '../Button/MUIButton';
import notyf from '../NotificationMessage/notyfInstance';
import HeaderPaper from '../Containers/HeaderPaper';
import { Download } from '@mui/icons-material';
import { useState } from 'react';
import { importItemsFile } from '../../../core/api/readyItems';

export default function FilteTypeHeader({ setRefresh }) {
	const [fileName, setFileName] = useState('');
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);

	const downloadSample = async () => {
		try {
			const url = import.meta.env.VITE_API_BASE_URL + '/sample-download';
			const modifiedUrl = url.replace('/api/', '/');
			window.open(modifiedUrl);
		} catch (e) {
			console.log(e);
		}
	};
	const handleFileUpload = event => {
		const file = event.target.files[0];
		setFile(file);
		const reader = new FileReader();
		setFileName(file?.name);
		reader.onloadend = () => {};
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
	return (
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
	);
}
