import React, { useState } from 'react';
import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../styles/DatePicker.css'

export default function DatePickerComponent(props:any) {

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Период от:"
        value={props.dateFrom}
        defaultCalendarMonth={props.dateScope.minDate}
        minDate = {props.dateScope.minDate}
        maxDate = {props.dateScope.maxDate}
        onChange={(newValue) => {
          props.changeDateFrom(newValue);
        }}
        renderInput={(params) => <TextField size="small" {...params} style = {{width: 200}} />}
      />
       <DatePicker
        label="Период до:"
        value={props.dateUpTo}
        defaultCalendarMonth={props.dateScope.maxDate}
        minDate = {props.dateFrom  ? props.dateFrom : props.dateScope.minDate}
        maxDate = {props.dateScope.maxDate}
        onChange={(newValue) => {
          props.changeDataUpTo(newValue)
        }}
        renderInput={(params) => <TextField size="small" {...params} sx={{width:200, ml:5}}/>} 
      />
    </LocalizationProvider>
  );
}


