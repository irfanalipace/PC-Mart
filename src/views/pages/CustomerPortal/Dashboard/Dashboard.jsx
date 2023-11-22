import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import DashboardCard from '../../../Components/DashboardCard/DashboardCard';
import ApexChart from '../../../Components/DashboardChart/DashboardChart';
import { useState } from 'react';
import { useEffect } from 'react';
import { getDashboard } from '../../../../core/api/dashboard';

const Dashboard = () => {
	const [alldata, setAllData] = useState(null);
	const [series, setSeries] = useState([]);
	const [seriesX, setSeriesX] = useState([]);
	const [months, setMonths] = useState([]);
	const [chart, setChart] = useState('all');
	const [loading, setLoading] = useState(true);

	const fetchData = async type => {
		setLoading(true);
		try {
			const resp = await getDashboard(type);
			setAllData(resp?.data);
			setSeries(resp?.data?.graph_data?.last_year.map(row => row?.value));
			setSeriesX(resp?.data?.graph_data?.current_year.map(row => row?.value));
			setMonths(resp?.data?.graph_data?.current_year.map(row => row?.month));
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
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
				<Grid item lg={2}>
					<Box>
						<DashboardCard
							name={'Non Ready Items'}
							total={alldata?.total_non_ready_items}
							// percent={"+15.03%"}
						/>
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box>
						<DashboardCard
							name={'Ready Items'}
							total={alldata?.total_ready_items}
							// percent={"-0.03%"}
						/>
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box>
						<DashboardCard
							name={'Sold Items'}
							total={alldata?.total_sold_items ? alldata?.total_sold_items : 0}
							// percent={"-0.03%"}
						/>
					</Box>
				</Grid>
				<Grid item lg={3}>
					<Box>
						<DashboardCard
							name={'Total value (Not-Ready-Items)'}
							total={
								'$' + alldata?.total_inventory_value
									? '$' + alldata?.total_inventory_value
									: 0
							}
							// percent={"-0.03%"}
						/>
					</Box>
				</Grid>
			</Grid>
			<Grid
				container
				sx={{ width: '50%' }}
				justifyContent={'space-around'}
				pl={3}
			>
				<Grid item>
					<Typography
						fontWeight={chart === 'all' && 600}
						onClick={() => {
							setChart('all');
							fetchData();
						}}
						sx={{ cursor: 'pointer' }}
					>
						Total Products
					</Typography>
				</Grid>
				|
				<Grid item>
					<Typography
						fontWeight={chart === 'not-ready' && 600}
						onClick={() => {
							setChart('not-ready');
							fetchData('non_ready');
						}}
						sx={{ cursor: 'pointer' }}
					>
						Non Ready Products
					</Typography>
				</Grid>
				|
				<Grid item>
					<Typography
						fontWeight={chart === 'ready' && 600}
						onClick={() => {
							setChart('ready');
							fetchData('ready');
						}}
						sx={{ cursor: 'pointer' }}
					>
						Ready Products
					</Typography>
				</Grid>
				|
				<Grid item>
					<Typography
						fontWeight={chart === 'sold' && 600}
						onClick={() => {
							setChart('sold');
							fetchData('sold');
						}}
						sx={{ cursor: 'pointer' }}
					>
						Sold Products
					</Typography>
				</Grid>
			</Grid>
			<Grid container p={3}>
				<Grid item lg={12}>
					{!loading ? (
						<ApexChart
							seriesOne={series}
							seriesTwo={seriesX}
							monthArray={months}
							total={alldata?.total_items}
						/>
					) : (
						<Grid
							container
							direction='row'
							justifyContent='center'
							alignItems='center'
						>
							<Grid item mt={10}>
								<CircularProgress />
							</Grid>
						</Grid>
					)}
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Dashboard;
