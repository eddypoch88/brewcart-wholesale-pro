import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from "./src/components/Sidebar";
import Dashboard from "./src/components/Dashboard";
import OrderList from "./src/components/OrderList";
import Settings from "./src/components/Settings";
import AdminProductPage from "./src/components/admin/AdminProductPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "products" && <AdminProductPage />}
        {activeTab === "orders" && <OrderList />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
}