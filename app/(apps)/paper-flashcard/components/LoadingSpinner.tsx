export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="animate-spin rounded-full size-32 border-y-2 border-primary"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-primary font-medium text-center leading-tight">
            Doing<br />
            some<br />
            Magic
          </p>
        </div>
      </div>
    </div>
  );
};
