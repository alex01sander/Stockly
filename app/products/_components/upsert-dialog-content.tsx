"use client";
import { createProduct } from "@/app/_actions/product/create-product";
import { createProductSchema } from "@/app/_actions/product/create-product/schema";
import { Button } from "@/app/_components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

interface UpsertProductDialogContentProps {
  onSuccess?: () => void;
}

export const UpsertProductDialogContent = ({
  onSuccess,
}: UpsertProductDialogContentProps) => {
  const form = useForm<z.infer<typeof createProductSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 1,
    },
  });

  const onSubmit = async (data: z.infer<typeof createProductSchema>) => {
    try {
      await createProduct(data);
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar produto");
    }
  };
  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <DialogHeader>
            <DialogTitle>Criar produto</DialogTitle>
            <DialogDescription>
              Insira as informações do produto
            </DialogDescription>
          </DialogHeader>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do produto</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do produto" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço do produto</FormLabel>
                <FormControl>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    prefix="R$"
                    allowNegative={false}
                    customInput={Input}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue);
                    }}
                    {...field}
                    onChange={() => {}}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque do produto</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Digite o estoque do produto"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="reset">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
