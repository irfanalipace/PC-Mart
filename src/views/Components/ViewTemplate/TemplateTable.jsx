import { Table, Typography } from '@mui/material';
import {
	TableBody,
	TableBodyCell,
	TableHead,
	TableHeadCell,
	TableRow,
} from '../Table/Table';

const TemplateTable = ({ data, columns }) => {
	console.log(data, ' tempdata');
	return (
		<Table sx={{ minWidth: 650 }} aria-label='simple table'>
			<TableHead>
				<TableRow sx={{ backgroundColor: '#f0f0f0' }}>
					{columns?.map((column, index) => (
						<TableHeadCell key={index} sx={{ padding: '6px 16px' }}>
							<Typography variant='templateBody2'>{column?.label}</Typography>
						</TableHeadCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{data?.length > 0 ? (
					<>
						{data?.map((row, index) => (
							<TableRow key={index}>
								{columns?.map(column => (
									<TableBodyCell key={row[column?.id]}>
										{column?.key === 'index'
											? index + 1
											: column?.key === 'rate' || column?.key === 'total'
											? '$' + row[column?.key]
											: row[column?.key] ?? '-'}
									</TableBodyCell>
								))}
							</TableRow>
						))}
					</>
				) : (
					<TableRow>
						<TableBodyCell align='center' colSpan={10}>
							No Data Found
						</TableBodyCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default TemplateTable;
