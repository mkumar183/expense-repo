
interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
