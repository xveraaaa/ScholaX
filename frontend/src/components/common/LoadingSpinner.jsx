export default function LoadingSpinner({
  text = "Loading..."
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div
        className="
          w-10
          h-10
          border-4
          border-blue-200
          border-t-blue-900
          rounded-full
          animate-spin
        "
      ></div>

      <p className="mt-4 text-gray-600">
        {text}
      </p>
    </div>
  );
}