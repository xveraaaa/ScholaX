import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PublicLayout from "../../layouts/404Layout";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <PublicLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <div className="text-[10rem] md:text-[14rem] font-black text-blue-100 leading-none">
            404
          </div>

          <h2 className="-mt-8 text-4xl font-bold text-blue-900">
            Page Not Found
          </h2>

          <p className="text-gray-600 text-lg mb-8">
            The page you are looking for may have been moved, deleted, or does
            not exist.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="
              inline-block
              bg-blue-900
              text-white
              px-8
              py-3
              rounded-lg
              font-semibold
              hover:bg-blue-800
              transition
            "
          >
            Go Back
          </button>
        </div>
      </section>
    </PublicLayout>
  );
}