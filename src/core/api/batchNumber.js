import ApiService from '../services/apiService';

export function getBatchNumber(batchType) {
	return new Promise((resolve, reject) => {
		ApiService.get('/batch-number-dropdown', null, { type: batchType })
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
