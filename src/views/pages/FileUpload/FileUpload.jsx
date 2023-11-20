import { Box } from '@mui/system';
import FileUploadTable from './FileUploadTable';

const FileUpload = () => {
	return (
		<Box maxHeight={'calc(100vh - 80px)'}>
			<FileUploadTable />
		</Box>
	);
};

export default FileUpload;
