import { Paper } from '@mui/material';
import React from 'react';

function HeaderPaper({ children, style , sx }) {
  const defaultSx = {
    padding: '1.2rem',
    marginBottom: '10px',
  };
  return (
    <Paper sx={{ ...defaultSx, ...sx }}>{children}</Paper>
  );
}

export default HeaderPaper;
