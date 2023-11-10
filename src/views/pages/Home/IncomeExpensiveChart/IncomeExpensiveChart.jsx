import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, Divider } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
const chartSetting = {
	width: 500,
	height: 300,
};
const dataset = [
	{
		Expense: 3,
		Income: 57,
		newYork: 86,
		seoul: 21,
		month: 'Jan',
	},
	{
		Expense: 0,
		Income: 52,
		newYork: 78,
		seoul: 28,
		month: 'Feb',
	},
	{
		Expense: 0,
		Income: 53,
		newYork: 106,
		seoul: 41,
		month: 'Mar',
	},
	{
		Expense: 0,
		Income: 56,
		newYork: 92,
		seoul: 73,
		month: 'Apr',
	},
	{
		Expense: 0,
		Income: 69,
		newYork: 92,
		seoul: 99,
		month: 'May',
	},
	{
		Expense: 0,
		Income: 63,
		newYork: 103,
		seoul: 144,
		month: 'June',
	},
	{
		Expense: 0,
		Income: 60,
		newYork: 105,
		seoul: 319,
		month: 'July',
	},
	{
		Expense: 4,
		Income: 60,
		newYork: 106,
		seoul: 249,
		month: 'Aug',
	},
	{
		Expense: 0,
		Income: 30,
		newYork: 0,
		seoul: 0,
		month: 'Sept',
	},
	{
		Expense: 0,

		Income: 0,
		newYork: 0,
		seoul: 0,
		month: 'Oct',
	},
	{
		Expense: 0,

		Income: 0,
		newYork: 0,
		seoul: 0,
		month: 'Nov',
	},
	{
		Expense: 0,
		Income: 0,
		newYork: 0,
		seoul: 0,
		month: 'Dec',
	},
];

const valueFormatter = value => `${value}k`;

export default function IncomeExpensiveChart(props) {
	const [selectedButton, setSelectedButton] = useState('Accrual');

	const { title, fiscalYear, dateMonth, priviousYear, lastYear } = props;
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleAccrualClick = () => {
		setSelectedButton('Accrual');
	};

	const handleCashClick = () => {
		setSelectedButton('Cash');
	};

	const filteredData = dataset.map(entry => ({
		...entry,
		Expense: selectedButton === 'Accrual' ? entry.Expense : 7,
		Income: selectedButton === 'Accrual' ? entry.Income : 13,
		newYork: selectedButton === 'Accrual' ? entry.newYork : 3,
		seoul: selectedButton === 'Accrual' ? entry.seoul : 5,
	}));

	return (
		<Box>
			<Card variant='outlined' sx={{ width: '520px', marginTop: '44px' }}>
				<CardContent>
					<Typography
						variant='div'
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							marginBottom: '8px',
						}}
					>
						<Typography>
							{title}{' '}
							<HoverPopover text='Income and Expense'>
								<HelpOutlineIcon sx={{ color: 'gray', fontSize: '12px' }} />
							</HoverPopover>
						</Typography>

						<Typography sx={{ marginTop: '-6px' }}>
							{' '}
							<Button
								onClick={handleClick}
								sx={{
									color: '#9b9494ed',
									'&:hover': {
										backgroundColor: 'white',
										// You can define the hover color you desire
									},
								}}
							>
								{dateMonth} <ArrowDropDownIcon />
							</Button>
						</Typography>

						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>{fiscalYear}</MenuItem>
							<MenuItem onClick={handleClose}> {priviousYear}</MenuItem>
							<MenuItem onClick={handleClose}> {lastYear}</MenuItem>
						</Menu>
					</Typography>
					<Divider></Divider>

					<Typography
						sx={{ textAlign: 'end', marginTop: '10px', marginBottom: '12px' }}
					>
						<Button
							sx={{
								background:
									selectedButton === 'Accrual' ? '#C6C6C6' : '#dddddd54',
								color: 'black',
								padding: '3px',
								borderRadius: '2px',
								height: '22px',
								fontSize: '10px',
								minWidth: '42px',
							}}
							onClick={handleAccrualClick}
						>
							Accrual
						</Button>
						<Button
							sx={{
								background: selectedButton === 'Cash' ? '#C6C6C6' : '#dddddd54',
								color: 'black',
								padding: '3px',
								borderRadius: '2px',
								height: '22px',
								fontSize: '10px',
								minWidth: '42px',
							}}
							onClick={handleCashClick}
						>
							Cash
						</Button>
					</Typography>

					<BarChart
						width={chartSetting.width}
						height={chartSetting.height}
						data={filteredData}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='month' />
						<YAxis tickFormatter={valueFormatter} />
						<Tooltip formatter={value => valueFormatter(value)} />
						<Legend />
						<Bar dataKey='Expense' name='Expense' fill='#E59357' />
						<Bar dataKey='Income' name='Income' fill='#A9D47D' barSize={10} />
						{/* <Bar dataKey="newYork" name="New York" fill="#E59357" /> */}
					</BarChart>
					<Divider sx={{ marginBottom: '12px', marginTop: '12px' }}></Divider>
					<Box
						sx={{
							display: 'flex',
							marginLeft: '40px',
							justifyContent: 'space-between',
						}}
					>
						<Typography>
							<Typography
								sx={{ display: 'flex', marginTop: '10px', marginBottom: '4px' }}
							>
								<Typography
									sx={{
										background: 'rgb(169, 212, 125);',
										width: '22px',
										height: '7px',
										marginBottom: '-8px',
									}}
								></Typography>
								<Typography
									sx={{
										fontWeight: 'bold',
										marginTop: '-8px',
										marginLeft: '6px',
										fontSize: '12px',
									}}
								>
									Income
								</Typography>
							</Typography>
							<Typography sx={{ display: 'flex' }}>
								<Typography
									sx={{
										background: 'rgb(229, 147, 87);',
										width: '22px',
										height: '7px',
										marginBottom: '-8px',
									}}
								></Typography>
								<Typography
									sx={{
										fontWeight: 'bold',
										marginTop: '-8px',
										marginLeft: '6px',
										fontSize: '12px',
									}}
								>
									Expense
								</Typography>
							</Typography>
						</Typography>
						<Typography>
							<Typography sx={{ color: '#A9D47D', fontSize: '14px' }}>
								Total Income
							</Typography>
							<Typography sx={{ fontWeight: 'bold' }}>$923,433.3</Typography>
						</Typography>

						<Typography>
							<Typography sx={{ color: 'red', fontSize: '14px' }}>
								{' '}
								Total Expansive
							</Typography>
							<Typography sx={{ fontWeight: 'bold' }}>$78,434232.3</Typography>
						</Typography>
					</Box>
					<Typography
						sx={{ marginLeft: '40px', marginTop: '23px', fontSize: '10px' }}
						color='textSecondary'
					>
						* Income and Tax Expense values display are excluesive of taxes
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
}
