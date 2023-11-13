import React, { useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";

import notyf from "../../Components/NotificationMessage/notyfInstance";
import {
  Box,
  IconButton,
  Grid,
  Stack,
  Typography,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import HeaderPaper from "../../Components/Containers/HeaderPaper";
import { Download } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { getUploadFile } from "../../../core/api/fileupload";
import { useNavigate } from "react-router-dom";
import DataTable from "../../Components/DataTable/DataTable";
import TableContainer from "../../Components/Containers/TableContainer";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import MUIButton from "../../Components/Button/MUIButton";
import { importItemsFile } from "../../../core/api/readyItems";

const FileUploadTable = () => {
  const [viewItem, setViewItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [selectedValue, setSelectedValue] = useState("");
  const [file, setFile] = useState(null);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    setFileName(file?.name);
    reader.onloadend = () => {};

    reader.readAsDataURL(file);
  };

  const intialColumns = [
    {
      accessorKey: "file_name",
      header: "File Name",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: "upload_date",
      header: "Upload Date, Time",
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },

    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => (
        <TableCell
          style={{
            color: getColorForStatus(row.original.status),
            border: "none",
            background: "none",
          }}
        >
          <Typography>{row.original.status}</Typography>
        </TableCell>
      ),
    },
    {
      accessorKey: "batch_no",
      header: "Batch No",
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
          <IconButton variant='outlined'></IconButton>

          <MUIButton>
            <Download />
          </MUIButton>
        </Box>
      ),
    },
  ];

  const getColorForStatus = (status) => {
    switch (status) {
      case "error":
        return "red";
      case "pending":
        return "#ED6C02";
      case "processing":
        return "#2196F3";
      case "processed":
        return "#2E7D32";
      default:
        return "black"; // or any default color
    }
  };

  const [columns, setColumns] = useState(intialColumns);

  const importFile = async () => {
    try {
      setLoading(true);
      await importItemsFile(file);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
                        Upload Inventory File
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
                  >
                    <Box sx={{ margin: "12px" }}>
                      <MUIButton sx={{ padding: "6px" }}>
                        <Download />
                        Download
                      </MUIButton>
                    </Box>
                  </Grid>
                </>
                <Grid
                  item
                  sm={12}
                  direction='row'
                  display='flex'
                  alignItems='center'
                  spacing={0}
                >
                  <Stack sx={{ marginTop: "22px" }}>
                    <label htmlFor='upload-image'>
                      <Button
                        variant=''
                        component='span'
                        sx={{ border: "1px solid #1976d2", color: "#1976d2" }}
                      >
                        CHOOSE FILE
                      </Button>
                      <input
                        id='upload-image'
                        hidden
                        accept='/*'
                        type='file'
                        onChange={handleFileUpload}
                      />
                      &ensp;
                      {fileName && <>{fileName}</>}
                    </label>
                  </Stack>
                </Grid>
                <Grid
                  item
                  sm={12}
                  direction='row'
                  display='flex'
                  alignItems='center'
                  spacing={0}
                >
                  <Stack sx={{ marginTop: "22px", marginBottom: "12px" }}>
                    <Button
                      variant='contained'
                      onClick={importFile}
                      disabled={!file || loading}
                    >
                      {loading ? <CircularProgress size={25} /> : "IMPORT FILE"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            )}
          </HeaderPaper>
          <TableContainer>
            <Grid item container>
              <>
                <Grid item sm={6} display='flex' alignItems='center'>
                  <Stack
                    direction='row'
                    display='flex'
                    alignItems='center'
                    spacing={0}
                  >
                    <Typography
                      variant='h6'
                      component='span'
                      sx={{ padding: "24px" }}
                    >
                      Uploaded Inventory Files
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
                >
                  <Box sx={{ width: "400px", marginRight: "22px" }}>
                    <FormControl fullWidth>
                      <InputLabel id='dropdown-label'>Batch No</InputLabel>
                      <Select
                        labelId='dropdown-label'
                        id='dropdown'
                        value={selectedValue}
                        label='Select an Option'
                        onChange={handleChange}
                      >
                        <MenuItem value=''>
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value='option1'>Option 1</MenuItem>
                        <MenuItem value='option2'>Option 2</MenuItem>
                        <MenuItem value='option3'>Option 3</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </>
            </Grid>
            <DataTable
              api={getUploadFile}
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

export default FileUploadTable;
