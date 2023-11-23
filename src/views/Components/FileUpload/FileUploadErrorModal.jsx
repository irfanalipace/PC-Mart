/* eslint-disable react/prop-types */
import { Box, Stack, Typography } from '@mui/material';
import Modal from '../Modal/Dialog';
export default function FileUploadErrorModal({ open, onClose, errorData }) {
	return (
		<Modal open={open} title='Error Found' onClose={onClose}>
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
	);
}
