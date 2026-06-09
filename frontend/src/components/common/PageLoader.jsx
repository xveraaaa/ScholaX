export default function PageLoader({
  title = "Loading..."
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin"></div>

      <h2 className="mt-4 text-lg font-medium text-gray-700">
        {title}
      </h2>
    </div>
  );
}