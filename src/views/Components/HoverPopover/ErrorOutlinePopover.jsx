import React from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';
const HoverPopover = ({ text }) => {
  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 200,
      backgroundColor:'#000',
      padding:'10px !important',
    },
  });
  return (
    <>
      <CustomWidthTooltip title={text} arrow placement="right">
        <ErrorOutlineIcon sx={{ color: 'grey', fontSize: '15px', margin: '0px 0 -1px 5px' }} />
      </CustomWidthTooltip>
    </>
  );
};
export default HoverPopover;
