import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

const vehicleSchema = z.object({
  plateNumber: z.string().min(1, "A placa é obrigatória."),
  vehicleType: z.string().min(1, "Selecione o tipo de veículo."),
  transporter_id: z.coerce.number(),
})

type VehicleInput = z.infer<typeof vehicleSchema>

interface Transporter {
  id: number
  name: string
  cnpj: string
}

interface Vehicle {
  id: number
  plateNumber: string
  vehicleType: string
  transporter: Transporter
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

  // Queries
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

  // Form setup
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plateNumber: "",
      vehicleType: "",
      transporter_id: 0,
    },
  })

  useEffect(() => {
    reset({
      plateNumber: "",
      transporter_id: 0,
      vehicleType: ""
    })

    if (vehicle) {
      reset({
        plateNumber: vehicle.plateNumber,
        vehicleType: vehicle.vehicleType,
        transporter_id: vehicle.transporter.id,
      })
    }
  }, [vehicle, reset])

  const { mutateAsync: updateVehicle } = useMutation({
    mutationFn: async (data: VehicleInput) => {
      await api.put(`/vehicle/${vehicleId}`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["vehicles"]
      })
      toast.success("Veículo atualizado com sucesso!")
      onToggleVehicle()
    },
  })

  const { mutateAsync: createVehicle } = useMutation({
    mutationFn: async (data: VehicleInput) => {
      await api.post(`/vehicle`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["vehicles"]
      })
      toast.success("Veículo cadastrado com sucesso!")
      reset()
      onToggleVehicle()
    },
  })

  // Form submission
  const onSubmit = async (data: VehicleInput) => {
    if (vehicleId) {
      await updateVehicle(data)
    } else {
      await createVehicle(data)
    }
  }

  return (
    <Sheet onOpenChange={onToggleVehicle} open={vehicleOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{vehicleId ? "Editar veículo" : "Cadastrar veículo"}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="plateNumber">Número da placa</Label>
            <Input
              id="plateNumber"
              placeholder="Ex: ABC-1234"
              {...register("plateNumber")}
            />
            {errors.plateNumber && <span className="text-red-500 text-sm">{errors.plateNumber.message}</span>}
          </div>

          <div>
            <Label htmlFor="vehicleType">Tipo de veículo</Label>
            <Select
              value={vehicle?.vehicleType || ""}
              onValueChange={(value) => setValue("vehicleType", value)}
            >
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Selecione o tipo de veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRUCK">Caminhão</SelectItem>
                <SelectItem value="VAN">Van</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicleType && <span className="text-red-500 text-sm">{errors.vehicleType.message}</span>}
          </div>

          <div>
            <Label htmlFor="transporter_id">Transportadora</Label>
            <Select
              value={String(vehicle?.transporter.id || "")}
              onValueChange={(value) => setValue("transporter_id", parseInt(value))}
            >
              <SelectTrigger id="transporter_id">
                <SelectValue placeholder="Selecione a transportadora" />
              </SelectTrigger>
              <SelectContent>
                {transporters?.map((transporter) => (
                  <SelectItem value={String(transporter.id)} key={transporter.id}>
                    {transporter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Button className="bg-[#FFBD00]" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : vehicleId ? "Atualizar" : "Cadastrar"}
            </Button>
            <SheetClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </SheetClose>
          </div>

        </form>
      </SheetContent>
    </Sheet>
  )
}
