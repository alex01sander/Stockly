"use client";

import { deleteProduct } from "@/app/_actions/product/delete-product";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteProductDialogContentProps {
  productId: string;
}

export const DeleteProductDialogContent = ({
  productId,
}: DeleteProductDialogContentProps) => {
  const handleContinueClick = async () => {
    try {
      await deleteProduct({ id: productId });
      toast.success("Produto deletado com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar produto");
    }
  };
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Você tem certeza que deseja deletar este produto?{" "}
        </AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação não pode ser desfeita. Este produto será permanentemente
          deletado e seus dados serão removidos do nosso servidor.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={handleContinueClick}>
          Continuar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
