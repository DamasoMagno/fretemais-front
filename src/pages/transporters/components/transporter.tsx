import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import InputMask from 'react-input-mask';
import { z } from "zod"

import { api } from "@/services/api"

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
import { useEffect } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"


const transporterSchema = z.object({
  name: z.string().min(1, "Nome da transportadora exigido"),
  cnpj: z.string().min(1, "CNPJ da transportadora exigido"),
})

type TransporterInput = z.infer<typeof transporterSchema>

interface Transporter {
  name: string
  cnpj: string
}

export function Transporter({
  transporterId,
  toggleModalTransporter,
  modalTransporteIsOpen,
}: {
  transporterId: string
  toggleModalTransporter: () => void
  modalTransporteIsOpen: boolean
}) {
  const client = useQueryClient()

  const { data: transporter } = useQuery({
    queryKey: ["transporter", transporterId],
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
    formState: {
      isSubmitting
    }
  } = useForm<TransporterInput>({
    resolver: zodResolver(transporterSchema),
    defaultValues: {
      name: transporter?.name || "",
      cnpj: transporter?.cnpj || "",
    },
  })

  useEffect(() => {
    reset({
      name: "",
      cnpj: "",
    })

    if (transporter) {
      reset({
        name: transporter.name,
        cnpj: transporter.cnpj,
      });
    }
  }, [transporter, reset]);

  const { mutateAsync } = useMutation({
    mutationFn: async (data: TransporterInput) => {
      await api.put(`/transporter/${transporterId}`, data)
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
        toast.success("Transpotadora atualizada!");
      } else {
        await create(data)
        toast.success("Transpotadora cadastrada!");
      }

      reset()
      toggleModalTransporter()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Sheet onOpenChange={toggleModalTransporter} open={modalTransporteIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{transporterId ? "Editar transportadora" : "Nova transportadora"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Data do frete</Label>
              <Input {...register("name")} placeholder="Nome da transportadora"></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Transportadora</Label>
              <InputMask
                mask="99.999.999/9999-99"
                alwaysShowMask={false}
                {...register("cnpj")} placeholder="CNPJ da transportadora"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />

            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button className="bg-[#FFBD00]">
              {isSubmitting ? <Loader2 className="animate-spin" /> : transporterId ? "Atualizar" : "Cadastrar"}
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
