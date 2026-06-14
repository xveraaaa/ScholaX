import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

import PublicLayout from "../../layouts/HomeLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "Forgot Password";
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // await api.post("/auth/forgot-password", { email });

      toast.success(
        "If an account exists, a reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      toast.error("Failed to send reset link.");
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center mb-4">
            Forgot Password
          </h1>

          <p className="text-gray-600 text-center mb-6">
            Enter your email address and we'll send
            password reset instructions.
          </p>

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border p-3 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}