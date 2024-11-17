import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className='flex bg-[#F2F4F7] h-screen'>
      <Sidebar />

      <div className='w-full'>
        <Header />

        <div className="px-4 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}