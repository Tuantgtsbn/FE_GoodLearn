import { type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';
import { toast } from 'react-toastify';

export function safeSetFieldError<T extends FieldValues>(
  setError: UseFormSetError<T>,
  field: string,
  message: string
) {
  try {
    setError(field as Path<T>, { type: 'manual', message });
  } catch {
    toast.error(`Lỗi ${field}: ${message}`);
  }
}
