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
  SheetTrigger,
} from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { X } from "phosphor-react"

export function Freight() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo frete</SheetTitle>
        </SheetHeader>
        <form>
          <span>Status do frete</span>

          <RadioGroup defaultValue="option-one" className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Em rota</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Aguardando lance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Entregue</Label>
            </div>
          </RadioGroup>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Data do frete</Label>
              <Input></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Transportadora</Label>
              <Input></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Motorista</Label>
              <Input></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tipo de veículo</Label>
              <Input></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tipo de carga</Label>
              <Input></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tipo de pagamento</Label>
              <Input></Input>
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
