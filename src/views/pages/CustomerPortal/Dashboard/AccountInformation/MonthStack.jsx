import { Box, Typography } from '@mui/material'
import React from 'react'

const MonthStack = ({label, value}) => {
  return (
    <Box sx={{ background: "#F5F5F5", padding: "6px 10px", borderRadius:'8px' }}>
    <Typography variant='body1'>${value || 0}</Typography>
    <Typography variant='templateBody'>
      {label || 'Paid Amount'}
    </Typography>
  </Box>  )
}

export default MonthStack