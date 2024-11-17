import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ReactNode } from "react"
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmDeleteProps {
  children: ReactNode
  onDelete: () => void;
  deletingLoading: boolean
}

export function ConfirmDelete({ children, onDelete, deletingLoading }: ConfirmDeleteProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você deseja remover ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser revertida. Uma vez feita, o dado será removido do sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction

            asChild
          >
            <Button onClick={onDelete} disabled={deletingLoading}>
              {deletingLoading ?
                <span className="flex items-center gap-2"><Loader2 className="animate-ping" /> Deletando</span> :
                <span>Confirmar</span>
              }
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

