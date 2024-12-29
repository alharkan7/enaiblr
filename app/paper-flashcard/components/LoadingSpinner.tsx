export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-blue-500 font-medium text-center leading-tight">
            Doing<br />
            some<br />
            Magic
          </p>
        </div>
      </div>
    </div>
  );
};
