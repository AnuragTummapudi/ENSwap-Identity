import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-black text-white grid-bg">
      {!isLandingPage && <Sidebar />}
      <div className={`transition-all duration-300 flex flex-col ${
        isLandingPage ? "ml-0" : "ml-16 lg:ml-72"
      }`}>
        {!isLandingPage && <Header />}
        <main className="flex-1">
          <div className={`${isLandingPage ? "p-0" : "p-6 lg:p-8"}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;