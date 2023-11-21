import ApiService from '../services/apiService';

export function updatePassword(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('/change-password', null, data)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
