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
import { Transporter } from "./transporter";

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
  vehicleType: "TRUCK" | "VAN";
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
  const [transporterName, setTransporterName] = useState("");

  const [vehicleId, setVehicleId] = useState("");
  const [openVehicle, setOpenVehicle] = useState(false);

  function handleEditVehicle(vehicleId: string) {
    setVehicleId(vehicleId);
    setOpenVehicle(true)
  }

  function handleClose() {
    setOpenVehicle(false)
    setVehicleId("")
  }

  function handleSetTransporterName(event: ChangeEvent<HTMLInputElement>) {
    setTransporterName(event.target.value);
  }

  const { data } = useQuery({
    queryKey: ["transporters", transporterName],
    queryFn: async () => {
      const response = await api.get("/transporter", {
        params: {
          transporterName
        }
      });
      return response.data as Transporter[]
    }
  })

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1102px] mx-auto w-full mt-12">
      <div className="flex justify-between items-center px-4">
        <Search onChange={handleSetTransporterName} placeholder="Buscar transportadoras" />
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
                <button onClick={() => handleEditVehicle(String(freight.id))}>
                  <Pencil size={14} color="#667085" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Transporter
        onToggleVehicle={handleClose}
        vehicleOpen={openVehicle}
        transporterId={vehicleId}
      />
    </div>

  )
}
