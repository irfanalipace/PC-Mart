import React, { useState } from "react";

import {
  Box,
  IconButton,
  Grid,
  TextField,
  Stack,
  Typography,
  MenuItem,
} from "@mui/material";

import HeaderPaper from "../../Components/Containers/HeaderPaper";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import DataTable from "../../Components/DataTable/DataTable";
import TableContainer from "../../Components/Containers/TableContainer";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import { getNonReadyItems } from "../../../core/api/readyItems";

const ItemsTable = () => {
  const [viewItem, setViewItem] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const navigate = useNavigate();

  const intialColumns = [
    {
      accessorKey: "make",
      header: "Batch No",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: "serial_number",
      header: "Serial No",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: "type",
      header: "Make",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: "model",
      header: "Model",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: "cpu",
      header: "CPU",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: "ram",
      header: "RAM",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: "hdd",
      header: "HDD",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: "price",
      header: "Price",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: " ",
      header: "ACTIONS",
      enableColumnActions: false,
      enableColumnFilter: false,
      enableColumnOrdering: false,
      enableSorting: false,
      size: 200,
      Cell: ({ row }) => (
        <Box>
          <IconButton variant='outlined'>
            {/* <Delete sx={{ color: 'red' }} fontSize='small' /> */}
          </IconButton>
        </Box>
      ),
    },
  ];

  const [columns, setColumns] = useState(intialColumns);

  return (
    <>
      <Grid container>
        <Grid item sm={viewItem ? 3 : 12}>
          <HeaderPaper sx={{ padding: "10px 20px" }}>
            {selectedRows.length > 0 && (
              <Grid item container>
                <Grid item sm={12}>
                  <Grid item container>
                    <Grid item sm={6} display='flex' alignItems='center'>
                      {/* <Button>Delete</Button> */}
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        onClick={() =>
                          viewItem
                            ? navigate(`/conditions`)
                            : setRefresh((prev) => prev + 1)
                        }
                      >
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {selectedRows.length === 0 && (
              <Grid item container>
                <>
                  <Grid item sm={6} display='flex' alignItems='center'>
                    <Stack
                      direction='row'
                      display='flex'
                      alignItems='center'
                      spacing={0}
                    >
                      <Typography variant='h6' component='span'>
                        Non Ready Items
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    sm={6}
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  ></Grid>
                </>
              </Grid>
            )}
          </HeaderPaper>

          <TableContainer>
            <DataTable
              api={getNonReadyItems}
              columns={columns}
              setSelectedRows={setSelectedRows}
              onRowClick={() => {}}
              collapsed={viewItem}
              refresh={refresh}
            />
          </TableContainer>
        </Grid>
      </Grid>
      <ConfirmDialog
        title='Are you sure you want to delete'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </>
  );
};

export default ItemsTable;
