import { Box } from '@mui/system';
import React from 'react';

function DetailViewContainer({ children }) {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 80px)',
        overflow: 'auto'
      }}
    >
      {children}
    </Box>
  );
}

export default DetailViewContainer;
