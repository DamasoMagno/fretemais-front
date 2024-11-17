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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { Search } from "@/components/search";
import { Freight } from "./components/freight";
import { Trash } from "phosphor-react";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/confirm-delete";
import { formatCurrency } from "@/utils/format-currency";

interface Transporter {
  id: number;
  name: string;
  cnpj: string;
}


interface Driver {
  id: number;
  name: string;
}

type CargoType = 'PERISHABL' | "HAZARDOUS";
type Status = "IN_ROUTE" | "WAITING_FOR_BID" | "DELIVERED";


interface Freight {
  id: number;
  freightNumber: string;
  status: Status;
  freightDate: string;
  transporter: Transporter;
  cargoType: CargoType;
  driver: Driver | null
  totalCoast: number;
}

const FREIGHT_STATUS = {
  "IN_ROUTE": "Em rota",
  "WAITING_FOR_BID": "Aguardando lance",
  "DELIVERED": "Entregue"
}

export function Freights() {
  const client = useQueryClient();
  const [freightNumber, setFreightNumber] = useState("")

  const [freightId, setFreightId] = useState("");
  const [modalFreightIsOpen, setModalFreightIsOpen] = useState(false);

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

  const { mutateAsync: deleteFreight, isPending } = useMutation({
    mutationFn: async (freightId: number) => {
      await api.delete(`/freight/${freightId}`)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["freights",]
      })
    }
  })

  function handleEditVehicle(vehicleId: string) {
    setFreightId(vehicleId);
    setModalFreightIsOpen(true)
  }

  async function handleDeleteFreight(freightId: number) {
    try {
      await deleteFreight(freightId);
      toast.success(`Frete ${freightId} deletado!`);
    } catch (error) {
      console.log(error);
    }
  }

  function handleClose() {
    setFreightId("")
    setModalFreightIsOpen(false)
  }

  return (
    <div className="bg-white flex flex-col gap-2 pt-4 rounded-md max-w-[1200px] mx-auto w-full mt-12">
      <div className="flex justify-between items-center px-4">
        <Search
          onChange={handleSetFreightNumber}
          placeholder="Buscar frete por número"
        />
        <Button
          variant="outline"
          className="rounded-full flex justify-center items-center"
          onClick={() => setModalFreightIsOpen(true)}
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
              <TableCell className="text-[#101828] text-xs">{freight.cargoType}</TableCell>
              <TableCell className="text-[#101828] text-xs">{FREIGHT_STATUS[freight.status]}</TableCell>
              <TableCell className="text-[#101828] text-xs">{formatCurrency(freight.totalCoast)}</TableCell>
              <TableCell className="text-[#101828] text-xs flex gap-6">
                <button
                  onClick={() => handleEditVehicle(String(freight.id))}
                  title="Editar frete"
                >
                  <Pencil size={14} color="#667085" />
                </button>
                <ConfirmDelete
                  deletingLoading={isPending}
                  onDelete={() => handleDeleteFreight(freight.id)}
                >
                  <button title="Remover frete">
                    <Trash size={16} color="#667085" />
                  </button>
                </ConfirmDelete>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Freight
        toggleModalFreight={handleClose}
        modalFreightIsOpen={modalFreightIsOpen}
        freightId={freightId}
      />
    </div>

  )
}
