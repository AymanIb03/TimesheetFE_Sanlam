import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const CustomDateRangePicker = ({ onDateChange }) => {
  const [value, setValue] = useState([dayjs().startOf('month'), dayjs()]);

  const handlePresetSelection = (preset) => {
    let start;
    let end = dayjs();

    switch (preset) {
      case 'This Week':
        start = dayjs().startOf('week');
        break;
      case 'Last Month':
        start = dayjs().subtract(1, 'month').startOf('month');
        end = dayjs().subtract(1, 'month').endOf('month');
        break;
      case 'Next Month':
        start = dayjs().add(1, 'month').startOf('month');
        end = dayjs().add(1, 'month').endOf('month');
        break;
      case 'Reset':
        start = dayjs().startOf('month');
        end = dayjs();
        setValue([start, end]);
        onDateChange([start, end]);
        return;
      default:
        break;
    }

    setValue([start, end]);
    onDateChange([start, end]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="outlined" onClick={() => handlePresetSelection('This Week')}>This Week</Button>
        <Button variant="outlined" onClick={() => handlePresetSelection('Last Month')}>Last Month</Button>
        <Button variant="outlined" onClick={() => handlePresetSelection('Next Month')}>Next Month</Button>
        <Button variant="outlined" onClick={() => handlePresetSelection('Reset')}>Reset</Button>
      </Box>
      <DateRangePicker
        startText="Start"
        endText="End"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          onDateChange(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} fullWidth />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} fullWidth />
          </>
        )}
      />
    </LocalizationProvider>
  );
};

export default CustomDateRangePicker;
