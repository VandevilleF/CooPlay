import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimeField } from '@mui/x-date-pickers/TimeField';

export function CustomTimeFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DemoContainer components={['TimeField']}>
        <TimeField
          label="Heure"
          defaultValue={new Date('2022-04-17T15:30')}
          format="HH:mm"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
