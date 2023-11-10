import React, { useEffect, useState } from "react";
import cvs from "../../../../public/assets/cvs.png";
import xlsx from "../../../../public/assets/xlsx.png";
// import Logo from "../../../../assets/";
import Logo from "../../../../src/assets/images/logos/computer.png";
import vector from "../../../../src/assets/images/Vector.png";
import { Link as RouterLink } from "react-router-dom";

import pdf from "../../../../public/assets/pdf.jpg";

import { useTheme } from "@mui/material/styles";
import {
	Button,
  CircularProgress,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  colors,
  useMediaQuery,
} from "@mui/material";
// mui components  && icon
import { Grid, Stack, Divider, Typography } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import OutboxIcon from "@mui/icons-material/Outbox";
// components
// common components
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// styles
import { Box, fontWeight, margin, textTransform } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";

import MUIButton from "../../Components/Button/MUIButton";
import HeaderPaper from "../../Components/Containers/HeaderPaper";
import notyf from "../../Components/NotificationMessage/notyfInstance";
import { TableBodyCell, TableHeadCell } from "../../Components/Table/Table";
import HoverPopover from "../../Components/HoverPopover/ErrorOutlinePopover";
import AttachmentCard from "../../Components/FileUpload/AttachmentCard";
import ViewTemplates from "../../Components/ViewTemplate/ViewTemplates";
import TableAccordian from "../../Components/TableAccordian/TableAccordian";

const ViewPurchase = ({ id, setRefresh }) => {
  const navigate = useNavigate();

  const [estimateSubComponent, setEstimateSubComponent] = useState(true);
  const [estimateEmailOpen, setEstimateEmailOpen] = useState(false);
  const [estimateFiles, setEstimatedFiles] = useState([]);
  const [estimateData, setEstimateData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [openBill, setOpenBill] = useState(false);
  const [showMenuItem, setShowMenu] = useState(null);
  const [files, setFiles] = useState([]);

  const handleEstimateSubComp = () => {
    setEstimateSubComponent(true);
    setEstimateEmailOpen(false);
  };

  const handleSendMail = () => {
    setEstimateEmailOpen(true);
    setEstimateSubComponent(false);
  };

  const showingMenu = (event) => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };

  // single estimate / show estimate / view
  useEffect(() => {
    fetchingSingleEstimate();
  }, [id]);

  const fetchingSingleEstimate = async () => {
    try {
      const resp = await showEstimateApi(id);
      console.log("respdataaaa", resp);
      setEstimateData(resp?.data);
      setEstimatedFiles(resp?.data?.estimate_files);
    } catch (error) {}
  };

  // handling attachments files
  const handleFileInputChange = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const newFiles = Array.from(files);
      // console.log("newFiles", newFiles);
      submitFilesToApi(newFiles);
    }
  };
  const submitFilesToApi = async (newFiles) => {
    try {
      //   const resp = await addEstimatesFileApi({
      //     attachments: newFiles,
      //     estimate_id: id
      //   });
      fetchingSingleEstimate();

      // setEstimatedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.log("error", error);
    }
  };

  // const deleteFile = (file) => {
  //   setEstimatedFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  // };
  const deleteFile = async (id) => {
    try {
      //   const resp = await deleteEstimateFielsApi(id);
      notyf.success(resp.message);
      fetchingSingleEstimate();
    } catch (error) {}
  };
  // mails menu
  const [emailMenuAnchor, setEmailMenuAnchor] = useState(null);

  const openEmailMenu = (event) => {
    setEmailMenuAnchor(event.currentTarget);
  };

  const closeEmailMenu = () => {
    setEmailMenuAnchor(null);
  };

  // main page open
  const handleSendEstimateMain = (id) => {
    navigate(`/send/email/price-quote/${id}`);
  };

  // invoice conversion
  const convertingToSaleOrder = async (id) => {
    try {
      setIsLoading(true);
      const resp = await convertToSaleOrderApi({ id });
      notyf.success(resp?.message);
      navigate("/sales-orders");
      setRefresh((prev) => prev + 1);
    } catch (error) {}
    setIsLoading(false);
  };

  const [fileUrl, setFileUrl] = useState("");
  const handlePdf = async () => {
    try {
      const resp = await downloadEstimateApi({ id });
      console.log("resp", resp);
      // downloadFile(resp.data.url)
      window.open(resp?.data?.url, "_blank");
    } catch (error) {}
  };

  const columns = [
    { id: "", label: "No.", key: "index" },
    { id: "", label: "Items Decription", key: "item_name" },
    { id: "", label: "Qty", key: "quantity" },
    { id: "", label: "Rate(USD)", key: "rate" },
    { id: "", label: "Amount(USD)", key: "total" },
  ];

  const info = [
    { label: "Purchase Order:", value: "123344455555555" },
    {
      label: "Purchase Order Date:",
      value: "--",
    },
    {
      label: "Invoice Ref#:",
      value: "--",
    },
    {
      label: "Delivery Date:",
      value: "--",
    },
  ];

  //   bill to
  const tbCols = [
    { id: "", label: "No.", key: "index" },

    { id: "", label: "Bill", key: "bill" },
    { id: "", label: "Date", key: "status" },
    { id: "", label: "Due Date", key: "due_date" },
    { id: "", label: "Amount", key: "amount" },
    { id: "", label: "Balance Due", key: "balance_due" },
  ];

  const tbData = [
    {
      bill: "--",
      status: "--",
      due_date: "--",
	  amount:"--" ,
	  balance_due:''
    },
  ];

  const typoStyle = {
    color: "#333333",
    fontSize: "11pt",
    fontWeight: 400,
  };
  const tbCellStyle = {
    padding: 1,
  };

  const tableTitle1 = {
    fontWeight: 450,
    fontSize: "14px",
  };
  const tableTitle2 = {
    fontWeight: 400,
    fontSize: "12px",
    marginTop: "2px",
    textAlign: "end",
  };

  return (
    <Box sx={{ padding: "0 1rem" }}>
      <HeaderPaper>
        <Grid item container>
          {/* view header left  */}
          <Grid sm={6} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant='h6'>
              MN-PQ-{estimateData?.estimate_number}
            </Typography>
          </Grid>
          {/* view header right  */}
          <Grid
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
            <MUIButton
              onClick={showingMenu}
              variant='outlined'
              sx={{
                fontSize: "12px",
                textTransform: "capitalize",
                margin: "0 8px",
              }}
              startIcon={<AttachmentOutlinedIcon />}>
              Attachments
            </MUIButton>
            <AttachmentCard
              hidingMenu={hidingMenu}
              showMenuItem={showMenuItem}
            />

            <IconButton onClick={() => navigate(-1)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderPaper>
      <Grid item sm={12}>
        <Paper sx={{ padding: "1.5rem" }}>
          <MUIButton
            startIcon={<EditIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            router
            to={`/price-quote/edit/${id}`}>
            Edit
          </MUIButton>

          <MUIButton
            startIcon={<EmailOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={openEmailMenu}>
            Mails
          </MUIButton>
          <Menu
            anchorEl={emailMenuAnchor}
            open={Boolean(emailMenuAnchor)}
            onClose={closeEmailMenu}>
            <MenuItem
              onClick={() => {
                closeEmailMenu();
                handleSendEstimateMain(id);
              }}>
              <MUIButton>Send Mail</MUIButton>
            </MenuItem>
          </Menu>

          <MUIButton
            startIcon={<ShareOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}>
            Share
          </MUIButton>
          <MUIButton
            startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={handlePdf}>
            Pdf/Print
          </MUIButton>
        </Paper>
      </Grid>
      <Paper sx={{ marginTop: "1rem" }}>
        <Grid item container>
          <Grid item sm={12} my={3}>
            <TableAccordian title='Bill 1' data={tbData} columns={tbCols} />
          </Grid>
        </Grid>
        <Box mt={3} mb={3} paddingX={2} paddingY={3}>
          <ViewTemplates
            title='Purchase Orders'
            columns={columns}
            headerInfo={info}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewPurchase;

const BtnStyles = {
  margin: "0 .2rem",
};
