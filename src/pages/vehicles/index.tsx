import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { Search } from "@/components/search";
import { Vehicle } from "./components/vehicle";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/confirm-delete";

// Transporter interface
interface Transporter {
  id: number;
  name: string;
  cnpj: string;
}

interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleType: string;
  transporter: Transporter;
}

export function Vehicles() {
  const client = useQueryClient();
  const [plateNumber, setPlateNumber] = useState("");

  const [vehicleId, setVehicleId] = useState("");
  const [openVehicle, setOpenVehicle] = useState(false);

  function handleSetPlateNumber(event: ChangeEvent<HTMLInputElement>) {
    setPlateNumber(event.target.value);
  }

  function handleEditVehicle(vehicleId: string) {
    setVehicleId(vehicleId);
    setOpenVehicle(true);
  }

  function handleClose() {
    setOpenVehicle(false);
    setVehicleId("");
  }

  const { data } = useQuery({
    queryKey: ["vehicles", plateNumber],
    queryFn: async () => {
      const response = await api.get("/vehicle", {
        params: {
          plateNumber,
        },
      });
      return response.data as Vehicle[];
    },
  });

  const { mutateAsync: deleteVehicle, isPending } = useMutation({
    mutationFn: async (vehicleId: number) => {
      await api.delete(`/vehicle/${vehicleId}`);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["vehicles"],
      });
      toast.success(`Veículo deletado com sucesso!`);
    },
    onError: () => {
      toast.error("Erro ao deletar o veículo.");
    },
  });

  async function handleDeleteVehicle(vehicleId: number) {
    try {
      await deleteVehicle(vehicleId);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1200px] mx-auto w-full mt-12">
      <div className="flex justify-between items-center px-4">
        <Search onChange={handleSetPlateNumber} placeholder="Buscar veículo" />
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
            <TableHead className="text-[#667085] text-xs">Número da placa</TableHead>
            <TableHead className="text-[#667085] text-xs">Tipo de veículo</TableHead>
            <TableHead className="text-[#667085] text-xs">Transportadora</TableHead>
            <TableHead className="text-[#667085] text-xs">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="text-[#101828] text-xs">{vehicle.plateNumber}</TableCell>
              <TableCell className="text-[#101828] text-xs">{vehicle.vehicleType}</TableCell>
              <TableCell className="text-[#101828] text-xs">{vehicle.transporter.name}</TableCell>
              <TableCell className="text-[#101828] text-xs flex gap-6">
                <button onClick={() => handleEditVehicle(String(vehicle.id))}>
                  <Pencil size={14} color="#667085" />
                </button>
                <ConfirmDelete
                  deletingLoading={isPending}
                  onDelete={() => handleDeleteVehicle(vehicle.id)}
                >
                  <button title="Remover veículo">
                    <Trash size={16} color="#667085" />
                  </button>
                </ConfirmDelete>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Vehicle
        onToggleVehicle={handleClose}
        vehicleOpen={openVehicle}
        vehicleId={vehicleId}
      />
    </div>
  );
}
