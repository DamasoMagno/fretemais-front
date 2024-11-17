import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { Search } from "@/components/search";
import { Transporter } from "./components/transporter";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/confirm-delete";

interface Freight {
  id: number;
  freightNumber: string;
  status: string;
  freightDate: string;
}


interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleType: "TRUCK" | "VAN";
}


interface Transporter {
  id: number;
  name: string;
  cnpj: string;
  freights: Freight[];
  vehicles: Vehicle[];
}

export function Transporters() {
  const client = useQueryClient();
  const [transporterName, setTransporterName] = useState("");

  const [vehicleId, setVehicleId] = useState("");
  const [openVehicle, setOpenVehicle] = useState(false);

  let timer: string | number | NodeJS.Timeout | undefined;

  function handleEditVehicle(vehicleId: string) {
    setVehicleId(vehicleId);
    setOpenVehicle(true)
  }

  function handleClose() {
    setOpenVehicle(false)
    setVehicleId("")
  }

  function handleSetTransporterName(event: ChangeEvent<HTMLInputElement>) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      setTransporterName(event.target.value);
    }, 500);
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

  const { mutateAsync: deleteTransporter, isPending } = useMutation({
    mutationFn: async (transporterId: number) => {
      await api.delete(`/transporter/${transporterId}`)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["transporters",]
      })
    }
  })

  async function handleDeleteTransporter(transporterId: number) {
    try {
      await deleteTransporter(transporterId);
      toast.success(`Transportadora ${transporterId} deletada!`);
    } catch (error) {
      console.log(error);
    }
  }

  function formatCNPJ(cnpj: string): string {
    const sanitizedCNPJ = cnpj.replace(/\D/g, '');
    const paddedCNPJ = sanitizedCNPJ.padStart(14, '0');
    return paddedCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1200px] mx-auto w-full mt-12">
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
          {data?.map(transporter => (
            <TableRow key={transporter.id}>
              <TableCell className="text-[#101828] text-xs" >{transporter.name}</TableCell>
              <TableCell className="text-[#101828] text-xs">{formatCNPJ(transporter.cnpj)}</TableCell>
              <TableCell className="text-[#101828] text-xs flex gap-6">
                <button
                  onClick={() => handleEditVehicle(String(transporter.id))}
                  title="Editar transportadora"
                >
                  <Pencil size={14} color="#667085" />
                </button>
                <ConfirmDelete
                  deletingLoading={isPending}
                  onDelete={() => handleDeleteTransporter(transporter.id)}
                >
                  <button title="Remover transportadora">
                    <Trash size={16} color="#667085" />
                  </button>
                </ConfirmDelete>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Transporter
        toggleModalTransporter={handleClose}
        modalTransporteIsOpen={openVehicle}
        transporterId={vehicleId}
      />
    </div>

  )
}
