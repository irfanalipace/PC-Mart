import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import authReducer from './auth/authSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,

		// Add additional reducers for other features here
	},
	middleware: [thunkMiddleware],
});

export default store;
