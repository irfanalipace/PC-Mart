import { Typography, Box } from '@mui/material';
import React from 'react';
import MyCard from '../../../Components/Card/MyCard';
import Chart from '../LineChart/Chart';
import IncomeExpensiveChart from '../IncomeExpensiveChart/IncomeExpensiveChart';
import TopExpenses from '../TopExpenses/TopExpenses';
import BankCreditCard from '../BankCreditCard/BankCreditCard';

const HomeDashboard = () => {
  return (
    <Box>
      <Typography variant='div' sx={{ display: 'flex' }}>
        <Typography>
          <MyCard
            title='Total Receivables'
            totalUnpaidInvoices='Total Unpaid Invoices $51,906.63'
            currentAmount='$29,180.00'
            overdueAmount='$29,180.00'
            progressValue={40}
            newInovice='New Invoice'
            newRecurring='New Recurring Invoice'
            newCustomer='New Customer Payment'
          />
        </Typography>
        <Typography sx={{ marginLeft: '20px' }}>
          <MyCard
            title='Total Payables'
            totalUnpaidInvoices='Total Unpaid Bills $51,906.63'
            currentAmount='$29,180.00'
            overdueAmount='$29,180.00'
            progressValue={40}
            newInovice='New Invoice'
            newRecurring='New Vendor Payments'
            newCustomer='New Recurring Bills'
          />
        </Typography>
      </Typography>
      <Typography>
        <Chart
          title='Cash Flow'
          dateMonth='Last 12 Months'
          fiscalYear='This Fiscal Year'
          priviousYear='Previous Fiscal Year'
          lastYear='Last 12 Months'
          cashDate='Case as on 01 Aug 2022'
          cashAmount='0.00'
          inComming='Incomming'
          inCommingAmmount='3,193,494.4'
          outGoing='Outgoing'
          outGoingAmmount='25,007.87'
          cashLatestDate='Cash as on 23 Aug 2023'
          cashLatestAmmount='3,168,486.24'
        />
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <Typography>
          <IncomeExpensiveChart
            title='Income and Expense'
            dateMonth='Last 12 Months'
            fiscalYear='This Fiscal Year'
            priviousYear='Previous Fiscal Year'
            lastYear='Last 12 Months'
          />
        </Typography>
        <Typography>
          <TopExpenses
            title='Your Top Expenses'
            fiscalYear='This Fiscal Year'
            quarter='This Quarter'
            month='This Month'
            priviousYear='Previous Fiscal Year'
            priviousQuarter='Previous Quarter'
            priviousMonth='Previous Month'
            last6Month='Last 6 Months'
            last12Month='Last 12 Months'
          />
        </Typography>
      </Box>
      <Box variant='div' sx={{ display: 'flex' }}>
        <Typography>
          <BankCreditCard
            title='Bank and Credit Cards'
            bankDetalis='Yet to add Bank and Credit Card details'
            addBankAccount='Add Bank Account'
          />
        </Typography>
        <Typography>
          <TopExpenses
            title='Your Top Expenses'
            fiscalYear='This Fiscal Year'
            quarter='This Quarter'
            month='This Month'
            priviousYear='Previous Fiscal Year'
            priviousQuarter='Previous Quarter'
            priviousMonth='Previous Month'
            last6Month='Last 6 Months'
            last12Month='Last 12 Months'
          />
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeDashboard;
