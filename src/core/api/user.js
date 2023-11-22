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
export function updateProfile(data) {
	ApiService.setHeader('content-type', 'multipart/form-data');
	const formData = new FormData();
	formData.append('first_name', data?.first_name);
	formData.append('last_name', data?.last_name);
	formData.append('profile_pic', data?.profile_pic);
	return new Promise((resolve, reject) => {
		ApiService.post('/update-profile', null, formData)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
export function DeleteProfile() {
	return new Promise((resolve, reject) => {
		ApiService.get('/delete-profile-pic')
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
