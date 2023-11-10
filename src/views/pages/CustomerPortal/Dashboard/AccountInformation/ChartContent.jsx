import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCustomerGraphApi } from "../../../../../core/api/customerportal";
import { useParams } from "react-router-dom";
import { snakeCaseToPrettyText } from "../../../../../core/utils/helpers";

const ChartContent = ({selectedYear}) => {

const [dataa , setData] = useState([])
  const data = [
    {
      name: "Jan 2023",
      paid: 4000,
      unpaid: 2400,
      ending_balance: 2000,
    },
    {
      name: "Feb 2023",
      incoming: 3000,
      opening_balance: 1398,
      ending_balance: 2210,
    },
    {
      name: "Mar 2023",
      incoming: 2000,
      opening_balance: 9800,
      ending_balance: 2290,
    },
    {
      name: "April 2023",
      incoming: 2780,
      opening_balance: 3908,
      ending_balance: 2000,
    },
    {
      name: "May 2023",
      incoming: 1890,
      opening_balance: 4800,
      ending_balance: 2181,
    },
    {
      name: "June 2023",
      incoming: 2390,
      opening_balance: 3800,
      ending_balance: 2500,
    },
    {
      name: "July 2023",
      incoming: 3490,
      opening_balance: 4300,
      ending_balance: 2100,
    },
  ];
   const {customerId} = useParams()

  const gettingGraphData = async()=> {
    try {
       const resp = await getCustomerGraphApi({customer_id: customerId , flow: selectedYear });
       console.log('customerresp', resp )
       setData(resp?.data)
      } catch (error) {
      
    }
  }
  useEffect(()=> {

    gettingGraphData()

  } , [selectedYear])
  return (
    <Box sx={{ display: "flex", padding: "4px" }}>
      <ResponsiveContainer width='90%' height={320}>
        <LineChart
          width={500}
          height={300}
          data={dataa}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type='monotone' dataKey= 'paid' stroke='#82ca9d' />
          <Line type='monotone' dataKey='unpaid' stroke='red' />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ChartContent;
