import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, Divider } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PieChart, Pie, Cell, Legend, Tooltip, Label } from 'recharts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
const valueFormatter = (value) => `$${value.toFixed(2)}`;

export default function TopExpenses(props) {
  const { title, fiscalYear, month, priviousYear, lastYear, quarter, priviousQuarter, priviousMonth, last6Month, last12Month } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const data = [
    { value: 434234.423, label: 'Cost of Sold Gold' },
    { value: 123456.789, label: 'Operating Expenses' },
    { value: 98765.432, label: 'Marketing Costs' },
    // Add more data points as needed
  ];

  return (
    <Box>
      <Card variant="outlined" sx={{ width: '490px', marginTop: '44px', marginLeft: '12px', position:'relative' }}>
        <CardContent>
          
          <Typography variant="div" sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Typography>{title}  <HoverPopover text="Your Top Expenses">
        <HelpOutlineIcon sx={{ color: 'gray', fontSize: '12px' }} />
      </HoverPopover></Typography>

     <Typography sx={{marginTop:'-6px'}}>
           
     <Button  onClick={handleClick}   sx={{
    color: '#9b9494ed',
    '&:hover': {
      backgroundColor: 'white',
      // You can define the hover color you desire
    },
  }}> {fiscalYear}<ArrowDropDownIcon  /></Button>
     </Typography>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}>{fiscalYear}</MenuItem>
              <MenuItem onClick={handleClose}> {quarter}</MenuItem>
              <MenuItem onClick={handleClose}> {month}</MenuItem>
              <MenuItem onClick={handleClose}>{priviousYear}</MenuItem>
              <MenuItem onClick={handleClose}> {priviousQuarter}</MenuItem>
              <MenuItem onClick={handleClose}> {priviousMonth}</MenuItem>
              <MenuItem onClick={handleClose}> {last6Month}</MenuItem>
              <MenuItem onClick={handleClose}> {last12Month}</MenuItem>
            </Menu>
          </Typography>
          <Divider></Divider>
       <Box sx={{ position:'absolute', zIndex:'999', 
  
    width: '100%',
   textAlign: 'right',
  marginTop:'45px',
  paddingRight:'29px'
}}>
       <Typography sx={{
        height: 25,
        width: 25,
        backgroundColor: '#f29234',
        borderRadius: '50%',
        display: 'inline-block',
        padding:'12px',
       position:'absolute',
       marginLeft:'-29px'
       }}>
      
        </Typography>   Cost of good Sold (100.00%)
       </Box>
       <PieChart width={400} height={466}>
  <Pie dataKey="value" data={data} outerRadius={90} fill="#E59357" label={false} >
    {
      data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill="#E59357" />
      ))
    }
  </Pie>
  <Legend />
  <Tooltip
    formatter={(value, name, entry) => [
      valueFormatter(value),
      entry.payload.label.split(' ').join('\n') // Break label into lines
    ]}
  />
  <Label value={valueFormatter(data[0].value)} position="center" />
</PieChart>

    
        
        </CardContent>
      </Card>
    </Box>
  );
}
