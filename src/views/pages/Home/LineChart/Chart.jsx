import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, Divider, LinearProgress } from '@mui/material';

import { Add } from '@mui/icons-material';
import HelpIcon from '@mui/icons-material/Help';
import { color } from '@mui/system';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
const data = [
  { name: '0', year: 2022, uv: 400, pv: 0, amt: 2400 },
  { name: 'Aug', year: 2022, uv: 400, pv: 200, amt: 2400 },
  { name: 'Sep', year: 2022, uv: 300, pv: 300, amt: 2210 },
  { name: 'Oct', year: 2022, uv: 200, pv: 500, amt: 2290 },
  { name: 'Nov', year: 2022, uv: 278, pv: 700, amt: 2000 },
  { name: 'Dec', year: 2022, uv: 189, pv: 900, amt: 2181 },
  { name: 'Jan', year: 2023, uv: 239, pv: 1100, amt: 2500 },
  { name: 'Feb', year: 2023, uv: 349, pv: 1300, amt: 2100 },
  { name: 'Mar', year: 2023, uv: 239, pv: 1500, amt: 2500 },
  { name: 'Apr', year: 2023, uv: 349, pv: 1700, amt: 2100 },
  { name: 'May', year: 2023, uv: 239, pv: 1800, amt: 2500 },
  { name: 'Jun', year: 2023, uv: 349, pv: 2000, amt: 2100 },
  { name: 'Jul', year: 2023, uv: 349, pv: 2200, amt: 2100 },
  { name: 'Aug', year: 2023, uv: 500, pv: 2400, amt: 2100 },
];

export default function Chart(props) {

  const { title, fiscalYear, dateMonth, priviousYear, lastYear, cashAmount, cashDate, inCommingAmmount, inComming, outGoing, outGoingAmmount, cashLatestDate, cashLatestAmmount } = props
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatYAxisTick = (tickValue) => {
    if (tickValue >= 1000000) {
      return `${tickValue / 1000000}m`;
    } else if (tickValue >= 1000) {
      return `${tickValue / 1000}k`;
    } else {
      return tickValue;
    }
  };




  return (
    <Box>
      <Card variant="outlined" sx={{ width: '1020px', marginTop: '44px' }}>
        <CardContent>
          <Typography variant="div" sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Typography>
              {title}{' '}
              <HoverPopover text="Total Cash">
                <HelpOutlineIcon sx={{ color: 'gray', fontSize: '12px' }} />
              </HoverPopover>
            </Typography>


            <Button onClick={handleClick} sx={{
              color: '#9b9494ed',
              '&:hover': {
                backgroundColor: 'white',
                // You can define the hover color you desire
              },
            }}>{dateMonth} <ArrowDropDownIcon /></Button>

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
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px', marginBottom: '8px' }}>

          </Typography>

        </CardContent>


        <Box sx={{ display: 'flex', padding: '4px' }}>
          <ResponsiveContainer width="90%" height={320}>
            <LineChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxisTick} />

              <Tooltip />
              <Legend />

              <Line type="monotone" dataKey="pv" stroke="#42A5F5" />

            </LineChart>

          </ResponsiveContainer>
          <Typography sx={{ width: '256px', textAlign: 'end', fontSize: '12px', padding: '12px' }} color="textSecondary">{cashDate}
            <Typography sx={{ fontWeight: 'bold' }}>${cashAmount}</Typography>
            <Typography sx={{ color: 'green', marginTop: '28px' }}>{inComming}</Typography>
            <Typography >${inCommingAmmount} +</Typography>
            <Typography sx={{ color: 'red', marginTop: '28px' }}>{outGoing}</Typography>
            <Typography >${outGoingAmmount} =</Typography>
            <Typography sx={{ marginTop: '28px', color: '#42A5F5', fontSize: '12px' }} >{cashLatestDate}</Typography>
            <Typography >${cashLatestAmmount} =</Typography>
          </Typography>

        </Box>


      </Card>
    </Box>
  );
}
