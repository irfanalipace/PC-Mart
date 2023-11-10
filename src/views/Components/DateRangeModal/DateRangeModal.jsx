import React, { useState } from 'react'
import Modal from "../../../../Components/Modal/Dialog"
import FormField from "../../../../Components/InputField/FormField"
import { Box } from "@mui/system"
import { Button, Grid, Typography } from "@mui/material"
import GridRow from "../../../../Components/GridRow/GridRow"

function DateRangeModal({ openModal, closeModal, onSave }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };
    const handleSaveClick = () => {
        onSave(startDate, endDate);
        closeModal();
    };
    const handleClearClick = () => {
        setStartDate('');
        setEndDate('');
    };
    return (
        <>
            <Modal
                title='Date Range Modal'
                open={openModal}
                onClose={() => closeModal()}
            >
                <Box p={3}>
                    <FormField
                        id='startdate'
                        type='date'
                        sx={{ width: '48%' }}
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                    <Typography fontSize={'20px'} component={'span'} sx={{ margin: '0 5px' }}>-</Typography>
                    <FormField
                        id='enddate'
                        type='date'
                        sx={{ width: '48%' }}
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                    <Typography component={'p'} variant='caption' sx={{ margin: '20px 0' }}>
                        Note: If you've entered a Payment amount for any unpaid invoices,
                        those invoices will continue to be shown at the top of the list, irrespective
                        of the Date Range filter that you apply.
                    </Typography>

                    <GridRow>
                        <Grid item xs={6}>
                            <Button
                                variant='contained'
                                size='small'
                                type='submit'
                                onClick={handleSaveClick}
                            >
                                Save
                            </Button>
                            <Button
                                variant='outlined'
                                sx={{ marginLeft: '5px' }}
                                size='small'
                                onClick={()=>closeModal()}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Button
                                sx={{ fontSize: '11px', textTransform: 'capitalize', color: '#2196F3' }} 
                                onClick={handleClearClick}>
                                Clear Selection
                            </Button>
                        </Grid>
                    </GridRow>
                </Box>
            </Modal>
        </>
    )
}

export default DateRangeModal