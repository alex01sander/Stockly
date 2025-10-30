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
  SheetFooter,
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
import { CheckIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { SalesTableDropdownMenu } from "./table-dropdown-menu";
import { createSaleAction } from "@/app/_actions/sale/create-sale";
import { useAction } from "next-safe-action/hooks";

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
  onSubmitSuccess?: () => void;
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

  const { execute: executeCreateSale } = useAction(createSaleAction, {
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao criar venda");
    },
    onSuccess: () => {
      toast.success("Venda criada com sucesso");

      setSelectedProducts([]);
      form.reset();
    },
  });

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

    setSelectedProducts((currentProducts) => {
      const existingProduct = currentProducts.find(
        (product) => product.id === selectedProduct.id,
      );

      const totalRequestedQuantity = existingProduct
        ? existingProduct.quantity + data.quantity
        : data.quantity;

      if (totalRequestedQuantity > selectedProduct.stock) {
        form.setError("quantity", {
          message: `Estoque insuficiente. Restam apenas ${selectedProduct.stock} unidades.`,
        });
        toast.error("Estoque insuficiente");
        return currentProducts;
      }

      if (existingProduct) {
        return currentProducts.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, quantity: totalRequestedQuantity }
            : product,
        );
      }

      return [
        ...currentProducts,
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
  const total = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  const onDelete = (productId: string) => {
    setSelectedProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
  };

  const onSubmitSale = async () => {
    executeCreateSale({
      products: selectedProducts.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      })),
    });
  };

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
                    <SalesTableDropdownMenu
                      product={product}
                      onDelete={onDelete}
                    />
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
      <SheetFooter className="pt-6">
        <Button
          type="submit"
          className="w-full"
          disabled={selectedProducts.length === 0}
          onClick={onSubmitSale}
        >
          <CheckIcon size={20} />
          Finalizar venda
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default UpsertSheetComponent;
