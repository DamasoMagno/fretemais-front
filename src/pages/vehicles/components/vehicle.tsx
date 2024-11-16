import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { X } from "phosphor-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const vehicleSchema = z.object({
  plateNumber: z.string(),
  vehicleType: z.string(),
  transporter_id: z.coerce.number(),
})

type VehicleInput = z.infer<typeof vehicleSchema>

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

export function Vehicle({
  vehicleId,
  onToggleVehicle,
  vehicleOpen,
}: {
  vehicleId: string
  onToggleVehicle: () => void
  vehicleOpen: boolean
}) {
  const client = useQueryClient()

  const { data: vehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => {
      const response = await api.get(`/vehicle/${vehicleId}`)
      return response.data as Vehicle
    },
    enabled: !!vehicleId,
  })

  const { data: transporters } = useQuery({
    queryKey: ["transporters"],
    queryFn: async () => {
      const response = await api.get("/transporter")
      return response.data as Transporter[]
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    values: {
      plateNumber: vehicle?.plateNumber || "",
      vehicleType: vehicle?.vehicleType || "",
      transporter_id: vehicle?.transporter.id || 0,
    },
  })

  const { mutateAsync } = useMutation({
    mutationFn: async (data: VehicleInput) => {
      await api.put(`/vehicle/${vehicleId}`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["vehicles"],
      })
    },
  })

  const { mutateAsync: create } = useMutation({
    mutationFn: async (data: VehicleInput) => {
      await api.post(`/vehicle`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["vehicles"],
      })
    },
  })

  const onSubmit = async (data: VehicleInput) => {
    try {
      if (vehicleId) {
        await mutateAsync(data)
      } else {
        await create(data)
        reset()
        onToggleVehicle()
      }
      console.log("Vehicle submitted successfully!")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Sheet onOpenChange={onToggleVehicle} open={vehicleOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar veículo</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="plateNumber">Número da placa</Label>
              <Input
                id="plateNumber"
                placeholder="Número da placa"
                {...register("plateNumber")}
                value={vehicle?.plateNumber || ""}
              />
              {errors.plateNumber && <span>{errors.plateNumber.message}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vehicleType">Tipo de veículo</Label>
              <Select
                value={vehicle?.vehicleType || ""}
                onValueChange={(e) => setValue("vehicleType", e)}
              >
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Selecione o tipo de veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRUCK">Caminhão</SelectItem>
                  <SelectItem value="VAN">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="transporter_id">Transportadora</Label>
              <Select
                value={vehicle?.transporter.id ? String(vehicle?.transporter.id) : ""}
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
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Cadastrar"}
          </Button>
          <SheetClose>
            Cancelar
          </SheetClose>
        </form>

        <SheetFooter>
          <SheetClose asChild>
            <button className="cursor-pointer">
              <X color="#FFBD00" size={14} />
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
