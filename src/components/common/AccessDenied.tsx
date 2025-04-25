
interface AccessDeniedProps {
  message?: string;
}

const AccessDenied = ({ message = "You don't have permission to access this page." }: AccessDeniedProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default AccessDenied;
