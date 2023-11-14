import { useState } from 'react';
import ExportModal from '../../Components/ExportFileModal/ExportFileModal';
import ImportModal from '../../Components/ImportFileModal/ImportFileModal';
import CustomerTable from './CustomerTable';
import { exportCustomers, importCustomers } from '../../../core/api/customer';
export default function Customer() {
	// const [viewCustomer, setViewCustomer] = useState(false);
	// const [openNew, setOpenNew] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpen1, setIsOpen1] = useState(false);
	// const [selected, setSelected] = useState([]);
	const [refresh, setRefresh] = useState(0);
	// const navigate = useNavigate();

	// const handleExportEstimate = () => {
	//   setIsOpen(true);
	// };
	// const handleimportEstimate = () => {
	//   setIsOpen1(true);
	// };
	const ImportTypeEnum = [
		{
			key: 'customers_import',
			label: 'Customer Complete Detail',
			filePath: '/files/sample_contacts_new',
		},
		{
			key: 'customers_contacts_persons_import',
			label: 'Customer' + 's Contact Persons',
			filePath: '/files/sample_contactpersons',
		},
	];
	const ExportTypeEnum = [
		{
			key: 'customers_export',
			label: 'Customer Complete Detail',
		},
		{
			key: 'customers_contacts_persons_export',
			label: 'Customer' + 's Contact Persons',
		},
		{
			key: 'customers_addresses_export',
			label: 'Customer' + 's Addresses',
		},
	];

	const reRender = () => setRefresh(prev => prev + 1);

	return (
		<>
			<CustomerTable reRender={refresh} />
			<ExportModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				exportApi={exportCustomers}
				ExportTypeEnum={ExportTypeEnum}
			/>

			<ImportModal
				isOpen={isOpen1}
				onClose={() => setIsOpen1(false)}
				setRefresh={reRender}
				importApi={importCustomers}
				ImportTypeEnum={ImportTypeEnum}
			/>
		</>
	);
}
