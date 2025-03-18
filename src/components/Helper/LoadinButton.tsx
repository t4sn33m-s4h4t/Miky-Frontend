import { Button, } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';


interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;  
}


export const LoadingButton = ({ type, isLoading, className, children, ...props }: LoadingButtonProps) => {
  return (
    <Button type={type} disabled={isLoading} {...props} className={className}>
      {isLoading ? <Loader2 className="mr-2 animate-spin" /> : null}
      {children}
    </Button>
  );
};
