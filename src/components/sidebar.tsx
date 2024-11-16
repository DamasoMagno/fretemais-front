import logo from "@/assets/logo.png"
import { Package, SignOut, SquaresFour, Truck, Users } from "phosphor-react"
import { Link } from "react-router-dom"

export function Sidebar() {
  return (
    <aside className="w-[242px] bg-white">
      <header className="w-full bg-[#FFBD00] rounded-b-3xl flex justify-center items-center p-4">
        <img src={logo} alt="logo frete mis" />
      </header>

      <div className="flex flex-col p-4">
        <nav className="flex flex-col mt-8 gap-12">
          <Link to="/" className="flex items-center gap-4 text-[#101828] text-sm font-medium">
            <SquaresFour size={19} color="#101828" />
            Dashboard
          </Link>
          <Link to="/freight" className="flex items-center gap-4 text-[#101828] text-sm font-medium">
            <Package size={19} color="#101828" />
            Fretes
          </Link>
          <Link to="/transporter" className="flex items-center gap-4 text-[#101828] text-sm font-medium">
            <Truck size={19} color="#101828" />
            Transportadores
          </Link>
          <Link to="/driver" className="flex items-center gap-4 text-[#101828] text-sm font-medium">
            <Users size={19} color="#101828" />
            Motoristas
          </Link>
          <Link to="/vehicle" className="flex items-center gap-4 text-[#101828] text-sm font-medium">
            <Truck size={19} color="#101828" />
            Veiculos
          </Link>
        </nav>

        <div className="w-full bg-[#E1E0E7] h-[1px] mt-[79px] mb-[57px] rounded-full" />

        <nav className="flex flex-col mt-8 gap-12">
          <a href="" className="flex items-center gap-2 text-[#101828] text-sm font-medium">
            <SignOut />
            Configurações
          </a>
          <a href="" className="flex items-center gap-2 text-[#101828] text-sm font-medium">
            <SignOut />Ajuda
          </a>
          <a href="" className="flex items-center gap-2 text-[#101828] text-sm font-medium">
            <SignOut />Sair
          </a>
        </nav>
      </div>

    </aside>
  )
}