import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Product } from "@prisma/client";
import { ClipboardIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import React from "react";

interface UpsertSaleTableDropdownMenuProps {
  product: Pick<Product, "id">;
  onDelete: (productId: string) => void;
}

export const UpsertSaleTableDropdownMenu = ({
  product,
  onDelete,
}: UpsertSaleTableDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ClipboardIcon
            className="gap-2"
            onClick={() => navigator.clipboard.writeText(product.id)}
          />
          Copiar ID
        </DropdownMenuItem>

        <DropdownMenuItem
          className="gap-2"
          onClick={() => onDelete(product.id)}
        >
          <TrashIcon size={16} />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
