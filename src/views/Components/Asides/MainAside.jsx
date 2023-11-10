import React, { useState, useEffect } from 'react';
// import purchaseImg from '../../../../src/assets/vector.png';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import HomeIcon from '@mui/icons-material/Home';
import Collapse from '@mui/material/Collapse';
import './MainAside.css';
import { Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import ReceiptSharpIcon from '@mui/icons-material/ReceiptSharp';

export default function Sidebar() {
	const theme = useTheme();
	const list = [
		{ name: 'Home', icon: <HomeIcon />, path: '/home' },
		{
			name: 'Items',
			icon: <LocalMallIcon />,
			subItems: [{ name: 'Items', path: '/items' }],
		},
		{
			name: 'Sales',
			icon: <ShoppingCartIcon />,
			subItems: [
				{ name: 'Customers', path: '/customer' },
				{ name: 'Price Quotes', path: '/price-quote' },
				{ name: 'Sales Orders', path: '/sales-orders' },
				{ name: 'Invoices', path: '/invoices' },
				{ name: 'Payment Links', path: '/payment-links' },
				{ name: 'Account Receivable', path: '/payment-received' },
				{ name: 'Credit Memos', path: '/credit-memo' },
			],
		},
		{
			name: 'Purchases',
			icon: <ReceiptIcon />,
			subItems: [
				{ name: 'Vendors', path: '/vendor' },
				{ name: 'Purchase Orders', path: '/purchase-orders' },
				{ name: 'Bills', path: '/bills' },
				{ name: 'Accounts Payable', path: '/account-payable' },
				{ name: 'Vendor Credits', path: '/vendor-credits' },
			],
		},
		{
			name: 'Settings',
			icon: <SettingsIcon />,
			subItems: [
				{ name: 'Brands', path: '/item-brand' },
				{ name: 'Conditions', path: '/conditions' },
				{ name: 'Marketplaces', path: '/marketplaces' },
				{ name: 'Categories', path: '/categories' },
				{ name: 'Integrations', path: '/integrations' },
				{ name: 'Users', path: '/users' },
				{ name: 'Companies', path: '/companies' },
			],
		},
	];

	const { pathname } = useLocation();
	const [open, setOpen] = useState(list);

	const handleItemClick = index => {
		setOpen(prev => {
			let tempArray = prev.map((p, _index) => {
				if (_index === index)
					return {
						...p,
						open: true,
					};
				else
					return {
						...p,
						open: false,
					};
			});
			tempArray[index].open = !tempArray[index]?.open;
			return [...tempArray];
		});
	};

	const handleParentClick = index => {
		setOpen(prev => {
			let tempArray = [...prev];
			tempArray[index].open = !tempArray[index]?.open;
			return [...tempArray];
		});
	};

	const handleMenuItemClick = (index, subItemIndex) => {
		setOpen(prev => {
			// let tempArray = [...prev];
			let tempArray = prev.map((item, _index) => {
				if (_index === index) {
					return {
						...item,
						open: true,
					};
				} else
					return {
						...item,
						open: false,
					};
			});

			// tempArray[index].open = !tempArray[index]?.open;
			tempArray[index].subItems[subItemIndex].open =
				!tempArray[index][subItemIndex]?.open;
			return [...tempArray];
		});
	};

	useEffect(() => {
		setOpen(prev => {
			let tempArray = prev.map(pre => {
				if (pre.path === pathname)
					return {
						...pre,
						open: true,
					};
				else if (Array.isArray(pre?.subItems)) {
					const active = pre.subItems.some(item =>
						pathname?.includes(item.path)
					);
					if (active)
						return {
							...pre,
							open: true,
						};
				}
				return pre;
			});
			return [...tempArray];
		});
	}, [pathname]);

	return (
		<Box
			className='custom-drawer'
			sx={{
				width: '100%',
				paddingTop: '20px',
			}}
		>
			{list?.map((item, index) => (
				<React.Fragment key={item.name}>
					{item.subItems ? (
						<>
							<ListItem
								disablePadding
								onClick={() => handleParentClick(index)}
								className={`custom-list-item ${
									open[index].open ? 'selected' : ''
								}`}
							>
								<ListItemButton
									sx={{
										color: open[index].open
											? theme.palette.primary.main
											: theme.palette.dark,
									}}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.name} />
									{open[index].open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</ListItemButton>
							</ListItem>
							<Collapse
								in={open[index].open || false}
								timeout='auto'
								unmountOnExit
							>
								<List
									component='div'
									disablePadding
									className='custom-list-transition'
								>
									<Divider />
									{item.subItems.map((subItem, subItemIndex) => (
										<Link
											to={subItem?.path}
											key={subItem?.path + '-' + subItemIndex}
											className='subitem'
										>
											<ListItem
												disablePadding
												onClick={() => handleMenuItemClick(index, subItemIndex)}
												className={`custom-list-item ${
													pathname.includes(subItem?.path) ? 'selected' : ''
												}`}
												path={subItem.path}
											>
												<ListItemButton tabIndex={0}>
													<ListItemIcon>{subItem.icon}</ListItemIcon>
													<ListItemText primary={subItem.name} />
												</ListItemButton>
											</ListItem>
										</Link>
									))}
								</List>
								<Divider />
							</Collapse>
						</>
					) : (
						<Link to={item?.path} className='subitem'>
							<ListItem
								disablePadding
								onClick={() => handleItemClick(index)}
								className={`custom-list-item ${
									pathname?.includes(item.path) ? 'selected' : ''
								}`}
							>
								<ListItemButton
									sx={{
										color: open[index].open
											? theme.palette.primary.main
											: theme.palette.dark,
									}}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.name} />
								</ListItemButton>
							</ListItem>
						</Link>
					)}
				</React.Fragment>
			))}
		</Box>
	);
}
