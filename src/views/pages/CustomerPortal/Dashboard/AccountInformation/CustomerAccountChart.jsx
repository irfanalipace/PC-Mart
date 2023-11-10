import React, { useState } from "react";
import {
  CardContent,
  Grid,
  Typography,
  Card,
  MenuItem,
  Stack,
  Menu,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import HoverPopover from "../../../../Components/HoverPopover/ErrorOutlinePopover";
import ChartContent from "./ChartContent";
import { snakeCaseToPrettyText } from "../../../../../core/utils/helpers";

const CustomerAccountChart = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedYear, setSelectedYear] = useState("current_year");
   console.log('selected year' , selectedYear)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    handleClose();
  };

  const menuItems = [
    { name: "Current year", flow: "current_year", id: "current_year" },
    { name: "Last year", flow: "last_year", id: "last_year" },
  ];

  return (
    <Grid item container mt={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography>
                Cash Flow{" "}
                <HoverPopover text="Total Cash">
                  <HelpOutlineIcon />
                </HoverPopover>
              </Typography>

              <Button
                onClick={handleClick}
                sx={{
                  color: "#9b9494ed",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              >
                {snakeCaseToPrettyText(selectedYear)} <ArrowDropDownIcon />
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem key={item.id} onClick={() => handleYearChange(item.flow)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
            <Divider />
          </CardContent>
          <ChartContent selectedYear={selectedYear} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomerAccountChart;
