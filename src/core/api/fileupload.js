import ApiService from '../services/apiService';

export function convertNotReadyItemsToReady(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/file-items-status-change/${id}`, null, {})
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function getUploadFile(params, batchNum, name) {
	return new Promise((resolve, reject) => {
		const queryParams = { ...params, batch_number: batchNum, file_name: name };
		ApiService.get('/get-files', null, queryParams)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
export function getSoldUploadFile(params, batchNum, name) {
	return new Promise((resolve, reject) => {
		const queryParams = { ...params, batch_number: batchNum, file_name: name };
		ApiService.get('/get-sold-files', null, queryParams)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
export function DownloadSingleFile(bNo, typed) {
	return new Promise((resolve, reject) => {
		ApiService.post(`/specific-file-download`, null, {
			batch_number: bNo,
			type: typed,
		})
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function DownloadProblematicFile(fileId) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/file-download/${fileId}`)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function DownloadSingleSoldFile(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/sold-file-download/${id}`)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function SearchData(params, typeName, SearchType) {
	const queryParams = { ...params, type: typeName, search_type: SearchType };
	return new Promise((resolve, reject) => {
		ApiService.get(`/search-data`, null, queryParams)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function DownloadSampleFile() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/sample-download`)
			.then(response => {
				const blob = new Blob([response.data], {
					type: response.headers['content-type'],
				});

				// Use window.open with a data URL to trigger the download
				const fileURL = window.URL.createObjectURL(blob);
				window.open(fileURL, '_blank');

				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function getFileUploadError(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/file-errors/${id}`)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
