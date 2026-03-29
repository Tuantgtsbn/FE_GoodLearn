import { useId, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface ICommonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  isRequired?: boolean;
  icon?: React.ComponentType<{ className: string }>;
  showPassword?: boolean;
  error?: boolean;
  readOnly?: boolean;
}
export default function CommonInput({
  label,
  isRequired = true,
  icon: Icon,
  showPassword,
  error,
  type = 'text',
  className,
  readOnly = false,
  ...props
}: ICommonInputProps) {
  const id = useId();
  const [inputType, setInputType] = useState<string>(type);
  const handleShowPassword = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };
  return (
    <>
      {label && (
        <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          type={inputType}
          readOnly={readOnly}
          className={clsx(
            'w-full pr-3 py-3 pl-3 rounded-lg border-gray-300 border',
            {
              '!pl-10': Icon,
              'pr-10': showPassword,
              '!border-red-500 !focus:ring-red-500': error,
              'focus:!ring-0 pointer-events-none': readOnly,
              'focus:outline-none focus:ring-2 focus:ring-blue-500': !readOnly,
            },
            className
          )}
          {...props}
        />
        {showPassword && type === 'password' && (
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={handleShowPassword}
          >
            {inputType === 'password' ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </div>
        )}
      </div>
    </>
  );
}
