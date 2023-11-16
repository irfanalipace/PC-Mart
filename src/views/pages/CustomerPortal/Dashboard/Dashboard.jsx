import { Box, Grid } from "@mui/material";
import DashboardCard from "../../../Components/DashboardCard/DashboardCard";
import ApexChart from "../../../Components/DashboardChart/DashboardChart";
import { useState } from "react";
import { useEffect } from "react";
import { getDashboard } from "../../../../core/api/dashboard";

const Dashboard = () => {
  const [data, setData] = useState();
  const [data2, setData2] = useState();
  const fetchData = async () => {
    const resp = await getDashboard(1);
    setData(resp?.data);
    const resp2 = await getDashboard(2);
    setData2(resp2?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container columnGap={1}>
      <Grid container spacing={2} p={3}>
        <Grid item lg={3}>
          <DashboardCard name={"All Items"} total={7064} percent={"+60.8%"} />
        </Grid>
        <Grid item lg={3}>
          <Box>
            <DashboardCard
              name={"Non Ready Items"}
              total={5012}
              percent={"+15.03%"}
            />
          </Box>
        </Grid>
        <Grid item lg={3}>
          <Box>
            <DashboardCard
              name={"Ready Items"}
              total={2052}
              percent={"-0.03%"}
            />
          </Box>
        </Grid>
        <Grid item lg={3}>
          <Box>
            <DashboardCard
              name={"Total Inventory Value"}
              total={"$205k"}
              percent={"-0.03%"}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} p={3}>
        <Grid item lg={12}>
          <ApexChart />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
