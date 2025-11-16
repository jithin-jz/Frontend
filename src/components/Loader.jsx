const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="relative w-20 h-20 animate-spin">
        {/* Outer Web */}
        <div className="absolute inset-0 rounded-full border-4 border-red-600 opacity-30"></div>

        {/* Inner Web */}
        <div className="absolute inset-3 rounded-full border-4 border-blue-500 opacity-40"></div>

        {/* Web Strings */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute w-full h-[2px] bg-red-500 top-1/2 -translate-y-1/2"></div>
            <div className="absolute h-full w-[2px] bg-red-500 left-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
