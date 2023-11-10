import { Box, Stack } from '@mui/system';
import { useState } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { CalendarMonth, ArrowDropDown } from '@mui/icons-material';

function StatementsTab() {
	const [calenderAnchor, setCalenderAnchor] = useState(null);
	const [filterMenu, setFilterMenu] = useState();
	return (
		<Box>
			<Stack direction={'row'}>
				<Button
					onClick={e => setCalenderAnchor(e.currentTarget)}
					sx={{ boxShadow: 3 }}
				>
					<CalendarMonth fontSize='16px' />
					<Typography className='TextCapitalize' color='#000' fontSize='small'>
						This Month
					</Typography>
					<ArrowDropDown fontSize='small' />
				</Button>
				<Menu
					anchorEl={calenderAnchor}
					open={Boolean(calenderAnchor)}
					onClose={() => setCalenderAnchor(null)}
					sx={{ '&.MuiPaper-root': { width: '250px' } }}
					aria-label='Calendar Month'
				>
					<MenuItem onClick={() => setCalenderAnchor(null)}>This Week</MenuItem>
					<MenuItem onClick={() => setCalenderAnchor(null)}>This Year</MenuItem>
					<MenuItem onClick={() => setCalenderAnchor(null)}>Last Year</MenuItem>
				</Menu>

				<Button
					onClick={e => setFilterMenu(e.currentTarget)}
					sx={{ boxShadow: 3, marginLeft: '10px' }}
				>
					<Typography className='TextCapitalize' color='#000' fontSize='small'>
						Filter By:
					</Typography>
					<ArrowDropDown fontSize='small' />
				</Button>
				<Menu
					anchorEl={filterMenu}
					open={Boolean(filterMenu)}
					onClose={() => setFilterMenu(null)}
					sx={{ '&.MuiPaper-root': { width: '250px' } }}
					aria-label='Calendar Month'
				>
					<MenuItem onClick={() => setFilterMenu(null)}>All</MenuItem>
					<MenuItem onClick={() => setFilterMenu(null)}>Outstanding</MenuItem>
				</Menu>
			</Stack>
		</Box>
	);
}

export default StatementsTab;
