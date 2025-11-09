import { Outlet } from "react-router-dom";
import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/common/Footer";
import Navbar from "@/components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Navbar />
        <Sidebar />
        <div>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
