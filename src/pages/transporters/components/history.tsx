import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Freight {
  id: number;
  freightNumber: string;
  status: string; // Enum-like type could be used if known
  freightDate: string; // ISO 8601 date format
}

// Vehicle interface
interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleType: "CAR" | "TRUCK" | "VAN" | string; // Enum-like type with potential other values
}

// Transporter interface
interface Transporter {
  id: number;
  name: string;
  cnpj: string;
  freights: Freight[]; // Empty array in the example but allows for future freight objects
  vehicles: Vehicle[]; // List of vehicles associated with the transporter
}

export function History() {
  const [name, setName] = useState("");

  const { data } = useQuery({
    queryKey: ["transporters", name],
    queryFn: async () => {
      const response = await api.get("/transporter", {
        params: {
          name
        }
      });
      return response.data as Transporter[]
    }
  })

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1102px] mx-auto w-full mt-12">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center focus-within:ring-2 focus-within:ring-ring border border-input px-2 rounded-xl max-w-[300px]">
          <Search color="#667085" size={16} />
          <Input
            className="text-[#667085] border-0 outline-0 focus-visible:ring-[0]"
            placeholder="Buscar transportadora"
            onChange={e => setName(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-full flex justify-center items-center">
          <Plus color="#000000" size={16} />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[#667085] text-xs">Nome</TableHead>
            <TableHead className="text-[#667085] text-xs">CNPJ</TableHead>
            <TableHead className="text-[#667085] text-xs">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(freight => (
            <TableRow key={freight.id}>
              <TableCell className="text-[#101828] text-xs" >{freight.name}</TableCell>
              <TableCell className="text-[#101828] text-xs">{freight.cnpj}</TableCell>
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
