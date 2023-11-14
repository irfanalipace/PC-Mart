import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import TemplateTable from "../ViewTemplate/TemplateTable";

function TableAccordian({ data, columns, title }) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDropDown />}
        aria-controls='panel2a-content'
        id='panel2a-header'>
        <Typography variant='body1'>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid item container>
          <TemplateTable data={data} columns={columns} />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default TableAccordian;
