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
import { api } from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { X } from "phosphor-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const transporterSchema = z.object({
  name: z.string(),
  cnpj: z.string(),
})

type TransporterInput = z.infer<typeof transporterSchema>

interface Transporter {
  name: string
  cnpj: string
}

export function Transporter({
  transporterId,
  onToggleVehicle,
  vehicleOpen,
}: {
  transporterId: string
  onToggleVehicle: () => void
  vehicleOpen: boolean
}) {
  const client = useQueryClient()

  const { data: transporter } = useQuery({
    queryKey: ["vehicle", transporterId],
    queryFn: async () => {
      const response = await api.get(`/transporter/${transporterId}`)
      return response.data as Transporter
    },
    enabled: !!transporterId,
  })

  const {
    handleSubmit,
    register,
    reset,
  } = useForm<TransporterInput>({
    resolver: zodResolver(transporterSchema),
    values: {
      name: transporter?.name || "",
      cnpj: transporter?.cnpj || "",
    },
  })

  const { mutateAsync } = useMutation({
    mutationFn: async (data: TransporterInput) => {
      await api.put(`/vehicle/${transporterId}`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["transporters"],
      })
    },
  })

  const { mutateAsync: create } = useMutation({
    mutationFn: async (data: TransporterInput) => {
      await api.post(`/transporter`, data)
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["transporters"],
      })
    },
  })

  const onSubmit = async (data: TransporterInput) => {
    try {
      if (transporterId) {
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
              <Input {...register("name")} placeholder="Nome da transportadora"></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Transportadora</Label>
              <Input {...register("cnpj")} placeholder="CNPJ da transportadora"></Input>
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
