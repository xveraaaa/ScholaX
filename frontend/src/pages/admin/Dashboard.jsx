import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Admin Dashboard"
  }, []);
  return (
    <h1 className="text-4xl p-10">
      Admin Dashboard
    </h1>
  );
}