import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
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

import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useNavigate } from "react-router-dom";
import DataTable from "../../Components/DataTable/DataTable";
import TableContainer from "../../Components/Containers/TableContainer";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import { getReadyItems } from "../../../core/api/readyItems";
import { getBatchNumber } from "../../../core/api/batchNumber";

const ReadyItemsTable = () => {
  const [viewItem, setViewItem] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [selectedValue, setSelectedValue] = useState("option1");
  const [searchText, setSearchText] = useState("");
  const [batchList, setBatchList] = useState([]);
  const [bathcNumber, setBatchNumber] = useState(null);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    // Add any additional logic you need based on the search text
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const navigate = useNavigate();

  const intialColumns = [
    {
      accessorKey: "make",
      header: "Batch No",
    },
    {
      accessorKey: "serial_number",
      header: "Serial No",
    },
    {
      accessorKey: "type",
      header: "Make",
    },
    {
      accessorKey: "model",
      header: "Model",
    },
    {
      accessorKey: "cpu",
      header: "CPU",
    },
    {
      accessorKey: "ram",
      header: "RAM",
    },
    {
      accessorKey: "hdd",
      header: "HDD",
    },
    {
      accessorKey: "price",
      header: "Price",
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
          <IconButton variant='outlined'></IconButton>
        </Box>
      ),
    },
  ];

  const [columns, setColumns] = useState(intialColumns);
  useEffect(() => {
    fetchBatchNumbers();
  }, []);
  const fetchBatchNumbers = async () => {
    try {
      const resp = await getBatchNumber();
      setBatchList(resp?.data);
    } catch (err) {}
  };
  return (
    <>
      <Grid container>
        <Grid item sm={viewItem ? 3 : 12}>
          <HeaderPaper sx={{ padding: "10px 20px" }}>
            {selectedRows?.length > 0 && (
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
            {selectedRows?.length === 0 && (
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
                        Ready Items
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
            <Box sx={{ padding: "23px" }}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    id='search'
                    label='Search'
                    variant='outlined'
                    fullWidth
                    value={searchText}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon
                          sx={{ color: "action.active", mr: 1, my: 0.5 }}
                        />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel id='dropdown-label'>Batch No</InputLabel>
                    <Select
                      labelId='dropdown-label'
                      id='dropdown'
                      value={selectedValue}
                      label='Select an Option'
                      onChange={handleChange}
                    >
                      <MenuItem
                        onClick={() => {
                          setBatchNumber(null);
                          setRefresh((prev) => prev + 1);
                        }}
                      >
                        All Ready Items
                      </MenuItem>
                      {batchList?.map((row) => (
                        <MenuItem
                          value={row?.id}
                          onClick={() => {
                            setBatchNumber(row?.batch_number);
                            setRefresh((prev) => prev + 1);
                          }}
                        >
                          {row?.batch_number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <DataTable
              api={(e) => getReadyItems(e, bathcNumber)}
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

export default ReadyItemsTable;
