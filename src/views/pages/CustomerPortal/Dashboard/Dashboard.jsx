import {
  Grid,
  Typography,
} from "@mui/material";
import HeaderPaper from "../../../Components/Containers/HeaderPaper";
import Profile from "./Profile/Profile";
import AccountInformation from "./AccountInformation/AccountInformation";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerDetails } from "../../../../core/store/auth/customerPortalThunks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
const Dashboard = () => {
  const dispatch = useDispatch();
  const {customerId} = useParams()
  const customerDetails = useSelector(state=>state.customer.customer)
   console.log('customerId' , customerId , customerDetails)
  useEffect(() => {
    dispatch(getCustomerDetails({customer_id:customerId , customerDetails}))
  }, [])
  
  return (
    <Grid container columnGap={1}>
      {/* left side  */}
      <Grid item lg={2.5}>
        <Grid item container>
          <Grid item xs={12} >
            <HeaderPaper>
              <Typography variant='h6'>Customer Information</Typography>
            </HeaderPaper>
          </Grid>
          {
            customerDetails?.id && <Profile customerId={customerId} customerDetails={customerDetails} />
          }
         
        </Grid>
      </Grid>
      {/* right side  */}
      <Grid item lg={9}>
        <HeaderPaper>
          <Typography variant='h6'>Account Information</Typography>
        </HeaderPaper>
        <AccountInformation customerId={customerId}/>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
