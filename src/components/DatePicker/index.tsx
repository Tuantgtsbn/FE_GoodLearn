import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { useScreenWidth } from '@/hooks/useScreenWidth';

interface ICommonDestopDatePickerProps {
  value: string | null;
  onChange: (value: Dayjs | null) => void;
  config?: {
    minDate?: string;
    maxDate?: string;
  };
  className?: string;
  enableTime?: boolean; // Thêm prop để bật chế độ chọn giờ
  label?: string;
}

export function CommonDestopDatePicker({
  value,
  onChange,
  config,
  className,
  enableTime = false,
  label,
}: ICommonDestopDatePickerProps) {
  if (enableTime) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']} sx={{ paddingTop: 0 }}>
          <DateTimePicker
            label={label}
            value={value ? dayjs(value) : null}
            onChange={onChange}
            format="DD/MM/YYYY HH:mm"
            ampm={false}
            slotProps={{
              textField: {
                error: false,
              },
            }}
            sx={{
              '& .MuiPickersInputBase-root': {
                color: '#000000',
              },
            }}
            className={className}
            minDate={config?.minDate ? dayjs(config.minDate) : undefined}
            maxDate={config?.maxDate ? dayjs(config.maxDate) : undefined}
          />
        </DemoContainer>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']} sx={{ paddingTop: 0 }}>
        <DatePicker
          label={label}
          value={value ? dayjs(value) : null}
          onChange={onChange}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              error: false,
            },
          }}
          sx={{
            '& .MuiPickersInputBase-root': {
              color: '#000000',
            },
          }}
          className={className}
          minDate={config?.minDate ? dayjs(config.minDate) : undefined}
          maxDate={config?.maxDate ? dayjs(config.maxDate) : undefined}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export function CommonMobileDatePicker({
  value,
  onChange,
  config,
  className,
  enableTime = false,
  label,
}: ICommonDestopDatePickerProps) {
  if (enableTime) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={['MobileDateTimePicker']}
          sx={{ paddingTop: 0 }}
        >
          <MobileDateTimePicker
            label={label}
            value={value ? dayjs(value) : null}
            onChange={onChange}
            format="DD/MM/YYYY HH:mm"
            ampm={false}
            slotProps={{
              textField: {
                error: false,
              },
            }}
            sx={{
              '& .MuiPickersInputBase-root': {
                color: '#000000',
              },
            }}
            minDate={config?.minDate ? dayjs(config.minDate) : undefined}
            maxDate={config?.maxDate ? dayjs(config.maxDate) : undefined}
            className={className}
          />
        </DemoContainer>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']} sx={{ paddingTop: 0 }}>
        <MobileDatePicker
          label={label}
          value={value ? dayjs(value) : null}
          onChange={onChange}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              error: false,
            },
          }}
          sx={{
            '& .MuiPickersInputBase-root': {
              color: '#000000',
            },
          }}
          minDate={config?.minDate ? dayjs(config.minDate) : undefined}
          maxDate={config?.maxDate ? dayjs(config.maxDate) : undefined}
          className={className}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default function DatePickerComponent({
  value,
  onChange,
  config,
  className,
  enableTime = false,
  label,
}: ICommonDestopDatePickerProps) {
  const width = useScreenWidth();
  const isMobile = width < 768;
  return isMobile ? (
    <CommonMobileDatePicker
      value={value}
      onChange={onChange}
      config={config}
      className={className}
      enableTime={enableTime}
      label={label}
    />
  ) : (
    <CommonDestopDatePicker
      value={value}
      onChange={onChange}
      config={config}
      className={className}
      enableTime={enableTime}
      label={label}
    />
  );
}
