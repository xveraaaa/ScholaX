import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        {children}
      </main>


    </div>
  );
}