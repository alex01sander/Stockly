"use client";

import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import UpsertSheetComponent from "./upsert-sheet-components";
import { Product } from "@prisma/client";
import { ComboboxOption } from "@/app/_components/ui/combobox";
import { useState } from "react";

interface CreateSaleButtonProps {
  products: Product[];
  productOptions: ComboboxOption[];
}

const CreateSaleButton = ({
  products,
  productOptions,
}: CreateSaleButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <Sheet open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <SheetTrigger asChild>
        <Button>Nova venda</Button>
      </SheetTrigger>
      <UpsertSheetComponent
        productOptions={productOptions}
        products={products}
        onSubmitSuccess={() => setDialogIsOpen(false)}
      />
    </Sheet>
  );
};

export default CreateSaleButton;
