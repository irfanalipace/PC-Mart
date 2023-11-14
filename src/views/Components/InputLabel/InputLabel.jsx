import React from "react";
import { Typography } from "@mui/material";

const InputLabel = ({ variant, sx, children, required, ...otherProps }) => {
  const labelStyle = required ? { color: "#d32f2f" } : {};
  return (
    <Typography
      variant={variant ? variant : "body2"}
      my=".3rem"
      sx={{ ...sx, ...labelStyle }}
      {...otherProps}
      // style={required && { color: "red" }}
    >
      {children}
    </Typography>
  );
};

export default InputLabel;
