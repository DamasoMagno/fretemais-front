import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"

interface Driver {
  id: number;
  name: string;
}

interface Transporter {
  id: number;
  name: string;
  cnpj: string;
}

type VehicleType = 'TRUCK' | 'VAN';
type CargoType = 'PERISHABL' | "HAZARDOUS";

interface Freight {
  id: number;
  status: 'IN_ROUTE' | 'WAITING_FOR_BID' | 'DELIVERED';
  freightDate: string;
  cargoType: CargoType;
  totalCoast: number;
  vehicleType: VehicleType;
  totalCost: number;
  driver: Driver;
  transporter: Transporter;
}

interface DriverFreight {
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
  freights: DriverFreight[];
}

type Status = "IN_ROUTE" | "WAITING_FOR_BID" | "DELIVERED"

const freightSchema = z.object({
  status: z.enum(["IN_ROUTE", "WAITING_FOR_BID", "DELIVERED"]),
  freightDate: z.coerce.date(),
  transporter_id: z.coerce.number(),
  driver_id: z.coerce.number(),
  vehicleType: z.enum(["TRUCK", "VAN"]),
  cargoType: z.enum(["HAZARDOUS", "PERISHABL"]),
})

type FreightInput = z.infer<typeof freightSchema>

export function Freight({
  freightId,
  onToggleVehicle,
  vehicleOpen,
}: {
  freightId: string
  onToggleVehicle: () => void
  vehicleOpen: boolean
}) {
  const client = useQueryClient()

  const { data: freight } = useQuery({
    queryKey: ["freight", freightId],
    queryFn: async () => {
      const response = await api.get(`/freight/${freightId}`)
      return response.data as Freight
    },
    enabled: !!freightId,
  })

  const { data: transporters } = useQuery({
    queryKey: ["transporters"],
    queryFn: async () => {
      const response = await api.get("/transporter")
      return response.data as Transporter[]
    },
  })

  const { data: drivers } = useQuery({
    queryKey: ["drivers-list"],
    queryFn: async () => {
      const response = await api.get("/driver")
      return response.data as Driver[]
    },
  })

  const { handleSubmit, register, setValue, reset } = useForm<FreightInput>({
    resolver: zodResolver(freightSchema),
    values: {
      freightDate: freight?.freightDate ? new Date(freight.freightDate) : new Date(), // Se freight.freightDate for uma string, converte para Date
      driver_id: freight?.driver?.id || 0,
      cargoType: freight?.cargoType || "PERISHABL",
      status: freight?.status || "IN_ROUTE",
      transporter_id: freight?.transporter?.id || 0,
      vehicleType: freight?.vehicleType || "VAN"
    }
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: FreightInput) => {
      await api.put(`/freight/${freightId}`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["freights"],
      })
    },
  })

  const { mutateAsync: createFreight } = useMutation({
    mutationFn: async (data: FreightInput) => {
      await api.post(`/freight`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["freights"],
      })
    },
  })

  const onSubmit = async (data: FreightInput) => {
    try {
      if (freightId) {
        await mutateAsync(data)
      } else {
        await createFreight(data)
        reset()
        onToggleVehicle()
      }
      console.log("Vehicle submitted successfully!")
    } catch (error) {
      console.log(error)
    }
  }

  console.log(drivers)

  return (
    <Sheet onOpenChange={onToggleVehicle} open={vehicleOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo frete</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span>Status do frete</span>

          <RadioGroup
            defaultValue={freight?.status}
            className="flex items-center justify-between"
            onValueChange={event => setValue("status", event as Status)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="IN_ROUTE" id="IN_ROUTE" />
              <Label htmlFor="IN_ROUTE">Em rota</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="WAITING_FOR_BID" id="WAITING_FOR_BID" />
              <Label htmlFor="WAITING_FOR_BID">Aguardando lance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DELIVERED" id="DELIVERED" />
              <Label htmlFor="DELIVERED">Entregue</Label>
            </div>
          </RadioGroup>

          <div className="flex flex-col gap-4 mt-8">
            <div className="flex flex-col gap-2">
              <Label className="text-[#475467]">Data do frete</Label>
              <Input {...register("freightDate")} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="transporter_id">Transportadora</Label>
              <Select
                defaultValue={freight?.transporter?.id ? String(freight?.transporter?.id) : ""}
                onValueChange={(e) => setValue("transporter_id", parseInt(e))}
              >
                <SelectTrigger id="transporter_id">
                  <SelectValue placeholder="Selecione a transportadora" />
                </SelectTrigger>
                <SelectContent>
                  {transporters?.map((transport) => (
                    <SelectItem value={String(transport.id)} key={transport.id}>
                      {transport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="transporter_id">Motorista</Label>
              <Select
                defaultValue={freight?.driver?.id ? String(freight?.driver?.id) : ""}
                onValueChange={(e) => setValue("driver_id", Number(e))}
              >
                <SelectTrigger id="driver_id">
                  <SelectValue placeholder="Selecione o motorista" />
                </SelectTrigger>
                <SelectContent>
                  {drivers?.map((transport) => (
                    <SelectItem value={String(transport.id)} key={transport.id}>
                      {transport.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de veículo</Label>
              <Select
                onValueChange={e => setValue("vehicleType", e as VehicleType)}
              >
                <SelectTrigger >
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VAN">VAN</SelectItem>
                  <SelectItem value="TRUC">TRUCK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de carga</Label>
              <Select
                onValueChange={e => setValue("cargoType", e as CargoType)}
              >
                <SelectTrigger >
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HAZARDOUS">Light</SelectItem>
                  <SelectItem value="PERISHABL">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="flex flex-col gap-2">
              <Label>Tipo de pagamento</Label>
              <Select
                onValueChange={e => setValue("", e as any)}
              >
                <SelectTrigger >
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Button className="bg-[#FFBD00]" type="submit">
              Cadastrar
            </Button>
            <SheetClose asChild>
              <Button variant="ghost">
                Cancelar
              </Button>
            </SheetClose>
          </div>

        </form>
      </SheetContent>
    </Sheet>
  )
}
