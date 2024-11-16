import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,

} from "@/components/ui/sheet"
import { X } from "phosphor-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"

const driverSchema = z.object({
  fullName: z.string(),
  licenseNumber: z.string(),
  licenseExpirationDate: z.coerce.date(),
})

type DriverInput = z.infer<typeof driverSchema>

export function Driver({
  driverId,
  onToggleVehicle,
  vehicleOpen,
}: {
  driverId: string
  onToggleVehicle: () => void
  vehicleOpen: boolean
}) {
  const client = useQueryClient()

  const { data: driver } = useQuery({
    queryKey: ["driver", driverId],
    queryFn: async () => {
      const response = await api.get(`/driver/${driverId}`)
      return response.data as DriverInput
    },
    enabled: !!driverId,
  })

  const { handleSubmit, register, reset } = useForm<DriverInput>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: "",
      licenseExpirationDate: new Date(),
      licenseNumber: "",
    },
  })

  // Atualiza os valores do formulário quando `driver` muda
  useEffect(() => {
    reset()

    if (driver) {
      reset({
        fullName: driver.fullName,
        licenseExpirationDate: new Date(driver.licenseExpirationDate),
        licenseNumber: driver.licenseNumber,
      })
    }
  }, [driver, reset])

  const { mutateAsync } = useMutation({
    mutationFn: async (data: DriverInput) => {
      await api.put(`/driver/${driverId}`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["drivers"],
      })
    },
  })

  const { mutateAsync: create } = useMutation({
    mutationFn: async (data: DriverInput) => {
      await api.post(`/drivers`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["drivers"],
      })
    },
  })

  const onSubmit = async (data: DriverInput) => {
    try {
      if (driverId) {
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
          <SheetTitle>Novo frete</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span>Status do frete</span>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Data do frete</Label>
              <Input {...register("fullName")} placeholder="Nome da transportadora"></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Data do frete</Label>
              <Input {...register("licenseNumber")} placeholder="Nome da transportadora"></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Transportadora</Label>
              <Input {...register("licenseExpirationDate")} placeholder="CNPJ da transportadora"></Input>
            </div>
          </div>
          <Button>
            Cadastrar
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
