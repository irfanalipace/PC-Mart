import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  Menu,
  MenuItem,
  ListItemText,
  Button,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import AddressForm from "../AddressForm/AddressForm";
import Modal from "../../Modal/Dialog";
import { Stack } from "@mui/system";
import MUIButton from "../../Button/MUIButton";
import { markAddressDefaultApi } from "../../../../core/api/estimate";
import notyf from "../../NotificationMessage/notyfInstance";

const Address = ({
  customer_billing_address,
  billing,
  shipping,
  gettingCustomerList,
  customer_id,
  customerList,
  selectedCustomer,
}) => {
  // const [billingAddressOpen, setBillingAddressOpen] = useState(null);
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressType, setAddressType] = useState("");


  // const handleClose = () => {
  //   setBillingAddressOpen(null);
  // };

  const handleAddAddressForm1 = (addressType) => {
    setAddressFormOpen(!addressFormOpen);
    setAddressType(addressType);
  };

  const handleAddAddressForm = (address) => {
    setAddressFormOpen(!addressFormOpen);
    if (address?.id) {
      setSelectedAddress(address);
      setIsEdit(true);
    }

    // setIsEdit(true)
    // setAddAddressOpen(!addAddressOpen);
    // setIsEdit(false);
    // setSelectedAddress(null);
  };

  // const handleBillingEdit = (address) => {
  //   setIsEdit(true);
  //   setAddAddressOpen(!addAddressOpen);
  //   setSelectedAddress(address);
  // };

  // open address menu list
  const handleAddressMenu = (event, type) => {
    setAnchorEl(event.currentTarget);
    setAddressType(type);
  };

  // close  address menu list
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAddress(null);
  };

  // const handleAddItem = () => {
  //   // Handle the "Add Item" button click here
  // };

  // setting default address for customer (country , phone , fax zipcod etc)
  useEffect(() => {
    const defaultAddress = customer_billing_address?.filter(
      (list) => list.is_default === 1
    );
    setDefaultAddress(
      defaultAddress?.map((address) => (
        <Box
          key={address.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}>
          <Typography variant='caption'>{address.country_name}</Typography>
          <Typography variant='caption'>{address.phone}</Typography>
          <Typography variant='caption'>{address.address}</Typography>
          <Typography variant='caption'>{address.address2}</Typography>
          <Typography variant='caption'>{address.zipcode}</Typography>
          <Typography variant='caption'>{address.fax}</Typography>
        </Box>
      ))
    );
  }, [customer_id, customerList]);

  // billing and shipping title section (name / icon )
  const renderAddressSection = (addressName, addressType) => {
    return customer_billing_address?.length > 0 &&
      defaultAddress?.length == 1 ? (
      <>
        <Typography variant='body2Grey'>{addressName}</Typography>
        <IconButton
          onClick={(event) => handleAddressMenu(event, addressType)}
          sx={{ cursor: "pointer" }}>
          <EditOutlinedIcon fontSize='small' />
        </IconButton>
      </>
    ) : // when no address
    customer_billing_address?.length === 0 ? (
      <Box
        sx={{ marginTop: 1 }}
        display='flex'
        flexDirection='column'
        justifyContent='start'
        alignItems='start'>
        <Typography variant='body2Grey'>{addressName} </Typography>
        <MUIButton
          variant='text'
          onClick={() => {
            handleCloseMenu();
            handleAddAddressForm1(addressType);
          }}>
          Add New Address
        </MUIButton>
      </Box>
    ) : null;
  };

  const handleMarkAsDefualt = async (address) => {
    const updatedData = {
      id: address?.id,
      customer_id,
      type: address?.type,
    };
    try {
      const resp = await markAddressDefaultApi(updatedData);
      // console.log('rep' , resp?.message)
      notyf.success(resp?.message);
      gettingCustomerList();
    } catch (error) {
    } finally {
      handleCloseMenu();
    }
  };

  const title =
    isEdit && shipping
      ? "Shipping Address"
      : isEdit && billing
      ? "Billing Address"
      : "Addtional Address";

  // when customer removed from field
  if (selectedCustomer === null) {
    return null;
  }
  return (
    <>
      {/* // billing and shipping title section  */}
      {billing && renderAddressSection("BILLING ADDRESS", "billing")}
      {shipping && renderAddressSection("SHIPPING ADDRESS", "shipping")}
      {/* Default Address list  */}
      <Box>{defaultAddress}</Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 15, // arrow positionm
              right: 14,
              width: 15,
              height: 15,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}>
        <List sx={{ width: 400, maxHeight: 200, overflowY: "auto" }}>
          {customer_billing_address?.map((address, index) => (
            <React.Fragment key={index}>
              <MenuItem
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleMarkAsDefualt(address);
                }}>
                <Box width='100%' display='flex' justifyContent='flex-end'>
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();

                      handleCloseMenu();
                      handleAddAddressForm(address);
                    }}
                    sx={{ cursor: "pointer" }}>
                    <EditOutlinedIcon fontSize='small' />
                  </IconButton>
                </Box>
                <Typography variant='caption'>
                  {address.country_name}
                </Typography>
                <Typography variant='caption'>{address.phone}</Typography>
                <Typography variant='caption'>{address.address}</Typography>
                <Typography variant='caption'>{address.address2}</Typography>
                <Typography variant='caption'>{address.zipcode}</Typography>
                <Typography variant='caption'>{address.fax}</Typography>
              </MenuItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Divider />
        {/* "Add Item" button at the bottom of the menu */}
        <MenuItem sx={{ justifyContent: "center" }}>
          <MUIButton
            fullWidth
            onClick={() => {
              handleCloseMenu();
              handleAddAddressForm();
            }}
            variant='text'
            startIcon={<AddIcon />}>
            Add New Address
          </MUIButton>
        </MenuItem>
      </Menu>

      {/* Adding Address Modal */}
      <Modal
        title={title}
        open={addressFormOpen}
        onClose={handleAddAddressForm}
        sx={{
          position: "absolute",
          right: 20,
          top: 18,
        }}>
        {/* Adding Address Form */}
        {addressFormOpen && (
          <AddressForm
            onClose={handleAddAddressForm}
            addressFormOpen={addressFormOpen}
            type={addressType}
            address={isEdit && selectedAddress}
            customerList={customerList}
            customer_id={customer_id}
            onSave={gettingCustomerList}
          />
        )}
      </Modal>
    </>
  );
};

export default Address;
