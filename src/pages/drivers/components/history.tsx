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
  status: "IN_ROUTE" | "PENDING" | "COMPLETED" | string; // Enum-like type for known values
  freightDate: string; // ISO date string
}

// Driver interface
interface Driver {
  id: number;
  fullName: string;
  licenseNumber: string;
  licenseExpirationDate: string; // ISO date string
  freights: Freight[];
}

export function History() {
  const [driver, setDriver] = useState("")

  const { data } = useQuery({
    queryKey: ["drivers", driver],
    queryFn: async () => {
      const response = await api.get("/driver", {
        params: {
          name: driver
        }
      });
      return response.data as Driver[]
    }
  })

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1102px] mx-auto w-full mt-12">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center focus-within:ring-2 focus-within:ring-ring border border-input px-2 rounded-xl max-w-[300px]">
          <Search color="#667085" size={16} />
          <Input
            className="text-[#667085] border-0 outline-0 focus-visible:ring-[0]"
            placeholder="Buscar motorista"
            onChange={e => setDriver(e.target.value)}
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
            <TableHead className="text-[#667085] text-xs">Data</TableHead>
            <TableHead className="text-[#667085] text-xs">Transportadora/Embarcdora</TableHead>
            <TableHead className="text-[#667085] text-xs">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(driver => (
            <TableRow key={driver.id}>
              <TableCell className="text-[#101828] text-xs" >{driver.fullName}</TableCell>
              <TableCell className="text-[#101828] text-xs">{new Date(driver.licenseExpirationDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-[#101828] text-xs">{driver.licenseNumber}</TableCell>
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
