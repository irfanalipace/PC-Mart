import { Box } from '@mui/system';
import FileUploadTable from './FileUploadTable';

const FileUpload = () => {
	return (
		<Box maxHeight={'calc(100vh - 80px)'}>
			<FileUploadTable importFileHeading='Upload Inventory File' />
		</Box>
	);
};

export default FileUpload;
