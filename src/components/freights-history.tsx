import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Plus, Search } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

interface Transporter {
  id: number;
  name: string;
  cnpj: string;
}

// Driver interface
interface Driver {
  id: number;
  name: string;
}

// Freight interface
interface Freight {
  id: number;
  freightNumber: string;
  status: "IN_ROUTE" | "COMPLETED" | "PENDING"; // Enum-like type
  freightDate: string; // ISO 8601 date format
  transporter: Transporter;
  driver: Driver | null; // Allowing null if driver is not assigned
}

export function History() {
  const { data } = useQuery({
    queryKey: ["freights"],
    queryFn: async () => {
      const response = await api.get("/freight");
      return response.data as Freight[]
    }
  })

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1102px] mx-auto w-full mt-12">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center focus-within:ring-2 focus-within:ring-ring border border-input px-2 rounded-xl max-w-[300px]">
          <Search color="#667085" size={16} />
          <Input
            className="text-[#667085] border-0 outline-0 focus-visible:ring-[0]"
            placeholder="Buscar frete"
          />
        </div>
        <Button variant="outline" className="rounded-full flex justify-center items-center">
          <Plus color="#000000" size={16} />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[#667085] text-xs">Número</TableHead>
            <TableHead className="text-[#667085] text-xs">Data</TableHead>
            <TableHead className="text-[#667085] text-xs">Transportadora/Embarcdora</TableHead>
            <TableHead className="text-[#667085] text-xs">Tipo de carga</TableHead>
            <TableHead className="text-[#667085] text-xs">Status</TableHead>
            <TableHead className="text-[#667085] text-xs">Custo total (R$)</TableHead>
            <TableHead className="text-[#667085] text-xs">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(freight => (
            <TableRow key={freight.id}>
              <TableCell className="text-[#101828] text-xs" >{freight.freightNumber}</TableCell>
              <TableCell className="text-[#101828] text-xs">{new Date(freight.freightDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-[#101828] text-xs">{freight.transporter?.name}</TableCell>
              <TableCell className="text-[#101828] text-xs">Nome da carga</TableCell>
              <TableCell className="text-[#101828] text-xs">{freight.status}</TableCell>
              <TableCell className="text-[#101828] text-xs">R$ 1200.00</TableCell>
              <TableCell className="text-[#101828] text-xs">
                <button>
                  <Pencil size={14} color="#667085" />
                </button>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </div>

  )
}
