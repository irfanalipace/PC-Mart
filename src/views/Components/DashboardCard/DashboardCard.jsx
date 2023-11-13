import { Box, Grid, Typography } from "@mui/material";
import rise from "../../../assets/icons/ArrowRise.png";
import fall from "../../../assets/icons/ArrowFall.png";

const DashboardCard = ({ name, total, percent }) => {
  const isRise = percent.includes("+");

  return (
    <Box
      sx={{
        backgroundColor: "#E5ECF6",
        minHeight: "177px",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <Typography variant='h6' fontSize={14} fontWeight={600}>
        {name}
      </Typography>
      <Grid container direction='row' justifyContent='space-between' mt={2}>
        <Grid item lg={6}>
          <Typography variant='h6' fontSize={24} fontWeight={600}>
            {total}
          </Typography>
        </Grid>
        <Grid item lg={3}></Grid>
        <Grid item lg={3}>
          <Typography variant='h6' fontSize={12} fontWeight={400} mt={1}>
            {percent}
            <img src={isRise ? rise : fall} alt={isRise ? "Rise" : "Fall"} />
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardCard;
