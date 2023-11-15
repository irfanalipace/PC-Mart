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
import DataTable from "../../Components/DataTable/DataTable";
import TableContainer from "../../Components/Containers/TableContainer";
import { getReadyItems } from "../../../core/api/readyItems";
import { getBatchNumber } from "../../../core/api/batchNumber";

const ReadyItemsTable = () => {
  const [refresh, setRefresh] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [batchList, setBatchList] = useState([]);
  const [bathcNumber, setBatchNumber] = useState(null);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setRefresh((prev) => prev + 1);
  };

  const intialColumns = [
    {
      accessorKey: "make",
      header: "Batch No",
      Cell: ({ row }) => <>{row?.original?.file?.batch_number}</>,
    },
    {
      accessorKey: "serial_number",
      header: "Serial No",
    },
    {
      accessorKey: "make",
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
  ];
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
        <Grid item>
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
                      <IconButton>
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
                  <form onSubmit={(e) => handleSearchChange(e)}>
                    <TextField
                      id='search'
                      label='Search'
                      variant='outlined'
                      fullWidth
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <SearchIcon
                            sx={{ color: "action.active", mr: 1, my: 0.5 }}
                          />
                        ),
                      }}
                    />
                  </form>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel id='dropdown-label'>Batch No</InputLabel>
                    <Select
                      labelId='dropdown-label'
                      id='dropdown'
                      label='Select an Option'
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
              api={(e) => getReadyItems(e, bathcNumber, searchText)}
              columns={intialColumns}
              setSelectedRows={setSelectedRows}
              onRowClick={() => {}}
              // collapsed={viewItem}
              refresh={refresh}
            />
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default ReadyItemsTable;
