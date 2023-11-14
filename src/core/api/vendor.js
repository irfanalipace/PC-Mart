import ApiService from '../services/apiService';

export function getAllVendors(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/purchases/vendors', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// *********** Get single vendor *************
export function vendorsSingleApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/purchases/vendors/${id}`, null, null)
			.then(response => {
				// console.log('Response:', response);
				resolve(response.data);
			})
			.catch(error => {
				console.log('Error:', error);
				reject(error);
			});
	});
}

// *********** Get Currencies *************
export function getCurrenciesApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-currency`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getCurrenciesApi', e);
				reject(e);
			});
	});
}
// *********** Get Payment Terms *************
export function getPeymentTermsApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-terms`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getPeymentTermsApi', e);
				reject(e);
			});
	});
}
// *********** Get Payment Terms *************
export function getTaxesApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-taxes`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getPeymentTermsApi', e);
				reject(e);
			});
	});
}
// *********** store vendor *********
export function createVendor(vendorData) {
	return new Promise((resolve, reject) => {
		ApiService.post('/purchases/vendors', vendorData, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// *********** update vendor *********
export function UpdateVendorApi(vendorData) {
	return new Promise((resolve, reject) => {
		// ApiService.post('/purchases/vendors', { ...vendorData, _method: PUT }, id, true)
		ApiService.post(`/purchases/vendors/${vendorData.id}`, vendorData, '', true)
			// ApiService.put('/purchases/vendors', id, vendorData)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// *********** update vendor Model *********
export function UpdateVendorSpecificApi(id, vendorData) {
	return new Promise((resolve, reject) => {
		ApiService.post('/purchases/update-vendor-specific-details', id, vendorData)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function updateVendors(vendorData, vendorId) {
	return new Promise((resolve, reject) => {
		ApiService.put('/purchases/vendors', vendorData, vendorId)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function deleteVendor(vendorId) {
	return new Promise((resolve, reject) => {
		ApiService.delete('/purchases/vendors', vendorId)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function bulkDeleteVendor(vendorIds) {
	return new Promise((resolve, reject) => {
		ApiService.post('/purchases/bulk-delete-vendors', vendorIds)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function exportVendors(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/purchases/export-vendors', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function importVendors(body) {
	return new Promise((resolve, reject) => {
		ApiService.post('/purchases/import-vendors', body, null, true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// Get invoices of vendor
export function getVendorInvoices(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-vendor-invoices', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// Get Transaction data of vendor
export function getVendorTransactions(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-transaction', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// add vendor conatct
export function addVendorContactApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('/add-vendor-contact', data)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// update vendor address
export function updateVendorAddressApi(data, id) {
	return new Promise((resolve, reject) => {
		ApiService.put('/update-vendor-address', id, data)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// create vendor address
export function createVendorAddress(data) {
	console.log('dataes', data);
	return new Promise((resolve, reject) => {
		ApiService.post('/add-customer-address', { ...data })
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
