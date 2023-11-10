import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	typography: {
		h1: {
			fontSize: '96px',
			fontWeight: 300,
		},
		h2: {
			fontWeight: 300,
			fontSize: '60px',
		},
		h3: {
			fontWeight: 400,
			fontSize: '48px',
		},
		h4: {
			fontWeight: 400,
			fontSize: '34px',
		},
		h5: {
			fontWeight: 400,
			fontSize: '24px',
		},
		h6: {
			fontWeight: 500,
			fontSize: '20px',
		},
		subtitle1: {
			fontWeight: 400,
			fontSize: '16px',
		},
		subtitle2: {
			fontWeight: 500,
			fontSize: '14px',
		},
		subtitle2Grey: {
			fontFamily: 'roboto',
			fontWeight: 500,
			fontSize: '14px',
			color: '#707070',
			lineHeight: '20.02px',
			letterSpacing: '0.17px',
		},
		body1: {
			fontWeight: 400,
			fontSize: '16px',
			lineHeight: '24px',
			letterSpacing: '0.15px',
		},
		body1bold: {
			fontFamily: 'roboto',
			fontWeight: 500,
			fontSize: '16px',
			lineHeight: '24px',
			letterSpacing: '0.15px',
		},
		body2: {
			fontWeight: 400,
			fontSize: '14px',
		},
		body2Bold: {
			fontWeight: 500,
			fontSize: '14px',
			fontFamily: 'roboto',
		},
		body2Grey: {
			fontFamily: 'roboto',
			fontWeight: 400,
			fontSize: '14px',
			color: '#707070',
			lineHeight: '20.02px',
			letterSpacing: '0.17px',
		},
		caption: {
			fontWeight: 400,
			fontSize: '12px',
		},
		captionGrey: {
			fontFamily: 'roboto',
			fontWeight: 400,
			fontSize: '12px',
			lineHeight: '19.92px',
			letterSpacing: '0.4px',
			color: '#707070',
		},
		overline: {
			fontWeight: 500,
			fontSize: '12px',
		},
		formikError: {
			fontFamily: 'roboto',
			fontWeight: 500,
			fontSize: '14px',
			color: 'red',
			lineHeight: '20.02px',
			letterSpacing: '0.17px',
		},
		templateBody: {
			fontFamily: 'Poppins',
			fontSize: '12px',
		},
		templateBody2: {
			fontFamily: 'Poppins',
			fontWeight: '600',
		},
		templateHead: {
			fontFamily: 'Rajdhani',
		},
	},
});
