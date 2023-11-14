import React,{useState } from 'react';
import Card from '@mui/material/Card'; 
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, Divider, LinearProgress  } from '@mui/material';
import { Add } from '@mui/icons-material';
import HelpIcon from '@mui/icons-material/Help';
import { color } from '@mui/system';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HoverPopover from '../HoverPopover/ErrorOutlinePopover';
export default function MyCard(props) {
  const { title, totalUnpaidInvoices, currentAmount, overdueAmount, progressValue, newInovice, newRecurring, newCustomer } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <Card variant="outlined" sx={{width:'500px'}}>
        <CardContent>
          <Typography variant="div" sx={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
          <Typography>
      {title}{' '}
      <HoverPopover text="Total Receivable">
        <HelpOutlineIcon sx={{ color: 'gray', fontSize: '12px' }} />
      </HoverPopover>
    </Typography>
            <Button onClick={handleClick}>
              <Add  /> <Typography>New</Typography>
            </Button>
            <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}> <Typography sx={{marginLeft:'-22px'}}><Button><Add  /></Button>{newInovice}</Typography></MenuItem>
        <MenuItem onClick={handleClose}> <Typography sx={{marginLeft:'-22px'}}><Button><Add  /></Button>{newRecurring}</Typography></MenuItem>
        <MenuItem onClick={handleClose}> <Typography sx={{marginLeft:'-22px'}}><Button><Add  /></Button>{newCustomer}</Typography></MenuItem>
      </Menu>
          </Typography>
        <Divider></Divider>
          <Typography variant="body2" sx={{marginTop:'10px', marginBottom:'8px'}}>
            {totalUnpaidInvoices}
          </Typography>
          <LinearProgress variant="determinate" value={progressValue} sx={{ height: '12px', backgroundColor: '#42A5F5', marginTop: '4px' }} />
        </CardContent>
        <Divider></Divider>
        <Typography variant="div" sx={{display:'flex', padding:'12px'}}>
          <Typography sx={{ borderRight: '1px solid gray', width:'269px', marginRight:'14px'}}>
            <Typography sx={{color:'#42A5F5'}}> Current</Typography>
            <Typography sx={{ fontWeight: 'bold', paddingTop:'5px' }}>
              {currentAmount} 
            </Typography>
          </Typography>
          <Typography>
            <Typography sx={{color:'red'}}> Overdue</Typography>
            <Button sx={{ fontWeight: 'bold', color:'black', '&:hover': { background: 'white' }}}>
              {overdueAmount} <ArrowDropDownIcon sx={{paddingTop:'0px', color:'black'}}/>
            </Button>
          </Typography>
        </Typography>
      </Card>
    </Box>
  );
}
