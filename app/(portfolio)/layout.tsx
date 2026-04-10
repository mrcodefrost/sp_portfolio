import StarBackgroundClient from "../components/main/StarBackgroundClient";
import Navbar from "../components/main/Navbar";
import SiteFooter from "../components/main/SiteFooter";
import { Toaster } from "react-hot-toast";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#030014] min-h-screen overflow-y-scroll overflow-x-hidden">
      <StarBackgroundClient />
      <Navbar />
      {children}
      <SiteFooter variant="space" />
      <Toaster position="bottom-right" />
    </div>
  );
}
