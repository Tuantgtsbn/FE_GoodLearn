import {
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  type SelectProps,
} from '@mui/material';
import clsx from 'clsx';

interface ISelectNotFillProps {
  selectProps?: SelectProps<string>;
  onChange: (selected: string) => void;
  values: Array<{ name: React.ReactNode; id: string }>;
  value?: string;
  placeholder?: string;
  id?: string;
  emptyMessage?: string;
  className?: string;
  labelId?: string;
}

const CommonSelect = (props: ISelectNotFillProps) => {
  return (
    <Select
      style={{ borderRadius: '8px' }}
      sx={{
        '& .MuiSelect-select': {
          padding: '12px',
        },
      }}
      {...props.selectProps}
      className={props.className}
      labelId={props.labelId}
      id={props.id}
      displayEmpty
      value={props.value || ''}
      onChange={(event: SelectChangeEvent<string>) => {
        props.onChange(event.target.value);
      }}
      input={<OutlinedInput />}
      inputProps={{ 'aria-label': 'Without label' }}
      renderValue={(selected) => {
        if (selected !== '') {
          return props.values.find((item) => item.id === selected)?.name;
        } else {
          return (
            <span className={clsx('text-[#c3c3c3] text-sm')}>
              {props.placeholder || '-'}
            </span>
          );
        }
      }}
      MenuProps={{
        disableScrollLock: true,
        PaperProps: {
          style: {
            maxHeight: 250,
            fontSize: '14px',
          },
          sx: {
            marginTop: '4px',
            borderRadius: '8px',
            '& .MuiMenuItem-root': {
              fontSize: '14px',
            },
            '& .MuiMenuItem-root.Mui-selected:not(:first-child)': {
              backgroundColor: '#FFF4F2',
              fontSize: '14px',
              fontWeight: 'bold',
            },
            '& .MuiMenuItem-root.Mui-selected:first-child': {
              backgroundColor: '#FFF',
              fontSize: '14px',
            },
          },
        },
      }}
    >
      {!props.values || props.values.length === 0 ? (
        <MenuItem disabled value="">
          <span>{props.emptyMessage || 'Không có dữ liệu'}</span>
        </MenuItem>
      ) : (
        props.values.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))
      )}
    </Select>
  );
};

export default CommonSelect;
