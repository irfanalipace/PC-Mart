/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Box, Grid, TextField, MenuItem, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { getBatchNumber } from '../../../core/api/batchNumber';

export default function DataTableExtendedHeader({
	onSearchSubmit,
	onBatchChange,
	type,
}) {
	const [batchList, setBatchList] = useState([]);
	const [batchNumber, setBatchNumber] = useState([]);

	useEffect(() => {
		fetchBatchNumbers();
	}, []);

	const fetchBatchNumbers = async () => {
		try {
			const resp = await getBatchNumber();
			setBatchList(resp?.data);
		} catch (err) {
			console.error(err);
		}
	};

	const handleSubmit = e => {
		e.preventDefault();
		onSearchSubmit(batchNumber);
	};

	return (
		<Box sx={{ padding: '23px' }}>
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<form onSubmit={handleSubmit}>
						<TextField
							id='search'
							label='Search'
							variant='outlined'
							value={batchNumber}
							onChange={e => setBatchNumber(e.target.value)}
							fullWidth
							InputProps={{
								startAdornment: (
									<SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
								),
							}}
						/>
					</form>
				</Grid>

				<Grid item xs={2}>
					<FormControl fullWidth>
						<InputLabel id='dropdown-label'>Batch No</InputLabel>
						<Select
							labelId='dropdown-label'
							id='dropdown'
							label='Batch No'
							onChange={onBatchChange}
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
							<MenuItem value={null}>{`All ${type} ${
								type !== 'Files' ? 'Items' : ''
							} `}</MenuItem>
							<Divider />
							{/* <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}> */}
							{batchList?.map(row => (
								<MenuItem
									key={row.id}
									value={row?.batch_number}
									// onClick={() => onBatchChange()}
								>
									{row?.batch_number}
								</MenuItem>
							))}
							{/* </Box> */}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
		</Box>
	);
}
