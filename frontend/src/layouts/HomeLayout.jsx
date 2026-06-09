import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}