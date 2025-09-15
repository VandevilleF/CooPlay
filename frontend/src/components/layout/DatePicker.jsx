import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export function BasicDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Date" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
