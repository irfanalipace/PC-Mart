import { Grid } from '@mui/material';
import React from 'react';

export default function TableGrid({ sm, children }) {
  return (
    <Grid
      item
      sm={sm}
      sx={{
        height: 'calc(100vh - 87px)', // setting fix height for table grid columns so that avoid page overflow(it creates extra scroll bar on page if height not fixed)
        overflow: 'hidden'
      }}
    >
      {children}
    </Grid>
  );
}
