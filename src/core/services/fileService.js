
import { filterFiles } from '../utils/helpers';

const fileService = {
	handleFileInputChange: (event, allowedFiles, cb) => {
		const files = event.target.files
		console.log('filessss@@@' , files)
		if (files.length > 0) {
			const { validFiles, errors } = filterFiles(files, allowedFiles);
			cb(validFiles, errors);
			// const newFiles = Array.from(files);
		}
	},
};

export default fileService;