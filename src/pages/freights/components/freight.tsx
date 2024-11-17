import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/services/api"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useEffect } from "react"

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
type Status = "IN_ROUTE" | "WAITING_FOR_BID" | "DELIVERED";

interface Freight {
  id: number;
  status: Status;
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
  status: Status;
  freightDate: string;
}

interface Driver {
  id: number;
  fullName: string;
  licenseNumber: string;
  licenseExpirationDate: string;
  freights: DriverFreight[];
}

const freightSchema = z.object({
  status: z.enum(["IN_ROUTE", "WAITING_FOR_BID", "DELIVERED"], {
    errorMap: () => ({ message: "Status obrigatório" })
  }),
  freightDate: z.coerce.date({
    errorMap: () => ({ message: "Data de entrega obrigatória" })
  }),
  transporter_id: z.coerce.number().min(1, { message: "Transportadora obrigatória" }),
  driver_id: z.coerce.number().min(1, { message: "Motorista obrigatório" }),
  vehicleType: z.enum(["TRUCK", "VAN"], {
    errorMap: () => ({ message: "Categoria de veículo exigida" })
  }),
  cargoType: z.enum(["HAZARDOUS", "PERISHABL"], {
    errorMap: () => ({ message: "Condição de carga exigida" })
  }),
})


type FreightInput = z.infer<typeof freightSchema>

export function Freight({
  freightId,
  toggleModalFreight,
  modalFreightIsOpen,
}: {
  freightId: string
  toggleModalFreight: () => void
  modalFreightIsOpen: boolean
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
    queryKey: ["drivers"],
    queryFn: async () => {
      const response = await api.get("/driver")
      return response.data as Driver[]
    },
  })

  const { handleSubmit, setValue, control, reset, formState: { errors, isSubmitting } } = useForm<FreightInput>({
    resolver: zodResolver(freightSchema),
    defaultValues: {
      freightDate: new Date(),
      driver_id: 0,
      cargoType: "PERISHABL",
      status: "IN_ROUTE",
      transporter_id: 0,
      vehicleType: "VAN"
    }
  });

  useEffect(() => {
    reset({
      freightDate: new Date(),
      driver_id: 0,
      cargoType: "HAZARDOUS",
      status: "IN_ROUTE",
      transporter_id: 0,
      vehicleType: "TRUCK",
    });

    if (freight) {
      reset({
        freightDate: new Date(freight.freightDate),
        driver_id: freight.driver.id,
        cargoType: freight.cargoType,
        status: freight.status,
        transporter_id: freight.transporter.id,
        vehicleType: freight.vehicleType,
      });
    }
  }, [freight, reset]);


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
      }

      reset()
      toggleModalFreight()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Sheet onOpenChange={toggleModalFreight} open={modalFreightIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo frete</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span>Status do frete</span>

          <RadioGroup
            defaultValue={freight?.status}
            onValueChange={event => setValue("status", event as Status)}
            className="flex items-center justify-between"
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
              <Controller
                name="freightDate"
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
              {errors.freightDate && <span className="text-red-500 text-xs">{errors.freightDate.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="transporter_id">Transportadora</Label>
              <Controller
                name="transporter_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {transporters?.map((transporter) => (
                        <SelectItem value={String(transporter.id)} key={transporter.id}>
                          {transporter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.transporter_id && <span className="text-red-500 text-xs">{errors.transporter_id.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="driver_id">Motorista</Label>
              <Controller
                name="driver_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar o motorista" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers?.map((driver) => (
                        <SelectItem value={String(driver.id)} key={driver.id}>
                          {driver.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.driver_id && <span className="text-red-500 text-xs">{errors.driver_id.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de veículo</Label>
              <Controller
                name="vehicleType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VAN">Van</SelectItem>
                      <SelectItem value="TRUCK">Caminhão</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vehicleType && <span className="text-red-500 text-xs">{errors.vehicleType.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de carga</Label>
              <Controller
                name="cargoType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HAZARDOUS">Perigoso</SelectItem>
                      <SelectItem value="PERISHABL">Perecível</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.cargoType && <span className="text-red-500 text-xs">{errors.cargoType.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Button className="bg-[#FFBD00]" type="submit">
              {isSubmitting ? <Loader2 className="animate-spin" /> : freightId ? "Atualizar" : "Cadastrar"}
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
