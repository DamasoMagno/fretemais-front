import logo from "@/assets/logo.png"
import { Settings } from "lucide-react"
import { Package, Question, SignOut, SquaresFour, Truck, Users } from "phosphor-react"
import { NavLink } from "react-router-dom"

export function Sidebar() {
  return (
    <aside className="w-[242px] bg-white">
      <header className="w-full bg-[#FFBD00] rounded-b-3xl flex justify-center items-center p-4">
        <img src={logo} alt="logo frete mis" />
      </header>

      <div className="flex flex-col pl-4">
        <nav className="flex flex-col mt-8 gap-12">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "flex items-center gap-4 text-[#101828] text-sm font-medium border-r-[4px] border-[#FFBD00]" : "border-r-[4px] border-transparent hover:border-[#FFBD00] flex items-center gap-4 text-[#667085] text-sm font-medium"
            }
          >
            <SquaresFour size={19} color="#101828" />
            Dashboard
          </NavLink>
          <NavLink to="/freight" className={({ isActive }) =>
            isActive ? "flex items-center gap-4 text-[#101828] text-sm font-medium border-r-[4px] border-[#FFBD00]" : "border-r-[4px] border-transparent hover:border-[#FFBD00] flex items-center gap-4 text-[#667085] text-sm font-medium"
          }>
            <Package size={19} color="#101828" />
            Fretes
          </NavLink>
          <NavLink to="/transporter" className={({ isActive }) =>
            isActive ? "flex items-center gap-4 text-[#101828] text-sm font-medium border-r-[4px] border-[#FFBD00]" : "border-r-[4px] border-transparent hover:border-[#FFBD00] flex items-center gap-4 text-[#667085] text-sm font-medium"
          }>
            <Truck size={19} color="#101828" />
            Transportadoras
          </NavLink>
          <NavLink to="/driver" className={({ isActive }) =>
            isActive ? "flex items-center gap-4 text-[#101828] text-sm font-medium border-r-[4px] border-[#FFBD00]" : "border-r-[4px] border-transparent hover:border-[#FFBD00] flex items-center gap-4 text-[#667085] text-sm font-medium"
          }>
            <Users size={19} color="#101828" />
            Motoristas
          </NavLink>
          <NavLink to="/vehicle" className={({ isActive }) =>
            isActive ? "flex items-center gap-4 text-[#101828] text-sm font-medium border-r-[4px] border-[#FFBD00]" : "border-r-[4px] border-transparent hover:border-[#FFBD00] flex items-center gap-4 text-[#667085] text-sm font-medium"
          }>
            <Truck size={19} color="#101828" />
            Veiculos
          </NavLink>
        </nav>

        <div className="w-full bg-[#E1E0E7] h-[1px] mt-[79px] mb-[57px] rounded-full" />

        <nav className="flex flex-col mt-8 gap-12">
          <a href="" className="flex items-center gap-2 text-[#101828] text-sm font-medium">
            <Settings size={19} color="#101828" />
            Configurações
          </a>
          <a href="" className="flex items-center gap-2 text-[#101828] text-sm font-medium">
            <Question size={19} color="#101828" />Ajuda
          </a>
          <a href="" className="flex items-center gap-2 text-[#101828] text-sm font-medium">
            <SignOut size={19} color="#101828" />Sair
          </a>
        </nav>
      </div>

    </aside>
  )
}