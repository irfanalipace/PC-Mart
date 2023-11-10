import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DataTable from '../../../Components/DataTable/DataTable';
import pdf from '../../../../../public/assets/pdf.png';
import printer from '../../../../../public/assets/Printer.png';

import {
    bulkDeleteEstimatesApi,
    getAllEstimatesListApi,
    importEstimate,
    exportEstimate
} from '../../../../core/api/estimate';
import { Box } from '@mui/system';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsIcon from '@mui/icons-material/Settings';
import { getAllBillsApi } from '../../../../core/api/bills';
import {

    Cached,

} from '@mui/icons-material';
import {
    StatusColor,
    extractNumberFromHash,
    formatDate,
    snakeCaseToPrettyText
} from '../../../../core/utils/helpers';
import {
    Grid,
    Menu,
    MenuItem,
    Stack,
    Typography,
    IconButton,
    List,
    Divider,
    ButtonGroup,
    Button,
    styled
} from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfTwoTone';
import LocalPrintshopTwoToneIcon from '@mui/icons-material/LocalPrintshopTwoTone';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import DropdownMenuExample from '../../../Components/DropDown/DropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUIButton from '../../../Components/Button/MUIButton';
import { bulkDeleteCustomer } from '../../../../core/api/customer';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import useHash from '../../../../core/hooks/useHash';
import TestListViewDetails from '../../TestPages/TestListViewDetails';
import GridRow from '../../../Components/GridRow/GridRow';
import { Mail } from '@mui/icons-material';
import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../../Components/Containers/TableGrid';
import TableContainer from '../../../Components/Containers/TableContainer';
import DetailViewContainer from '../../../Components/Containers/DetailViewContainer';
import { Add } from '@mui/icons-material';
import Search from '@mui/icons-material/Search';
import BillDropDown from '../BillsTable/BillDropDown/BillDropDown';

import SearchBox from '../../../Components/SearchDialogBox/SearchBox';
import ViewBills from '../ViewBills/ViewBills';

const billsStatus = [
    {
        name: 'All Bills',
        id: 'all'
    },
    {
        name: 'Draft',
        id: 'draft'
    },
    {
        name: 'Pending Approval',
        id: 'pending_approval'
    },
    {
        name: 'Approved',
        id: 'approved'
    },
    {
        name: 'Sent',
        id: 'sent'
    },

    {
        name: 'Bill View',
        id: 'bill_view'
    },
    {
        name: 'Accepted',
        id: 'accepted'
    },

    {
        name: 'Invoiced',
        id: 'invoiced'
    },

    {
        name: 'Declined',
        id: 'declined'
    },
    {
        name: 'Expired',
        id: 'exppired'
    }
];

const BillsTable = () => {
    //    estimate number value
    const BillNumber = ({ children }) => {
        return (
            <Stack direction='row'>
                <span style={{ color: '#1E88E5' }}>{children}</span>
            </Stack>
        );
    };

    const [isExportDialogOpen, setExportDialogOpen] = useState(false);

    const handleExportClick = () => {
        setExportDialogOpen(true);
    };

    const handleExportDialogClose = () => {
        setExportDialogOpen(false);
    };


    const intialColumns = [
        {
            accessorKey: 'date',
            header: 'Date ',
            Cell: ({ cell }) => {
                const data = cell.getValue();
                const formatedDate = formatDate(data);
                return (
                    <Box component='span' sx={{}}>
                        {formatedDate}
                    </Box>
                );
            }
        },
        {
            accessorKey: 'bill',
            header: 'Bill#',
            Cell: ({ renderedCellValue, row }) => (
                <BillNumber>{renderedCellValue}</BillNumber>
            )
        },

        {
            accessorKey: 'reference',
            header: 'Reference',
            Cell: ({ renderedCellValue, row }) => (
                <BillNumber>{renderedCellValue}</BillNumber>
            )
        },


        {
            accessorKey: 'vendor_number',
            header: 'Vendor Name'
        },

        {
            accessorKey: 'status',
            header: 'Status',
            Cell: ({ cell }) => {
                const status = cell.getValue();
                const estStatusColor = StatusColor(status);

                return (
                    <Box
                        component='span'
                        sx={{
                            color: estStatusColor,
                            borderRadius: '0.25rem',
                            textTransform: 'capitalize'
                        }}
                    >
                        {snakeCaseToPrettyText(status)}
                    </Box>
                );
            }
        },
        {
            accessorKey: 'due_date',
            header: 'Due Date ',
            Cell: ({ cell }) => {
                const data = cell.getValue();
                const formatedDate = formatDate(data);
                return (
                    <Box component='span' sx={{}}>
                        {formatedDate}
                    </Box>
                );
            }
        },

        {
            accessorKey: 'amount',
            header: 'Amount',
            Cell: ({ renderedCellValue, row }) => (
                <BillNumber>{renderedCellValue}</BillNumber>
            )
        },
        {
            accessorKey: 'balance_date',
            header: 'Balance Date',
            Cell: ({ renderedCellValue, row }) => (
                <BillNumber>{renderedCellValue}</BillNumber>
            )
        },
        {
            accessorKey: 'actions',
            header: <Search onClick={handleExportClick} />,
            enableColumnActions: false,
            enableColumnFilter: false,
            enableColumnOrdering: false,
            enableSorting: false,
            Cell: ({ renderedCellValue, row }) => <Actions id={row?.original?.id} />
        }
    ];
    const collapsedColumns = [
        {
            accessorKey: 'customer', // Access customer data
            header: 'Company Name',
            Cell: ({ row }) => {
                const wholedata = row?.original;
                const customer = wholedata?.customer;
                const estStatusColor = StatusColor(wholedata.status);

                return (
                    <Box>
                        <Grid container sx={{ justifyContent: 'space-between' }}>
                            <Grid item x={6}>
                                <Typography variant='subtitle2'>
                                    {customer?.first_name} {customer?.last_name}
                                </Typography>
                                <Typography
                                    component='span'
                                    sx={{ fontSize: '12px', color: '#2196F3' }}
                                >
                                    {wholedata?.estimate_number}
                                </Typography>
                                <Typography component='span' sx={{ fontSize: '12px' }}>
                                    {' '}
                                    | {formatDate(customer?.created_at)}
                                </Typography>
                            </Grid>
                            <Grid item x={6} sx={{ textAlign: 'right' }}>
                                <Typography variant='body2'>
                                    ${wholedata?.total || 0}
                                </Typography>
                                <Typography variant='caption' sx={{ color: estStatusColor }}>
                                    {snakeCaseToPrettyText(wholedata?.status) || '--'}
                                </Typography>
                                <IconButton sx={{ paddingRight: '0' }}>
                                    {' '}
                                    <Mail sx={{ fontSize: '15px' }} />{' '}
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                );
            }
        }
    ];

    const [columns, setColumns] = useState(intialColumns);
    const [selectedRows, setSelectedRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [priceQouteStatus, setPriceQouteStatus] = useState('Bills');
    const [showMenuItem, setShowMenu] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const [viewPriceQuotes, setViewPriceQuotes] = useState(false);
    const [openImport, setOpenImport] = useState(false);
    const [openExport, setOpenExport] = useState(false);
    const [id, setId] = useState(null);
    const [hash, setHash] = useHash();
    //   console.log('hash' , hash)
    const [docAnchor, setDocAnchor] = useState(null);

    const handleShowMenu = (event) => {
        setDocAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setDocAnchor(null);
    };

    const navigate = useNavigate();
    //   console.log("openConfirmDialog", openConfirmDialog);

    const [refresh, setRefresh] = useState(0);

    const showingMenu = event => {
        setShowMenu(event.currentTarget);
    };
    const hidingMenu = () => {
        setShowMenu(null);
    };
    const otherDropDown = [
        {
            name: 'Sort By',
            id: 'sorttime'
        },
        {
            name: 'Created Time',
            id: 'createtime'
        },
        {
            name: 'Date',
            id: 'date'
        },
        {
            name: 'Bill#',
            id: 'bill'
        },
        {
            name: 'Vendor Name',
            id: 'vendorname'
        },
        {
            name: 'Due Date',
            id: 'duedate'
        },
        {
            name: 'Amount',
            id: 'amount'
        },
        {
            name: 'Balance Due',
            id: 'balancedue'
        },
        {
            name: 'Last Modified time',
            id: 'lastmodfied'
        },

        {
            name: 'Import Bills',
            icon: <SaveAltIcon />,
            id: 'import',
            event: () => setOpenImport(true)
        },
        {
            name: 'Export Bills',
            icon: <UploadFileIcon />,
            id: 'export',
            event: () => setOpenExport(true)
        },
        {
            name: 'Export Current View',
            icon: <UploadFileIcon />,
            id: 'exportcurrent'
        },
        {
            name: 'Preferences',
            icon: <SettingsIcon />,
            id: 'preferences'
        },

        {
            name: 'Refrest List',
            icon: <Cached />,
            id: 'refresh'
        }
    ];
    //   menu items
    const handleMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const selectingStatus = (e, id) => {
        const filteredSttaus = billsStatus.find(item => item.id === id);
        setPriceQouteStatus(filteredSttaus.name);
    };

    //   bulk delete / simgle / multiple
    const handleBulkDelete = async () => {
        console.log('selectedRows', selectedRows);
        const selectedRowIds = selectedRows.map(row => Number(row));

        try {
            const resp = await bulkDeleteEstimatesApi({ ids: selectedRowIds });
            notyf.success(resp?.message);
            setRefresh(prev => prev + 1);
        } catch (err) {
            //   console.log("err", err);
            notyf.error('Something went wrong');
        }
    };

    useEffect(() => {
        const id = extractNumberFromHash(hash);
        setId(id);
        if (id) {
            setColumns(collapsedColumns);
            setViewPriceQuotes(true);
        } else {
            setColumns(intialColumns);
            setViewPriceQuotes(false);
        }
    }, [hash]);

    const handleRowClick = row => {
        setHash('#/' + row?.id);
    };


    const headerIconButton = {
        backgroundColor: '#EEEEEE',
        border: '1px solid #d1d1d1',
        borderRadius: '4px',
        textTransform: 'none',
        padding: '4px'
    };

    const TriggerButton = styled(MenuButton)(
        ({ theme }) => `
    // padding: 2px;
    background: #2196F3;
    color: #fff;
    border-radius:18px;
    border:none;
    transition-duration: 120ms;
    .MuiSvgIcon-root {
      margin-bottom: -3px;
    }
    &:hover {
      border-color: rgb(242, 242, 242);
    }
    `
    );
    const StyledMenuItem = styled(MenuItem)(
        ({ theme }) => `
    padding: 13px;
    border-radius: 8px;
    cursor: pointer;
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: #F6FBFF;
    }
    `
    );
    const StyledListbox = styled('ul')(
        ({ theme }) => `
    font-family: roboto;
    font-size:18px,
    min-width: 100px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: white;
    box-shadow: 0px 4px 30px #d0d7de;
    z-index:1
    `
    );

    // actions aicon , only edit for now
    const Actions = ({ id }) => {
        const [menuAnchorEl, setMenuAnchorEl] = useState(null);

        const openMenu = event => {
            event.stopPropagation();
            setMenuAnchorEl(event.currentTarget);
        };

        const closeMenu = () => {
            setMenuAnchorEl(null);
        };

        const handleEditClick = e => {
            e.stopPropagation();
            openingEditForm(id);
            closeMenu();
        };



        return (
            <Box className='show-on-hover' sx={{ display: 'none' }}>
                {/* <TriggerButton onClick={openMenu} >
          <KeyboardArrowDown/>
        </TriggerButton> */}
                <IconButton
                    onClick={openMenu}
                    sx={{
                        backgroundColor: '#2196F3',
                        borderRadius: '18px',
                        padding: '2px',
                        color: '#fff',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                            background: 'rgb(33,150,243 , 0.8)',
                            color: '#fff'
                        }
                    }}
                >
                    <KeyboardArrowDown />
                </IconButton>
                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={closeMenu}
                //   slots={{ listbox: StyledListbox }}
                >
                    <MenuItem
                        onClick={handleEditClick}
                        sx={{ width: '150px', display: 'flex', alignItems: 'center' }}
                    >
                        <EditIcon sx={{ fontSize: '16px', color: '#2196F3' }} />
                        <Typography sx={{ margin: '0 5px' }}>Edit </Typography>
                    </MenuItem>
                </Menu>
            </Box>
        );
    };


    const openingEditForm = id => {
        // alert('Edit clicked for ID: ' + id);
        navigate(`/bills/edit/${id}`);
    };

    return (
        <>

            <Grid container>
                <TableGrid sm={viewPriceQuotes ? 3.5 : 12}>
                    <HeaderPaper>
                        {selectedRows.length > 0 && (
                            <Grid item container>
                                {/* pgae header / when checkbox selected  */}
                                <Grid item sm={12}>
                                    <Grid item container>
                                        <Grid
                                            item
                                            sm={10}
                                            sx={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            <Stack
                                                direction='row'
                                                display='felx'
                                                alignItems='center'
                                                spacing={2}
                                            >
                                                <ButtonGroup>
                                                    <IconButton
                                                        sx={{
                                                            backgroundColor: '#EEEEEE',
                                                            ...headerIconButton
                                                        }}
                                                    >
                                                        <img src={printer} alt='printer' />
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{
                                                            ...headerIconButton,
                                                            backgroundColor: '#EEEEEE'
                                                        }}
                                                    >
                                                        <img src={pdf} alt='pdf' />
                                                    </IconButton>
                                                </ButtonGroup>
                                                <Button
                                                    size='medium'
                                                    sx={{
                                                        ...headerIconButton,
                                                        color: 'black',
                                                        padding: '6px 16px'
                                                    }}
                                                >
                                                    Bulk Update
                                                </Button>
                                                <IconButton
                                                    onClick={showingMenu}
                                                    sx={{
                                                        ...headerIconButton,
                                                        color: 'black',
                                                        padding: '6px 16px'
                                                    }}
                                                >
                                                    <MoreHorizIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={showMenuItem}
                                                    open={Boolean(showMenuItem)}
                                                    onClose={hidingMenu}
                                                >
                                                    <MenuItem
                                                        onClick={() => {
                                                            hidingMenu(); // Close the Menu
                                                            setOpenConfirmDialog(true); // Open the confirmation dialog
                                                            setDialogProps({
                                                                onConfirm: handleBulkDelete
                                                            });
                                                        }}
                                                        sx={{ padding: '2px 4px', borderRadius: '4px' }}
                                                    >
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
                                                display: 'flex',
                                                justifyContent: 'end',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <IconButton onClick={() => setRefresh(prev => prev + 1)}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        {/* pgae header / when checkbox not selected  */}
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
                                                {priceQouteStatus}
                                            </Typography>

                                        </Stack>

                                    </Grid>
                                    <Grid
                                        item
                                        sm={6}
                                        display='flex'
                                        justifyContent='end'
                                        alignItems='center'
                                    // spacing={2}
                                    >
                                        <Box sx={{ margin: '0 10px', borderRadius: '4px' }}>
                                            <MUIButton
                                                size="medium"
                                                onClick={handleShowMenu}
                                                sx={{ padding: '6px 16px', minWidth: '151px' }}
                                                component={RouterLink}

                                            >
                                                UPLOAD BILL <ArrowDropDownIcon />
                                            </MUIButton>
                                            <Menu
                                                anchorEl={docAnchor}
                                                open={Boolean(docAnchor)}
                                                onClose={handleClose}
                                            >
                                                <MenuItem onClick={handleMenuClose}>  Attach From Desktop</MenuItem>
                                            </Menu>
                                        </Box>
                                        <Box
                                            // bgcolor='red'
                                            sx={{ margin: ' 0 10px', borderRadius: '4px' }}
                                        >
                                            <MUIButton
                                                size='medium'
                                                router
                                                sx={{ padding: '6px 16px' }}
                                                component={RouterLink}
                                                to='/bills/new'
                                            >
                                                <AddIcon fontSize='small' /> New
                                            </MUIButton>
                                        </Box>

                                    </Grid>
                                </>
                            </Grid>
                        )}
                    </HeaderPaper>

                    <SearchBox open={isExportDialogOpen}
                        onClose={handleExportDialogClose} />

                    <Grid item container>
                        <>
                            <Grid item sm={6} display='flex' alignItems='center'>
                                <Stack
                                    direction='row'
                                    display='flex'
                                    alignItems='center'
                                    spacing={0}
                                    sx={{ padding: '20px' }}
                                >
                                   <BillDropDown title="View By All Bills" />
                                </Stack>

                            </Grid>
                            <Grid
                                item
                                sm={6}
                                display='flex'
                                justifyContent='end'
                                alignItems='center'
                                // spacing={2}
                                sx={{ paddingRight: '30px', }}
                            >


                                <MoreHorizIcon sx={{ ...headerIconButton, border: '1px solid #1976d2' }}
                                    onClick={showingMenu} />

                                <Menu
                                    anchorEl={showMenuItem}
                                    open={Boolean(showMenuItem)}
                                    onClose={hidingMenu}
                                >
                                    <List sx={{ width: 300, height: 400, overflow: 'auto' }}>
                                        {otherDropDown.map((item, index) => (
                                            <React.Fragment key={item.id}>
                                                <MenuItem
                                                    onClick={e => {
                                                        item.event(e);
                                                        hidingMenu();
                                                        setRefresh(prev => prev + 1);
                                                    }}
                                                >
                                                    <Typography sx={{ padding: '4px' }}>{item.icon}</Typography>
                                                    {item.name}
                                                </MenuItem>
                                                {index === 10 && <Divider />} {/* Add a divider after the 8th item */}
                                                {index === 11 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>

                                </Menu>

                            </Grid>
                        </>
                    </Grid>
                    <TableContainer>

                        <DataTable
                            columns={viewPriceQuotes ? collapsedColumns : intialColumns}
                            api={getAllBillsApi}
                            setSelectedRows={setSelectedRows}
                            refresh={refresh}
                            onRowClick={handleRowClick}
                            collapsed={viewPriceQuotes}
                        />
                    </TableContainer>
                </TableGrid>
                {viewPriceQuotes && (
                    <Grid sm={8.5}>
                        <DetailViewContainer>

                            <ViewBills id={id}
                                setRefresh={setRefresh}
                                setViewPriceQuotes={setViewPriceQuotes} />

                        </DetailViewContainer>
                    </Grid>
                )}
            </Grid>

            {/* delete confirmation box  */}
            <ConfirmDialog
                title='Are you sure you want to delete'
                isOpen={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                {...dialogProps}
            />
            <ImportFileModal
                isOpen={openImport}
                onClose={() => setOpenImport(false)}
                ImportTypeEnum={ImportTypeEnum}
                importApi={importEstimate}
            />
            <ExportFileModal
                isOpen={openExport}
                onClose={() => setOpenExport(false)}
                exportApi={exportEstimate}
            />
        </>
    );
};

export default BillsTable;

const ImportTypeEnum = [
    {
        key: 'customers_import',
        label: 'Customer Complete Detail',
        filePath: '/files/sample_contacts_new'
    },
    {
        key: 'customers_contacts_persons_import',
        label: 'Customer' + 's Contact Persons',
        filePath: '/files/sample_contactpersons'
    }
];
