import ApiService from '../services/apiService';

export function getAllVendorCredits(params) {
	return new Promise((resolve, reject) => {
		const response = {
			data: {
				data: [
					{
						id: 1,
						created_at: '22,Nov 2022',
						rma_number: 'RMI-12',
						vendor_credit: 'CN-0001',
						name: 'Drew Holmes',
						status: 'draft',
						bill: 'Bill-12',
						amount: '1223',
						balance: '2323',
					},
					{
						id: 2,
						created_at: '22,Nov 2022',
						rma_number: 'RMI-13',
						vendor_credit: 'CN-0002',
						name: 'Albert Einstien',
						status: 'draft',
						bill: 'Bill-13',
						amount: '1223',
						balance: '2323',
					},
					{
						id: 3,
						created_at: '22,Nov 2022',
						rma_number: 'RMI-14',
						vendor_credit: 'CN-0004',
						name: 'jr.Albert Einstien',
						status: 'draft',
						bill: 'Bill-14',
						amount: '1223',
						balance: '2323',
					},
				],
			},
		};
		resolve(response);
		console.log('respon', response);
	});
}
