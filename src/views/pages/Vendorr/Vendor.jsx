import { useState } from 'react';
import ExportModal from '../../Components/ExportFileModal/ExportFileModal';
import ImportModal from '../../Components/ImportFileModal/ImportFileModal';
import VendorTable from './VendorTable';
import { exportVendors, importVendors } from '../../../core/api/vendor';
export default function Vendor() {
	// const [viewVendor, setViewVendor] = useState(false);
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
			key: 'vendors_import',
			label: 'Vendor Complete Detail',
			filePath: '/files/sample_contacts_new',
		},
		{
			key: 'vendors_contacts_persons_import',
			label: 'Vendor' + 's Contact Persons',
			filePath: '/files/sample_contactpersons',
		},
	];
	const ExportTypeEnum = [
		{
			key: 'vendors_export',
			label: 'Vendor Complete Detail',
		},
		{
			key: 'vendors_contacts_persons_export',
			label: 'Vendor' + 's Contact Persons',
		},
		{
			key: 'vendors_addresses_export',
			label: 'Vendor' + 's Addresses',
		},
	];

	const reRender = () => setRefresh(prev => prev + 1);

	return (
		<>
			<VendorTable reRender={refresh} />
			<ExportModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				exportApi={exportVendors}
				ExportTypeEnum={ExportTypeEnum}
			/>

			<ImportModal
				isOpen={isOpen1}
				onClose={() => setIsOpen1(false)}
				setRefresh={reRender}
				importApi={importVendors}
				ImportTypeEnum={ImportTypeEnum}
			/>
		</>
	);
}
