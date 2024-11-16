import { Search as SearchIcon } from "lucide-react"
import { Input } from "./ui/input"
import { ComponentProps, forwardRef } from "react"

export const Search = forwardRef<HTMLInputElement, ComponentProps<"input">>((props, ref) => {
  return (
    <div className="flex items-center focus-within:ring-2 focus-within:ring-ring border border-input px-2 rounded-xl max-w-[300px]">
      <SearchIcon color="#667085" size={16} />
      <Input
        className="text-[#667085] border-0 outline-0 focus-visible:ring-[0]"
        placeholder="Buscar motorista"
        {...props}
        ref={ref}
      />
    </div>
  )
})