import { Pencil, Plus, Trash } from "lucide-react"

import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

import { Search } from "@/components/search";
import { Driver } from "./components/driver";
import { ConfirmDelete } from "@/components/confirm-delete";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Driver interface
interface Driver {
  id: number;
  fullName: string;
  licenseNumber: string;
  licenseExpirationDate: string;
}

export function Drivers() {
  const client = useQueryClient();
  const [driverName, setDriverName] = useState("")

  const [driverId, setDriverId] = useState("");
  const [modalDriverIsOpen, setModalDriverIsOpen] = useState(false);

  function handleOpenModalToEditDriver(driverId: string) {
    setDriverId(driverId);
    setModalDriverIsOpen(true);
  }

  function handleOpenModalToCreateNewDriver() {
    setDriverId("");
    setModalDriverIsOpen(true);
  }

  function handleCloseDriverModal() {
    setDriverId("")
    setModalDriverIsOpen(false)
  }

  function handleSetDriverName(event: ChangeEvent<HTMLInputElement>) {
    setDriverName(event.target.value);
  }

  const { data: drivers } = useQuery({
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

  const { mutateAsync: deleteDriver, isPending } = useMutation({
    mutationFn: async (freightId: number) => {
      await api.delete(`/driver/${freightId}`)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["drivers",]
      })
    }
  })

  async function handleDeleteFreight(driverId: number) {
    try {
      await deleteDriver(driverId);
      toast.success(`Frete ${driverId} deletado!`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1200px] mx-auto w-full mt-12">
      <div className="flex justify-between items-center px-4">
        <Search
          placeholder="Buscar motorista"
          onChange={handleSetDriverName}
        />
        <Button
          variant="outline"
          className="rounded-full flex justify-center items-center"
          onClick={handleOpenModalToCreateNewDriver}
        >
          <Plus color="#000000" size={16} />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[#667085] text-xs">Nome</TableHead>
            <TableHead className="text-[#667085] text-xs">Data</TableHead>
            <TableHead className="text-[#667085] text-xs">Transportadora/Embarcadora</TableHead>
            <TableHead className="text-[#667085] text-xs">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {drivers?.map(driver => (
            <TableRow key={driver.id}>
              <TableCell className="text-[#101828] text-xs" >{driver.fullName}</TableCell>
              <TableCell className="text-[#101828] text-xs">{new Date(driver.licenseExpirationDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-[#101828] text-xs">{driver.licenseNumber}</TableCell>
              <TableCell className="text-[#101828] text-xs flex gap-6">
                <button
                  onClick={() => handleOpenModalToEditDriver(String(driver.id))}
                  title="Editar motorista"
                >
                  <Pencil size={14} color="#667085" />
                </button>
                <ConfirmDelete
                  deletingLoading={isPending}
                  onDelete={() => handleDeleteFreight(driver.id)}
                >
                  <button title="Remover motorista">
                    <Trash size={16} color="#667085" />
                  </button>
                </ConfirmDelete>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
      <Driver
        driverId={driverId}
        onCloseModalDriver={handleCloseDriverModal}
        modalDriverIsOpen={modalDriverIsOpen}
      />
    </div>
  )
}
