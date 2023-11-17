import React, { useEffect, useState } from 'react';
import {
	Box,
	IconButton,
	Grid,
	Button,
	Divider,
	ListItemIcon,
	Stack,
	ButtonGroup,
	Typography,
} from '@mui/material';
import { Menu as DropMenu } from '@mui/base/Menu';
import { Dropdown } from '@mui/base/Dropdown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MenuButton } from '@mui/base/MenuButton';
import { menuItemClasses } from '@mui/base/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import {
	Add,
	Delete,
	Edit,
	KeyboardArrowDown,
	MailOutline,
	MoreHoriz,
	QuestionMark,
} from '@mui/icons-material';
import DataTable from '../../../Components/DataTable/DataTable';
import { useNavigate } from 'react-router-dom';
import useHash from '../../../../core/hooks/useHash';
import {
	StatusColor,
	decryptId,
	extractNumberFromHash,
	formatDate,
	formatDateAndTime,
	generateEncryptedID,
	snakeCaseToPrettyText,
} from '../../../../core/utils/helpers';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import {
	bulkDeleteItem,
	exportItems,
	getAllItems,
	importItems,
	searchItems,
} from '../../../../core/api/items';
import DetailViewContainer from '../../../Components/Containers/DetailViewContainer';
import TableContainer from '../../../Components/Containers/TableContainer';
import ItemView from './ViewItem/ItemView';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ImageIcon from '@mui/icons-material/Image';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsIcon from '@mui/icons-material/Settings';
import CachedIcon from '@mui/icons-material/Cached';
import Name from '../../../Components/InputLabel/Name';
import MUIButton from '../../../Components/Button/MUIButton';
import TitleDropMenu from '../../../Components/TitleDropMenu/TitltDropMenu.';
import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import ebay from '../../../../assets/images/marketplaces/ebay.png';
import { useTheme } from '@mui/material/styles';
import Modal from '../../../Components/Modal/Dialog';
import TableGrid from '../../../Components/Containers/TableGrid';

function Items() {
	const ImportTypeEnum = [
		// {
		//   key: 'customers_import',
		//   label: 'Customer Complete Detail',
		//   filePath: '/files/sample_contacts_new'
		// },
		// {
		//   key: 'customers_contacts_persons_import',
		//   label: 'Customer' + 's Contact Persons',
		//   filePath: '/files/sample_contactpersons'
		// }
	];
	const navigate = useNavigate();
	const [selectedRows, setSelectedRows] = useState([]);
	const [viewItem, setViewItem] = useState(false);
	const [openImport, setOpenImport] = useState(false);
	const [openExport, setOpenExport] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [id, setId] = useState(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [showMenuItem, setShowMenu] = useState(null);
	const [dialogProps, setDialogProps] = useState({});
	const [anchorE2, setAnchorE2] = useState(null);
	const [description, setDescription] = useState('');
	const openMore = Boolean(anchorE2);
	const theme = useTheme();

	const handleMoreClick = event => {
		setAnchorE2(event.currentTarget);
	};
	const handleMoreClose = () => {
		setAnchorE2(null);
	};

	const intialColumns = [
		{
			accessorKey: 'item_id',
			header: 'Item ID',
			Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>,
		},
		// {
		// 	accessorKey: 'id',
		// 	header: 'Id',
		// 	Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>,
		// },
		{
			accessorKey: 'image',
			header: 'Image',
			Cell: ({ renderedCellValue, row }) => (
				<a
					href={renderedCellValue}
					target='_blank'
					rel='noopener noreferrer'
					onClick={e => e.stopPropagation()}
				>
					<img
						loading='lazy'
						src={renderedCellValue}
						style={{ width: '70px' }}
					/>
				</a>
			),
		},
		{
			accessorKey: 'mpn',
			header: 'Part Number',
		},
		// {
		// 	accessorKey: 'asin',
		// 	header: 'Asin',
		// 	Cell: ({ renderedCellValue, row }) => <Rate>{renderedCellValue}</Rate>,
		// },
		{
			accessorKey: 'title',
			header: 'Title',
			Cell: ({ renderedCellValue, row }) => (
				<a
					href={row.original.web_url}
					target='_blank'
					style={{
						textDecoration: 'none',
					}}
					onClick={e => e.stopPropagation()}
					rel='noreferrer'
				>
					<Typography
						variant='body2'
						color={'black'}
						sx={{
							'&:hover': {
								color: theme.palette.primary.main,
							},
						}}
					>
						{renderedCellValue}
					</Typography>
				</a>
			),
		},
		{
			accessorKey: 'description',
			header: 'Description',
			Cell: ({ renderedCellValue, row }) => (
				<>
					<Box
						sx={{
							overflow: 'hidden',
							display: '-webkit-box',
							WebkitLineClamp: '2',
							WebkitBoxOrient: 'vertical',
							width: '300px',
							'& *': {
								fontSize: '14px !important',
								fontFamily: 'Roboto !important',
								fontWeight: '400 !important',
								color: 'rgba(0, 0, 0, 0.87)',
							},
						}}
						dangerouslySetInnerHTML={{
							__html: row.original.description,
						}}
					></Box>
					<MUIButton
						onClick={e => {
							e.stopPropagation();
							setDescription(row.original.description);
						}}
						variant={'text'}
						sx={{ padding: 0 }}
					>
						Read More
					</MUIButton>
				</>
			),
		},
		{
			accessorKey: 'quantity',
			header: 'Quantity',
		},
		{
			accessorKey: 'cost',
			header: 'Cost (USD)',
			Cell: ({ renderedCellValue }) => (
				<Typography variant='body1'>${renderedCellValue}</Typography>
			),
		},
		{
			accessorKey: 'selling_price',
			header: 'Selling Price',
			Cell: ({ renderedCellValue }) => (
				<Typography variant='body1'>${renderedCellValue}</Typography>
			),
		},
		{
			accessorKey: 'listing_marketplace',
			header: 'Listing Marketplace',
		},
		// {
		// 	accessorKey: 'business_price',
		// 	header: 'Business Price',
		// },
		{
			accessorKey: 'brand.name',
			header: 'Brand',
		},
		{
			accessorKey: 'category.name',
			header: 'Category Name',
		},
		// {
		// 	accessorKey: 'web_url',
		// 	header: 'Web Url',
		// 	Cell: ({ renderedCellValue, row }) => (
		// 		<a href={renderedCellValue} target='_blank'>
		// 			<Typography variant='body2' color={'primary'}>
		// 				{renderedCellValue}
		// 			</Typography>
		// 		</a>
		// 	),
		// },
		{
			accessorKey: 'marketplace.store_name',
			header: 'Market Place',
			Cell: ({ renderedCellValue, row }) => (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<img
						src={ebay}
						style={{ width: '70px', height: '20px', marginRight: '5px' }}
					/>
					<Typography variant='body2'>{renderedCellValue}</Typography>
				</Box>
			),
		},
		{
			accessorKey: 'sku',
			header: 'SKU',
		},

		{
			accessorKey: 'condition.name',
			header: 'Condition',
		},

		{
			accessorKey: 'last_sync',
			header: 'Last Sync',
			size: 200,
			Cell: ({ renderedCellValue, row }) => (
				<Typography variant='body2'>
					{formatDateAndTime(renderedCellValue)}
				</Typography>
			),
		},
		{
			accessorKey: 'item_created_date',
			header: 'Created Date',
			size: 200,
			Cell: ({ renderedCellValue, row }) => (
				<Typography variant='body2'>
					{formatDateAndTime(renderedCellValue)}
				</Typography>
			),
		},
		// {
		// 	accessorKey: 'status',
		// 	header: 'Status',
		// 	Cell: ({ cell }) => {
		// 		const status = cell.getValue();
		// 		const estStatusColor = StatusColor(status, theme);

		// 		return (
		// 			<Box
		// 				component='span'
		// 				sx={{
		// 					color: estStatusColor,
		// 					borderRadius: '0.25rem',
		// 					textTransform: 'capitalize',
		// 				}}
		// 			>
		// 				{snakeCaseToPrettyText(status)}
		// 			</Box>
		// 		);
		// 	},
		// },
	];

	const collapsedColumns = [
		{
			accessorKey: 'title',
			header: 'title',
			Cell: ({ row }) => {
				const wholedata = row?.original;
				const estStatusColor = StatusColor(wholedata.status, theme);

				return (
					<Box>
						<Grid container sx={{ justifyContent: 'space-between' }}>
							<Grid item x={6}>
								{/* <Typography variant='subtitle2'>
									{wholedata?.id || ''}
								</Typography> */}
								<Typography
									component='span'
									sx={{ fontSize: '12px', color: '#2196F3' }}
								>
									{wholedata?.title || '--'}
								</Typography>
								<br />
								<Typography component='span' sx={{ fontSize: '12px' }}>
									{wholedata?.mpn || ''}
								</Typography>
							</Grid>
							{/* <Grid item x={6} sx={{ textAlign: 'right' }}>
								<Typography variant='body2'>${wholedata?.cost || 0}</Typography>
								<Typography variant='caption' sx={{ color: estStatusColor }}>
									{snakeCaseToPrettyText(wholedata?.status) || '--'}
								</Typography>
								<IconButton sx={{ paddingRight: '0' }}>
									<Mail sx={{ fontSize: '15px' }} />
								</IconButton>
							</Grid> */}
						</Grid>
					</Box>
				);
			},
		},
	];
	const [columns, setColumns] = useState(intialColumns);
	const [hash, setHash] = useHash();

	useEffect(() => {
		const id = extractNumberFromHash(hash);
		setId(id);
		if (id) {
			setColumns(collapsedColumns);
			setViewItem(true);
		} else {
			setColumns(intialColumns);
			setViewItem(false);
		}
	}, [hash]);

	const handleEditModal = (e, row) => {
		e.stopPropagation();
		navigate(`/item/edit/${row}`);
	};

	const handleDeleteModal = params => {
		console.log('id: ' + params.id);
	};

	const handleRowClick = row => {
		setHash('#/' + generateEncryptedID(row?.id));
	};

	const handleBulkDelete = async () => {
		try {
			await bulkDeleteItem({ ids: selectedRows });
			setRefresh(prev => prev + 1);
		} catch (err) {}
	};

	const Rate = ({ children }) => (
		<Box>
			<span>USD- {children || 0}</span>
		</Box>
	);

	const Actions = ({ id }) => {
		return (
			<Box
				className='show-on-hover'
				sx={{ display: 'none' }}
				// sx={{ textAlign:'right',marginRight:'80px' }}
			>
				<Dropdown>
					<TriggerButton onClick={e => e.stopPropagation()}>
						<KeyboardArrowDown />
					</TriggerButton>
					<Menu slots={{ listbox: StyledListbox }}>
						<StyledMenuItem onClick={e => handleEditModal(e, id)}>
							<Edit sx={{ fontSize: '16px', color: '#2196F3' }} /> Edit
						</StyledMenuItem>
						<StyledMenuItem
							onClick={e => {
								e.stopPropagation();
								// setOpenConfirmDialog(true);
								// setDialogProps({
								//   onConfirm: handleDeleteModal,
								//   onConfirmParams: {
								//     id
								//   }
								// });
							}}
						>
							<MailOutline
								sx={{
									fontSize: '16px',
									color: '#2196F3',
									marginBottom: '-3px',
								}}
							/>{' '}
							Email Item
						</StyledMenuItem>
					</Menu>
				</Dropdown>
			</Box>
		);
	};

	const showingMenu = event => {
		setShowMenu(event.currentTarget);
	};
	const hidingMenu = () => {
		setShowMenu(null);
	};
	return (
		<>
			<Grid container>
				<TableGrid sm={viewItem ? 3.5 : 12}>
					<HeaderPaper sx={{ padding: '10px 20px' }}>
						{selectedRows?.length > 0 && (
							<Grid container>
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
										{/* <ButtonGroup>
                          <IconButton
                            sx={{
                              backgroundColor: "#EEEEEE",
                              ...headerIconButton,
                            }}
                          >
                            <img src={printer} alt="printer" />
                          </IconButton>
                          <IconButton
                            sx={{
                              ...headerIconButton,
                              backgroundColor: "#EEEEEE",
                            }}
                          >
                            <img src={pdf} alt="pdf" />
                          </IconButton>
                        </ButtonGroup> */}
										<Button
											size='medium'
											sx={tableViewIconButton}
											onClick={() => {
												setOpenConfirmDialog(true);
												setDialogProps({
													onConfirm: () => handleBulkDelete(),
												});
											}}
										>
											<Delete /> Delete
										</Button>
										{/* <Button
                          size="medium"
                          sx={{
                            ...headerIconButton,
                            color: "black",
                            padding: "6px 16px",
                          }}
                        >
                          Bulk Update
                        </Button> */}
										{/* <IconButton
                          onClick={showingMenu}
                          sx={{
                            // ...headerIconButton,
                            color: "black",
                            padding: "6px 16px",
                          }}
                        >
                          <MoreHorizIcon />
                        </IconButton> */}
										{/* <Menu
                          anchorEl={showMenuItem}
                          open={Boolean(showMenuItem)}
                          onClose={hidingMenu}
                        >
                          <MenuItem
                            sx={{ padding: "2px 4px", borderRadius: "4px" }}
                          >
                            <MUIButton
                              onClick={() => {
                                setOpenConfirmDialog(true);
                                setDialogProps({
                                  onConfirm: () => handleBulkDelete(),
                                });
                              }}
                              size="medium"
                              fullWidth
                            >
                              Delete
                            </MUIButton>
                          </MenuItem>
                        </Menu> */}
									</Stack>
								</Grid>
								<Grid
									item
									sm={2}
									container
									justifyContent={'end'}
									alignItems={'center'}
								>
									<IconButton onClick={() => setRefresh(prev => prev + 1)}>
										<CloseIcon />
									</IconButton>
								</Grid>
							</Grid>
						)}
						{selectedRows?.length === 0 && (
							<Grid item container>
								<>
									<Grid sm={6} item container alignItems='center'>
										<Stack
											direction='row'
											display='flex'
											alignItems='center'
											spacing={0}
										>
											<Typography variant='h6' component='span'>
												All Items
											</Typography>
										</Stack>
									</Grid>
									<Grid
										sm={6}
										item
										container
										justifyContent='end'
										alignItems='center'
										spacing={2}
										paddingTop={'15px'}
									>
										{/* {!viewItem && (
											<>
												<Button
													size='medium'
													// onClick={() => navigate("/items/new")}
													variant='contained'
												>
													Inventory
												</Button>
												&ensp; */}
										{/* <Button
													size='medium'
													// onClick={() => setOpenImport(true)}
													variant='contained'
													sx={{ marginRight: '10px' }}
												>
													Ebay
												</Button> */}
										{/* </>
										)} */}
										<MUIButton
											size='medium'
											onClick={() => navigate('/items/new')}
											variant='contained'
										>
											<Add fontSize='small' />
											New
										</MUIButton>{' '}
										{!viewItem && (
											<MUIButton
												size='medium'
												onClick={e => setOpenExport(true)}
												variant='outlined'
												sx={{ marginLeft: '10px' }}
											>
												<UploadFileIcon fontSize='small' />
												Export Items
											</MUIButton>
										)}
										{/* {!viewItem && (
											<Dropdown>
												<HeaderMenuButton>
													<SettingsIcon />
												</HeaderMenuButton>
											</Dropdown>
										)}
										<Dropdown>
											<HeaderMenuButton>
												<MoreHoriz />
											</HeaderMenuButton>
										</Dropdown> */}
										<DropMenu slots={{ listbox: StyledListbox }}>
											<Menu
												anchorEl={anchorE2}
												id='other-menu'
												open={openMore}
												onClose={handleMoreClose}
												onClick={handleMoreClose}
												transformOrigin={{
													horizontal: 'center',
													vertical: 'top',
												}}
												anchorOrigin={{
													horizontal: 'left',
													vertical: 'bottom',
												}}
											>
												{/* <MenuItem>Name</MenuItem>
												<MenuItem>Rate</MenuItem>
												<MenuItem>Last Modified Time</MenuItem> */}
												{/* <MenuItem onClick={() => setOpenImport(true)}>
													<ListItemIcon>
														<SaveAltIcon />
													</ListItemIcon>
													Import Items
												</MenuItem> */}
												<MenuItem onClick={e => setOpenExport(true)}>
													<ListItemIcon>
														<UploadFileIcon />
													</ListItemIcon>
													Export Items
												</MenuItem>
												<Divider />
												{/* <MenuItem>
													<ListItemIcon>
														<UploadFileIcon />
													</ListItemIcon>
													Export Current View
												</MenuItem>
												<Divider />
												<MenuItem>
													<ListItemIcon>
														<SettingsIcon />
													</ListItemIcon>
													Preferences
												</MenuItem>
												<Divider />
												<MenuItem>
													<ListItemIcon>
														<CachedIcon />
													</ListItemIcon>
													Refresh List
												</MenuItem> */}
											</Menu>
										</DropMenu>
										{/* {!viewItem && (
											<IconButton
												sx={{
													marginLeft: '10px',
													borderRadius: '5px',
													backgroundColor: '#ED6C02',
													color: 'white',
												}}
											>
												<QuestionMark />
											</IconButton>
										)} */}
									</Grid>
								</>
							</Grid>
						)}
					</HeaderPaper>
					<TableContainer>
						<DataTable
							api={getAllItems}
							columns={columns}
							setSelectedRows={setSelectedRows}
							onRowClick={handleRowClick}
							collapsed={viewItem}
							refresh={refresh}
							searchApi={searchItems}
							manualFilter
							initialState={{
								columnVisibility: { description: false, item_id: false },
							}} //hide firstName column by default
						/>
					</TableContainer>
				</TableGrid>
				{viewItem && (
					<Grid item sm={8.4} sx={{ marginLeft: '10px' }}>
						<DetailViewContainer>
							<ItemView id={decryptId(id)} setRefresh={setRefresh} />
						</DetailViewContainer>
					</Grid>
				)}
			</Grid>
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
				importApi={importItems}
				setRefresh={setRefresh}
			/>
			<ExportFileModal
				isOpen={openExport}
				onClose={() => setOpenExport(false)}
				exportApi={exportItems}
				exportColumns
			/>
			<DescriptionModal
				isOpen={description ? true : false}
				onClose={() => setDescription('')}
				description={description}
			/>
		</>
	);
}
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

const StyledMenuItem = styled(MenuItem)(
	({ theme }) => `
  padding: 13px;
  border-radius: 8px;
  cursor: pointer;
  .MuiSvgIcon-root {
    color: #6C6C6C;
    margin-bottom:-5px;
    font-size: 20px;
  }
  &:hover:not(.${menuItemClasses.disabled}) {
    background-color: #F6FBFF;
  }
  `
);
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
const HeaderMenuButton = styled(MenuButton)(
	({ theme }) => `
  padding: 7px 10px;
  border-radius:8px;
  border:none;
  transition-duration: 120ms;
  margin: 7px;
  &:hover {
    border-color: rgb(242, 242, 242);
  }
  `
);
const headerIconButton = {
	backgroundColor: '#EEEEEE',
	border: '1px solid #d1d1d1',
	borderRadius: '4px',
	textTransform: 'none',
};

export default Items;

function DescriptionModal({ isOpen, onClose, description }) {
	return (
		<Modal open={isOpen} onClose={onClose} size={'md'} title='Description'>
			<Box
				sx={{ padding: '10px' }}
				dangerouslySetInnerHTML={{
					__html: description,
				}}
			></Box>
		</Modal>
	);
}
const tableViewIconButton = {
	backgroundColor: 'WHITE',
	border: '1px solid #1976d2',
	fontSize: '12px',
	borderRadius: '3px',
	textTransform: 'none',
	padding: '4px',
};
