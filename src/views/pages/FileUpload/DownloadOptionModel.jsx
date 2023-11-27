/* eslint-disable react/prop-types */
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Modal from 'comp/Modal/Dialog.jsx';
import { Box, Stack, Button } from '@mui/material';
import { useState } from 'react';

export default function DownloadOptionModel({ open, onClose, onDownload }) {
	const [radio, setRadio] = useState('all');
	const handleRadioButton = e => {
		setRadio(e.target.value);
	};

	return (
		<Modal open={open} title='Downalod' onClose={onClose}>
			<Box mb={5} mt={2} ml={3}>
				<FormControl sx={{ width: '100%' }}>
					<FormLabel id='demo-row-radio-buttons-group-label'>
						What do you want to download?
					</FormLabel>
					<RadioGroup
						defaultValue={radio}
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
						<FormControlLabel
							value='sold'
							control={<Radio />}
							label='Sold Items'
						/>
					</RadioGroup>
					<Box ml={'auto'} mr={3}>
						<Stack direction={'row'} spacing={2}>
							<Button variant='contained' onClick={() => onDownload(radio)}>
								Download
							</Button>
							<Button variant='outlined' onClick={onClose}>
								Cancel
							</Button>
						</Stack>
					</Box>
				</FormControl>
			</Box>
		</Modal>
	);
}
