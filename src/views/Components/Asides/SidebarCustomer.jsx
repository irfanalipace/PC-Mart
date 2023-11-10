import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import HomeIcon from '@mui/icons-material/Home';
import { Settings } from '@mui/icons-material';
import './MainAside.css';
import { Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Box, border } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

export default function SidebarCustomer() {
	const { customerId } = useParams();
	const theme = useTheme();
	const list = [
		{
			name: 'Dashboard',
			icon: <HomeIcon />,
			path: `/customer-portal/${customerId}/dashboard`,
		},
		{
			name: 'Price Quotes',
			icon: <ShoppingBagOutlinedIcon />,
			path: `/customer-portal/${customerId}/price-quote`,
		},
		{
			name: 'Sales Orders',
			icon: <ReceiptTwoToneIcon />,
			path: `/customer-portal/${customerId}/sales-orders`,
		},
		{
			name: 'Invoices',
			icon: <ShoppingCartSharpIcon />,
			path: `/customer-portal/${customerId}/invoices`,
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
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				paddingTop: '20px',
				height: '85vh',
			}}
		>
			<div>
				{list?.map((item, index) => (
					<React.Fragment key={item.name}>
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
					</React.Fragment>
				))}
			</div>

			<Link to={`/customer-portal/:customerId/setting`} className='subitem1'>
				<ListItem disablePadding>
					{/* <ListItemButton>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary='Settings' />
            </ListItemButton> */}
				</ListItem>
			</Link>
		</Box>
	);
}
