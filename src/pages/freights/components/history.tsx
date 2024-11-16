import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { Search } from "@/components/search";
import { Freight } from "./freight";

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
  status: "IN_ROUTE" | "WAITING_FOR_BID" | "DELIVERED";
  freightDate: string;
  transporter: Transporter;
  driver: Driver | null;
}

export function History() {
  const [freightNumber, setFreightNumber] = useState("")

  const [vehicleId, setVehicleId] = useState("");
  const [openVehicle, setOpenVehicle] = useState(false);


  function handleSetFreightNumber(event: ChangeEvent<HTMLInputElement>) {
    setFreightNumber(event.target.value);
  }

  const { data } = useQuery({
    queryKey: ["freights", freightNumber],
    queryFn: async () => {
      const response = await api.get("/freight", {
        params: {
          freightNumber
        }
      });
      return response.data as Freight[]
    }
  })

  function handleEditVehicle(vehicleId: string) {
    setVehicleId(vehicleId);
    setOpenVehicle(true)
  }

  function handleClose() {
    setOpenVehicle(false)
    setVehicleId("")
  }

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1102px] mx-auto w-full mt-12">
      <div className="flex justify-between items-center px-4">
        <Search
          onChange={handleSetFreightNumber}
          placeholder="Buscar frete"
        />
        <Button
          variant="outline"
          className="rounded-full flex justify-center items-center"
          onClick={() => setOpenVehicle(true)}
        >
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
              <TableCell className="text-[#101828] text-xs" >{freight.id}</TableCell>
              <TableCell className="text-[#101828] text-xs">{new Date(freight.freightDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-[#101828] text-xs">{freight.transporter?.name}</TableCell>
              <TableCell className="text-[#101828] text-xs">Nome da carga</TableCell>
              <TableCell className="text-[#101828] text-xs">{freight.status}</TableCell>
              <TableCell className="text-[#101828] text-xs">R$ 1200.00</TableCell>
              <TableCell className="text-[#101828] text-xs">
                <button onClick={() => handleEditVehicle(String(freight.id))}>
                  <Pencil size={14} color="#667085" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Freight
        onToggleVehicle={handleClose}
        vehicleOpen={openVehicle}
        freightId={vehicleId}
      />
    </div>

  )
}
