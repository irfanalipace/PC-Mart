import { CircularProgress, Grid, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import MUIButton from "../../../Components/Button/MUIButton";
import CloseIcon from "@mui/icons-material/Close";
const CustomerStatus = ({status , decline , accept , errors , setErrors , btnLoading , btnLoading2 }) => {
  return (
    <>
      {status !== "accepted" &&
      status !== "declined" &&
      status !== undefined ? (
        <Grid
          mt={2}
          item
          xs={9}
          display='flex'
          alignItems='flex-end'
          direction='column'>
          <Stack direction='row' columnGap={3}>
       
                  {btnLoading ? <CircularProgress/> : (
            <MUIButton size='large'  variant='outlined' onClick={decline}>Declined</MUIButton>

     )}
              {btnLoading2 ? <CircularProgress/> : (
            <MUIButton size='large' onClick={accept}>Accept</MUIButton>

     )}
          </Stack>
          <Stack direction='row' display='flex' alignItems='center'>
            <Typography color='error'>{errors}</Typography>
            {errors && (
              <IconButton onClick={() => setErrors(null)}>
                <CloseIcon />
              </IconButton>
            )}
          </Stack>
        </Grid>
      ) : null}
    </>
  );
};

export default CustomerStatus;
