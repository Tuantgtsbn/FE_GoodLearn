import { useAuthAction } from '@/hooks/useAuthAction';

interface IAuthButtonWrapperProps {
  action: () => void;
  children?: React.ReactNode;
  className?: string;
  isRequiredAuth?: boolean;
}

function AuthButton({
  action,
  children,
  className,
  isRequiredAuth = false,
}: IAuthButtonWrapperProps) {
  const handleClick = useAuthAction(action);
  return (
    <div onClick={isRequiredAuth ? handleClick : action} className={className}>
      {children}
    </div>
  );
}

export default AuthButton;
