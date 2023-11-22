import { Box } from '@mui/material';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// eslint-disable-next-line react/prop-types
const ApexChart = ({ seriesOne, seriesTwo, monthArray, total }) => {
	const maxYAxis = total + 10;
	const [chartData, setChartData] = useState({
		series: [
			{
				name: 'This Year',
				data: seriesTwo,
			},
			{
				name: 'Last Year',
				data: seriesOne,
				stroke: {
					dashArray: 0,
				},
			},
		],
		options: {
			chart: {
				height: 350,
				type: 'line',
				dropShadow: {
					enabled: true,
					color: '#000',
					top: 18,
					left: 7,
					blur: 10,
					opacity: 0.2,
				},
				toolbar: {
					show: false,
				},
			},
			colors: ['#1C1C1C', '#A8C5DA'],
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth',
				width: 2,
			},
			title: {
				text: '.',
				align: 'left',
				style: {
					color: 'transparent', // Set the desired color for the title
				},
			},
			grid: {
				borderColor: '#e7e7e7',
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5,
				},
			},
			markers: {
				size: 0,
			},
			xaxis: {
				categories: monthArray,
				title: {},
			},
			yaxis: {
				title: {
					text: '',
				},
				min: 0,
				max: total,
				tickAmount: 3,
			},
			legend: {
				position: 'top',
				horizontalAlign: 'right',
				floating: true,
				offsetY: -25,
				offsetX: -5,
			},
		},
	});
	console.log('hello', seriesOne, seriesTwo);

	return (
		<Box
			sx={{ backgroundColor: 'rgb(168, 197, 218, 0.1)', borderRadius: '8px' }}
			p={3}
		>
			<ReactApexChart
				options={chartData.options}
				series={chartData.series}
				type='line'
				height={335}
			/>
		</Box>
	);
};

export default ApexChart;
