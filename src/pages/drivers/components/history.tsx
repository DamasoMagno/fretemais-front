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
import { Driver } from "./driver";

interface Freight {
  id: number;
  freightNumber: string;
  status: "IN_ROUTE" | "WAITING_FOR_BID" | "DELIVERED";
  freightDate: string; // ISO date string
}

// Driver interface
interface Driver {
  id: number;
  fullName: string;
  licenseNumber: string;
  licenseExpirationDate: string;
  freights: Freight[];
}

export function History() {
  const [driverName, setDriverName] = useState("")

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

  const { data } = useQuery({
    queryKey: ["drivers", driverName],
    queryFn: async () => {
      const response = await api.get("/driver", {
        params: {
          driverName
        }
      });
      return response.data as Driver[]
    }
  })

  function handleSetDriverName(event: ChangeEvent<HTMLInputElement>) {
    setDriverName(event.target.value);
  }

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1102px] mx-auto w-full mt-12">
      <div className="flex justify-between items-center px-4">
        <Search
          placeholder="Buscar motorista"
          onChange={handleSetDriverName}
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
                <button onClick={() => handleEditVehicle(String(driver.id))}>
                  <Pencil size={14} color="#667085" />
                </button>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
      <Driver
        driverId={vehicleId}
        onToggleVehicle={handleClose}
        vehicleOpen={openVehicle}
      />
    </div>
  )
}
