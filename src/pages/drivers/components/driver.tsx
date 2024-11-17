import { useForm, Controller } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/services/api"

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
import { useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

const driverSchema = z.object({
  fullName: z.string().min(1, "Por favor, informe o nome completo do motorista."),
  licenseNumber: z.string().min(1, "O número da licença é obrigatório."),
  licenseExpirationDate: z.string().min(1, "A data de expiração da licença é obrigatória."),
})

type DriverInput = z.infer<typeof driverSchema>

interface Driver {
  fullName: string
  licenseNumber: string
  licenseExpirationDate: string;
}

interface DriverProps {
  driverId: string
  onCloseModalDriver: () => void
  modalDriverIsOpen: boolean
}

export function Driver({
  driverId,
  onCloseModalDriver,
  modalDriverIsOpen,
}: DriverProps) {
  const client = useQueryClient()

  const { data: driver } = useQuery({
    queryKey: ["driver", driverId],
    queryFn: async () => {
      const response = await api.get(`/driver/${driverId}`)
      return response.data as Driver
    },
    enabled: !!driverId,
  })

  const { handleSubmit, register, reset, control, formState: {
    isSubmitting,
    errors
  } } = useForm<DriverInput>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: "",
      licenseExpirationDate: "",
      licenseNumber: "",
    },
  });

  useEffect(() => {
    reset({
      fullName: "",
      licenseExpirationDate: "",
      licenseNumber: ""
    })

    if (driver) {
      reset({
        fullName: driver.fullName,
        licenseExpirationDate: driver.licenseExpirationDate,
        licenseNumber: driver.licenseNumber,
      });
    }
  }, [driver, reset]);

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
      await api.post(`/driver`, data)
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
        toast.success("Motorista atualizdo!");
      } else {
        await create(data)
        toast.success("Motorista cadastrado!");
      }

      reset()
      onCloseModalDriver()
    } catch (error) {
      console.log(error)
    }
  }

  console.log(errors)

  return (
    <Sheet
      onOpenChange={onCloseModalDriver}
      open={modalDriverIsOpen}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{driverId ? "Editar motorista" : "Novo motorista"}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName" className="text-[#475467]">Nome completo</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="Nome completo"
              />
              {errors.fullName?.message && <span className="text-[10px] text-red-500">{errors.fullName.message}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="licenseNumber" className="text-[#475467]">Número da placa</Label>
              <Input
                {...register("licenseNumber")}
                id="licenseNumber"
                placeholder="Número da placa"
              />
              {errors.licenseNumber?.message && <span className="text-[10px] text-red-500">{errors.licenseNumber.message}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-[#475467]">Data de expiração</Label>
              <Controller
                name="licenseExpirationDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "yyyy-MM-dd") // Atualiza o texto ao mudar a data
                        ) : (
                          <span>Selecionar a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => {
                          if (date) {
                            const formattedDate = format(date, "yyyy-MM-dd");
                            field.onChange(formattedDate);
                          }
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.licenseExpirationDate?.message && <span className="text-[10px] text-red-500">{errors.licenseExpirationDate.message}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button className="bg-[#FFBD00]">
              {isSubmitting ? <Loader2 className="animate-spin" /> : driverId ? "Atualizar" : "Cadastrar"}

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
