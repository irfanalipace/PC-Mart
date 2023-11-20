import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
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

import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import DataTable from "../../Components/DataTable/DataTable";
import TableContainer from "../../Components/Containers/TableContainer";
import { getReadyItems, getSolditems } from "../../../core/api/readyItems";
import { getBatchNumber } from "../../../core/api/batchNumber";

const SoldItems = () => {
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
      accessorKey: "file.batch_number",
      header: "Batch No",
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
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Grid container>
        <Grid item sm={12}>
          <HeaderPaper sx={{ padding: "10px 20px" }}>
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
                      Sold Items
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
                          key={row?.id}
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
              api={(e) => getSolditems(e, bathcNumber, searchText)}
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

export default SoldItems;
