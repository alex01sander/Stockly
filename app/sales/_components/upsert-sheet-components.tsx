"use client";

import { Button } from "@/app/_components/ui/button";
import { Combobox, ComboboxOption } from "@/app/_components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import { PlusIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  productId: z.string().uuid({ message: "O produto é obrigatório" }),
  quantity: z
    .number()
    .int()
    .positive({ message: "A quantidade deve ser pelo menos 1" }),
});

type FormSchema = z.infer<typeof formSchema>;

interface UpsertSheetComponentProps {
  products: Product[];
  productOptions: ComboboxOption[];
}

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const UpsertSheetComponent = ({
  productOptions,
  products,
}: UpsertSheetComponentProps) => {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  });

  const onSubmit = (data: FormSchema) => {
    const selectedProduct = products.find(
      (product) => product.id === data.productId,
    );

    if (!selectedProduct) {
      toast.error("Produto não encontrado");
      return;
    }

    setSelectedProducts((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === selectedProduct.id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + data.quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: Number(selectedProduct.price),
          quantity: data.quantity,
        },
      ];
    });

    toast.success(`Produto "${selectedProduct.name}" adicionado à venda!`);

    form.reset({
      productId: "",
      quantity: 1,
    });
  };

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const total = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  return (
    <SheetContent className="!max-w-[700px]">
      <SheetHeader>
        <SheetTitle>Nova venda</SheetTitle>
        <SheetDescription>
          Insira as informações da venda abaixo.
        </SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form className="space-y-6 py-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produto</FormLabel>
                <FormControl>
                  <Combobox
                    placeholder="Selecione um produto"
                    {...field}
                    options={productOptions}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Digite a quantidade"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4 w-full gap-2"
            variant="secondary"
          >
            <PlusIcon size={20} />
            Adicionar produto à venda
          </Button>
        </form>
      </Form>

      {selectedProducts.length > 0 && (
        <div className="mt-8">
          <Table>
            <TableCaption>Produtos adicionados à venda</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Valor unitário</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[80px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    R${" "}
                    {(product.price * product.quantity)
                      .toFixed(2)
                      .replace(".", ",")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-semibold">
                  Total da venda
                </TableCell>
                <TableCell className="font-bold text-green-600">
                  R$ {total.toFixed(2).replace(".", ",")}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </SheetContent>
  );
};

export default UpsertSheetComponent;
