import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className='flex bg-[#F2F4F7] h-screen'>
      <Sidebar />

      <div className='w-full'>
        <Outlet />
      </div>
    </div>
  )
}