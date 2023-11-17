import { Box, Grid, Typography } from '@mui/material';
import DashboardCard from '../../../Components/DashboardCard/DashboardCard';
import ApexChart from '../../../Components/DashboardChart/DashboardChart';
import { useState } from 'react';
import { useEffect } from 'react';
import { getDashboard } from '../../../../core/api/dashboard';

const Dashboard = () => {
	const [alldata, setAllData] = useState();
	const [series, setSeries] = useState([]);
	const [seriesX, setSeriesX] = useState([]);
	const [months, setMonths] = useState([]);

	const fetchData = async type => {
		const resp = await getDashboard(type);
		setAllData(resp?.data);
		setSeries(resp?.data?.graph_data?.last_year.map(row => row?.value));
		setSeriesX(resp?.data?.graph_data?.current_year.map(row => row?.value));
		setMonths(resp?.data?.graph_data?.current_year.map(row => row?.month));
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Grid container columnGap={1}>
			<Grid container spacing={2} p={3}>
				<Grid item lg={3}>
					<DashboardCard
						name={'All Items'}
						total={alldata?.total_items}
						// percent={"+60.8%"}
					/>
				</Grid>
				<Grid item lg={3}>
					<Box>
						<DashboardCard
							name={'Non Ready Items'}
							total={alldata?.total_non_ready_items}
							// percent={"+15.03%"}
						/>
					</Box>
				</Grid>
				<Grid item lg={3}>
					<Box>
						<DashboardCard
							name={'Ready Items'}
							total={alldata?.total_ready_items}
							// percent={"-0.03%"}
						/>
					</Box>
				</Grid>
				<Grid item lg={3}>
					<Box>
						<DashboardCard
							name={'Total Inventory Value'}
							total={'$' + alldata?.total_inventory_value}
							// percent={"-0.03%"}
						/>
					</Box>
				</Grid>
			</Grid>
			<Grid
				container
				sx={{ width: '40%' }}
				justifyContent={'space-around'}
				pl={3}
			>
				<Grid item>
					<Typography fontWeight={600}>Total Products</Typography>
				</Grid>
				<Grid item>
					<Typography>Non Ready Products</Typography>
				</Grid>
				<Grid item>
					<Typography>Ready Products</Typography>
				</Grid>
			</Grid>
			<Grid container p={3}>
				<Grid item lg={12}>
					<ApexChart
						seriesOne={series}
						seriesTwo={seriesX}
						monthArray={months}
					/>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Dashboard;
