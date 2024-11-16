import { ChevronDown } from "lucide-react";
import { Bell } from "phosphor-react";

export function Header() {
  return (
    <header className="bg-[#FFFFFF] flex justify-between items-center h-[78px] py-4 px-12">
      <h3 className="font-bold text-2xl text-[#33303E]">Fretes</h3>

      <div className="flex items-center gap-8">
        <div className="relative">
          <Bell color="#8C8A97" size={20} weight="bold" />
          <div className="w-2 h-2 bg-[#AFAEB6] rounded-full top-0 right-0 absolute" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#AFAEB6] rounded-full"></div>
          <span>Olá, <strong>Robert</strong></span>
        </div>

        <ChevronDown color="#AFAEB6" size={20} />
      </div>
    </header>
  )
}