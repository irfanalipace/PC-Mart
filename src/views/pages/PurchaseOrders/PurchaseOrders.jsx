import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// mui
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  IconButton,
  List,
  Menu,
  MenuItem,
  Stack,
  TableContainer,
  Typography,
} from "@mui/material";
// icons
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Mail } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";

// common
import HeaderPaper from "../../Components/Containers/HeaderPaper";
import MUIButton from "../../Components/Button/MUIButton";
import DataTable from "../../Components/DataTable/DataTable";

import { allPurchaseOrderApi } from "../../../core/api/purchase";
import ViewPurchase from "./ViewPurchase";
import {
  StatusColor,
  extractNumberFromHash,
  formatDate,
  generateEncryptedID,
  snakeCaseToPrettyText,
} from "../../../core/utils/helpers";
import useHash from "../../../core/hooks/useHash";
import ImportFileModal from "../../Components/ImportFileModal/ImportFileModal";
import ExportFileModal from "../../Components/ExportFileModal/ExportFileModal";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import DetailViewContainer from "../../Components/Containers/DetailViewContainer";
// apis
const purchaseMenu = [
  {
    name: "All Purchase Order",
    id: "all",
  },
  {
    name: "All",
    id: "all",
  },
  {
    name: "Invoiced",
    id: "invoiced",
  },
  {
    name: "Reimbursed",
    id: "reimbursed",
  },
  {
    name: "Billable",
    id: "Billable",
  },

  {
    name: "Non-Billable",
    id: "customer_view",
  },
  {
    name: "With Receipts",
    id: "Receipts1",
  },

  {
    name: "Without Receipts",
    id: "invoiced",
  },
];

const PurchaseOrders = () => {
  const intialColumns = [
    {
      accessorKey: "date",
      header: "Date",
      Cell: ({ cell }) => {
        const data = cell.getValue();
        const formatedDate = formatDate(data);
        return (
          <Box component='span' sx={{}}>
            {formatedDate}
          </Box>
        );
      },
    },
    {
      accessorKey: "purchase_order",
      header: "Purchase Order",
      Cell: ({ renderedCellValue, row }) => (
        <Typography color='primary'>{renderedCellValue}</Typography>
      ),
    },
    // {
    // 	accessorKey: 'reference',
    // 	header: 'Reference',
    // },

    {
      accessorKey: "vendor_name",
      header: "Vendor Name",
      //   Cell: ({ cell }) => {
      //     const name = cell.getValue();
      //     return (
      //       <Box component='span' sx={{}}>
      //         {name}
      //       </Box>
      //     );
      //   }
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const estStatusColor = StatusColor(status);

        return (
          <Box
            component='span'
            sx={{
              color: estStatusColor,
              borderRadius: "0.25rem",
              textTransform: "capitalize",
            }}>
            {snakeCaseToPrettyText(status)}
          </Box>
        );
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment Status",
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const estStatusColor = StatusColor(status);

        return (
          <Box
            component='span'
            sx={{
              color: estStatusColor,
              borderRadius: "0.25rem",
              textTransform: "capitalize",
            }}>
            {snakeCaseToPrettyText(status)}
          </Box>
        );
      },
    },

    {
      accessorKey: "amount",
      header: "Amount",
    },

    // {
    //   accessorKey: 'actions',
    //   header: 'Actions',
    //   enableColumnActions: false,
    //   enableColumnFilter: false,
    //   enableColumnOrdering: false,
    //   enableSorting: false,
    //   Cell: ({ renderedCellValue, row }) => <Actions id={row?.original?.id} />
    // }
    {
      accessorKey: "expected_deleivery_date",
      header: (
        <span style={{ whiteSpace: "nowrap" }}>Expected Delivery Date</span>
      ),
      Cell: ({ cell }) => {
        const formatedDate = formatDate(cell.getValue());
        return (
          <Box component='span' sx={{ whiteSpace: "nowrap" }}>
            {formatedDate}
          </Box>
        );
      },
    },
  ];

  const collapsedColumns = [
    {
      accessorKey: "vendor_name",
      header: "",
      Cell: ({ row }) => {
        const wholedata = row?.original;
        // const customer = wholedata?.customer;
        const estStatusColor = StatusColor(wholedata.status);

        return (
          <Box>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid item x={6}>
                <Typography variant='subtitle2'>
                  {wholedata?.vendor_name}
                </Typography>
                <Typography
                  component='span'
                  sx={{ fontSize: "12px", color: "#2196F3" }}>
                  {wholedata?.reference}
                </Typography>
                <Typography component='span' sx={{ fontSize: "12px" }}>
                  {" "}
                  | {formatDate(wholedata?.date)}
                </Typography>
              </Grid>
              <Grid item x={6} sx={{ textAlign: "right" }}>
                <Typography variant='body2'>
                  ${wholedata?.amount || 0}
                </Typography>
                <Typography variant='caption' sx={{ color: estStatusColor }}>
                  {snakeCaseToPrettyText(wholedata?.status) || "--"}
                </Typography>
                <IconButton sx={{ paddingRight: "0" }}>
                  {" "}
                  <Mail sx={{ fontSize: "15px" }} />{" "}
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        );
      },
    },
  ];
  const [selectedRows, setSelectedRows] = useState([]);
  const [purchaseDropdown, setPurchaseDropDown] =
    useState("All Purchase Order");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterMenu, setFilterMenu] = useState(null);

  const [columns, setColumns] = useState(intialColumns);
  const [viewPurchase, setPurchaseVw] = useState(false);
  const [id, setId] = useState(null);
  const [hash, setHash] = useHash();
  const [refresh, setRefresh] = useState(0);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // select purchase menut item
  const selectingPurchase = (e, id) => {
    const filtered = purchaseMenu.find((item) => item.id === id);
    setPurchaseDropDown(filtered.name);
  };

  //   new section
  const showingMenu = (event) => {
    setFilterMenu(event.currentTarget);
  };

  const hidingMenu = () => {
    setFilterMenu(null);
  };
  //   view purchase
  useEffect(() => {
    const id = extractNumberFromHash(hash);
    if (id) {
      setColumns(collapsedColumns);
      setPurchaseVw(true);
    } else {
      setColumns(intialColumns);
      setPurchaseVw(false);
    }
  }, [hash]);

  const handleRowClick = (row) => {
    setHash("#/" + generateEncryptedID(row.id));
  };
  //   view menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuAnchorE2, setMenuAnchorE2] = useState(null);
  const [bulkActionOpen, setbulkActionOpen] = useState(null);

  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuAnchorE2(event.currentTarget);
  };
  const openBulk = (event) => {
    setbulkActionOpen(event.currentTarget);
  };
  const clickPurchase = (event) => {
    setMenuAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
    setMenuAnchorEl(null);
    setbulkActionOpen(null);
  };

  //   purchase filter
  const openPurchaseFilter = (e) => {
    if (selectedRows.length === 0) {
      setMenuAnchorEl(e.currentTarget);
    }
  };
  console.log("selectedRows", selectedRows);

  // bulk delete
  const handleBulkDelete = () => {
    // const selectedRowIds = selectedRows.map(row => Number(row));
  };

  //   styles
  const headerIconButton = {
    backgroundColor: "#EEEEEE",
    border: "1px solid #d1d1d1",
    borderRadius: "8px",
    textTransform: "none",
    padding: "6px 16px",
  };

  return (
    <Grid container>
      <Grid item sm={viewPurchase ? 3.5 : 12}>
        <HeaderPaper>
          {selectedRows.length > 0 && (
            <Grid item container>
              {/* pgae header / when checkbox selected  */}
              <Grid item sm={12}>
                <Grid item container>
                  <Grid
                    item
                    sm={10}
                    sx={{ display: "flex", alignItems: "center" }}>
                    <Stack
                      direction='row'
                      display='felx'
                      alignItems='center'
                      spacing={2}
                      p={0}>
                      <Button
                        size='large'
                        onClick={openBulk}
                        sx={{
                          ...headerIconButton,
                          background: "white",
                          color: "#2196F3",
                        }}>
                        Bulk Actions
                        <ArrowDropDownIcon />
                      </Button>
                      <Menu
                        anchorEl={bulkActionOpen}
                        open={Boolean(bulkActionOpen)}
                        onClose={handleClose}>
                        <MenuItem>Bulk Update</MenuItem>
                        <MenuItem>Mark As Issued</MenuItem>
                        <MenuItem>Bulk cancel items</MenuItem>
                        <MenuItem>Bulk reopen cancel item</MenuItem>
                        <MenuItem>Convert to Bill</MenuItem>
                      </Menu>
                      {viewPurchase ? (
                        <>
                          <IconButton
                            onClick={handleClick}
                            sx={{
                              ...headerIconButton,
                              background: "white",
                              padding: "5px 3px",
                            }}>
                            <MoreHorizIcon />
                          </IconButton>

                          <Menu
                            anchorEl={menuAnchorEl}
                            open={Boolean(menuAnchorEl)}
                            onClose={handleClose}>
                            <MenuItem>
                              <Typography variant='body2'>Send Mail</Typography>
                            </MenuItem>
                            <MenuItem>
                              <Typography variant='body2'>
                                Print as pdf
                              </Typography>
                            </MenuItem>
                            <MenuItem>
                              <Typography variant='body2'>Print</Typography>
                            </MenuItem>
                            <MenuItem>
                              <Typography variant='body2'>Delete</Typography>
                            </MenuItem>
                          </Menu>
                        </>
                      ) : (
                        <>
                          <Stack
                            direction='row'
                            spacing={1}
                            display='flex'
                            alignItems='center'>
                            <MUIButton
                              variant='outlined'
                              sx={{
                                ...headerIconButton,
                                background: "white",
                              }}>
                              <Mail />
                            </MUIButton>
                            <MUIButton
                              variant='outlined'
                              sx={{
                                ...headerIconButton,
                                background: "white",
                              }}>
                              <PictureAsPdfIcon />
                            </MUIButton>
                            {/* <MUIButton
															variant='outlined'
															sx={{
																...headerIconButton,
															}}>
															<PrintIcon />
														</MUIButton> */}

                            <MUIButton
                              variant='outlined'
                              sx={{
                                ...headerIconButton,
                                background: "white",
                              }}
                              onClick={() => {
                                setOpenConfirmDialog(true); // Open the confirmation dialog
                                setDialogProps({
                                  onConfirm: handleBulkDelete,
                                });
                              }}>
                              <DeleteIcon />
                            </MUIButton>
                          </Stack>
                        </>
                      )}

                      <Menu
                        //   anchorEl={showMenuItem}
                        //   open={Boolean(showMenuItem)}
                        onClose={hidingMenu}>
                        <MenuItem
                          sx={{ padding: "2px 4px", borderRadius: "4px" }}>
                          <MUIButton size='medium' fullWidth>
                            Delete
                          </MUIButton>
                        </MenuItem>
                      </Menu>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    sm={2}
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}>
                    <IconButton onClick={() => setRefresh((prev) => prev + 1)}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          {selectedRows.length === 0 && (
            <Grid item container>
              <Grid item xs={7} display='flex' alignItems='center'>
                <Typography variant='h6' component='span'>
                  All Purchase Orders
                </Typography>
              </Grid>
              <Grid
                item
                xs={5}
                display='flex'
                alignItems='center'
                justifyContent='flex-end'>
                <Stack spacing={1} direction='row'>
                  <MUIButton
                    size='medium'
                    router
                    sx={{ padding: "6px 16px" }}
                    component={RouterLink}
                    // to='/purchase/new'
                  >
                    <AddIcon fontSize='small' /> New
                  </MUIButton>
                  <IconButton
                    sx={{ ...headerIconButton, padding: "5px 3px" }}
                    onClick={openPurchaseFilter}>
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleClose}>
                    {/* <Box my={1}>
											<MenuItem disabled>Sort by</MenuItem>
											<MenuItem>Created Date</MenuItem>
											<MenuItem>Date</MenuItem>

											<MenuItem>Purchase Order</MenuItem>
											<MenuItem>Vendor Name</MenuItem>
											<MenuItem>Amount</MenuItem>
											<MenuItem>Expected Delivery</MenuItem>
											<MenuItem>Last Modified Time</MenuItem>
											<Divider />
										</Box> */}

                    <Box>
                      <MenuItem onClick={() => setOpenImport(true)}>
                        <FileDownloadOutlinedIcon color='primary' />{" "}
                        <Typography component='span' mx={1}>
                          Import Purchase Orders
                        </Typography>
                      </MenuItem>
                      <MenuItem onClick={() => setOpenExport(true)}>
                        <UploadFileIcon color='primary' />{" "}
                        <Typography component='span' mx={1}>
                          Export Purchase Orders
                        </Typography>
                      </MenuItem>
                      <Divider />
                      {/* <MenuItem>
												<UploadFileIcon color='primary' />{' '}
												<Typography component='span' mx={1}>
													Export Current View
												</Typography>
											</MenuItem>
											<Divider />
											<MenuItem>
												<SettingsIcon color='primary' />{' '}
												<Typography component='span' mx={1}>
													Export Current View
												</Typography>
											</MenuItem> */}
                    </Box>
                  </Menu>
                </Stack>
              </Grid>
            </Grid>
          )}
        </HeaderPaper>
        <TableContainer>
          <DataTable
            columns={viewPurchase ? collapsedColumns : intialColumns}
            api={allPurchaseOrderApi}
            setSelectedRows={setSelectedRows}
            onRowClick={handleRowClick}
            refresh={refresh}
            collapsed={viewPurchase}
          />
        </TableContainer>
      </Grid>
      {viewPurchase && (
        <Grid sm={8.5}>
          <DetailViewContainer>
            <ViewPurchase
              id={id}
              setRefresh={setRefresh}
              setPurchaseVw={setPurchaseVw}
            />
          </DetailViewContainer>
        </Grid>
      )}
      <ConfirmDialog
        title='Are you sure you want to delete'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />

      <ImportFileModal
        isOpen={openImport}
        onClose={() => setOpenImport(false)}
        // ImportTypeEnum={ImportTypeEnum}
        // importApi={importEstimate}
        setRefresh={setRefresh}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        // exportApi={exportEstimate}
      />
    </Grid>
  );
};

export default PurchaseOrders;
