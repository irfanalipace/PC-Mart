import React from 'react';
import { getToken } from '../../../core/services/authService';
import InvoicePage from 'invoicing';
import { useTheme } from '@mui/material';

function Invoice() {
	const theme = useTheme();
	return <InvoicePage theme={theme} getToken={getToken} token={getToken()} />;
	// return <></>;
}

export default Invoice;
