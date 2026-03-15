import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function DefaultLayout({ children }) {
  return (
    <div>
      <Navbar>
        <div className="flex-1">{children}</div>
        <Footer className="mt-auto" />
      </Navbar>
    </div>
  );
}
