import ApiService from "../services/apiService";

// *********** Create Payabled *********
// create estimates 
export function createPayableApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/account-payable', data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** update Payabled *********
export function updatePayableApi(data) {
  return new Promise((resolve, reject) => {
    // ApiService.put('/account-payable', id, data)
    ApiService.post(`/account-payable/${data.id}`, data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** getll all Payabled *********
export function getAllPayables(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/payment-received', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
// *********** getll all getPayable *********
export function getPayable(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-amount-payed', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// *********** Get single Payabled *************
export function SinglePayableApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/account-payable/${id}`, null, null)
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

// *********** Delete single Payabled *************
export function deletePayableApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/account-payable/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log('Error occurred:', error);
        reject(error);
      });
  });
}
// *********** Delete single Payabled *************
export function deletePayableFilesApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/account-payable-file-delete/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** download pdf Payabled *************
export function downloadPDFPayableApi(id) {
  // console.log('iddddd' ,  id)
  return new Promise((resolve, reject) => {
    ApiService.get(`/account-payable-download-pdf`, null, id)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** download pdf Payabled *************
export function exportPayable(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/export-account-payable', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}