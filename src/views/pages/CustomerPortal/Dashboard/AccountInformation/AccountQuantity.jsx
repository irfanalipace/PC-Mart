import { Box, Grid, Stack, Typography } from "@mui/material";

const AccountQuantity = ({sm, label, value}) => {
  return (
    <>
      <Grid item sm={sm || 2.9}>
        <Box paddingX={3}>
          <Typography variant='h5' fontSize='16px'>
          {label || 'Accepted Paid Amount'}
          </Typography>
          <Typography color='primary' variant='h6' fontSize='28px'>
          {value || 0}
          </Typography>
        </Box>
      </Grid>
    </>

  );
};

export default AccountQuantity;
