import ApiService from '../services/apiService';

export function loginApi({ email, password }) {
	return new Promise((resolve, reject) => {
		ApiService.post('/login', {
			email,
			password,
		})
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function registerApi(credentials) {
	return new Promise((resolve, reject) => {
		ApiService.post(`/register`, credentials, null, true)
			.then(response => {
				// console.print('file: auth.module.js | register| response', response);
				resolve(response);
			})
			.catch(e => {
				// console.print('Console Log: : error', e);
				reject(e);
			});
	});
}

export function logoutApi() {
	return new Promise((resolve, reject) => {
		ApiService.post('/logout')
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function verifyEmailApi(email) {
	return new Promise((resolve, reject) => {
		ApiService.post('verify-email', {
			email,
			// formData,
		})
			.then(response => {
				console.print(
					'file: auth.module.js | verifyEmailApi| response',
					response
				);
				resolve(response.data);
			})
			.catch(e => {
				// console.print("Console Log: : error", e);
				reject(e);
			});
	});
}

export function verifyOtpApi({ otp }) {
	return new Promise((resolve, reject) => {
		ApiService.post('verify-otp', {
			otp_code: otp,
		})
			.then(response => {
				console.print(
					'file: auth.module.js | verifyOtpApi| response',
					response
				);
				resolve(response.data);
			})
			.catch(e => {
				console.print('Console Log: : error', e);
				reject(e);
			});
	});
}

export function forgetPasswordApi(email) {
	return new Promise((resolve, reject) => {
		ApiService.post('/forgot-password', {
			...email,
		})
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function resetPasswordApi(credentials) {
	// console.log('credentials' , credentials)
	const params = new URLSearchParams(window.location.search);
	const token = params.get('token');
	const email = params.get('email');

	const updatedCredentials = {
		...credentials,
		email,
		token,
	};
	return new Promise((resolve, reject) => {
		ApiService.post('reset-password', updatedCredentials)
			.then(response => {
				// console.print(
				//   'file: auth.module.js | resetPasswordApi| response',
				//   response
				// );
				resolve(response);
			})
			.catch(e => {
				// console.print("Console Log: : error", e);
				reject(e);
			});
	});
}

export function updateProfileApi(formData) {
	ApiService.setHeader('content-type', 'multipart/form-data');
	return new Promise((resolve, reject) => {
		ApiService.post('update-profile', formData)
			.then(response => {
				console.print(
					'file: auth.module.js | updateProfileApi| response',
					response
				);
				resolve(response.data);
			})
			.catch(e => {
				console.print('Console Log: : error', e);
				reject(e);
			});
		ApiService.setHeader('content-type', 'application/json');
	});
}

export function deleteProfilePicApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('delete-profile-picture', data)
			.then(response => {
				console.print(
					'file: auth.module.js | deleteProfilePicApi| response',
					response
				);
				resolve(response.data);
			})
			.catch(e => {
				console.print('Console Log: : error', e);
				reject(e);
			});
	});
}

export function updatePasswordApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('change-password', data)
			.then(response => {
				console.print(
					'file: auth.module.js | updateProfileApi| response',
					response
				);
				resolve(response.data);
			})
			.catch(e => {
				console.print('Console Log: : error', e);
				reject(e);
			});
	});
}
