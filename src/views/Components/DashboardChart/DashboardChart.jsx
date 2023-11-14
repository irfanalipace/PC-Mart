import { Box } from "@mui/material";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "This Year",
        data: [
          12000000, 6000000, 3000000, 6000000, 12000000, 6000000, 12000000,
        ],
      },
      {
        name: "Last Year",
        data: [
          6000000, 12000000, 17000000, 12000000, 6000000, 12000000, 24000000,
        ],
        stroke: {
          dashArray: 0,
        },
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#A8C5DA", "#1C1C1C"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Total Products",
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        title: {
          text: "",
        },
      },
      yaxis: {
        title: {
          text: "",
        },
        min: 0,
        max: 30000000,
        tickAmount: 3,
        labels: {
          formatter: function (val) {
            return val / 1000000 + "M";
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  });

  return (
    <Box
      sx={{ backgroundColor: "rgb(168, 197, 218, 0.1)", borderRadius: "8px" }}
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
