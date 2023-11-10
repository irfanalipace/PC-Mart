import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@mui/material/styles';
import {
  HeaderRoutes,
  AsideRoutes,
  FooterRoutes,
  PagesRoutes
} from './core/Routes/LayoutRoutes';
import { theme } from './core/theme/theme';

import initServices from './core/services/initServices';
import './App.css';
import store from './core/store/store';
import { Provider } from 'react-redux';

function App() {
  initServices.init(); //initialize services

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <HeaderRoutes />
          <Grid container>
            <AsideRoutes />
            <PagesRoutes />
          </Grid>

          {/* <Grid item> */}
          {/* Footer */}
          {/* <FooterRoutes /> */}
          {/* </Grid> */}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
