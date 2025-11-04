import FormBlock from "@/components/blocks/form";
import AdminHeader from "@/components/dashboard/header/admin-header";
import { Card } from "@/components/ui/card";
import type { Form as FormSlotType } from "@/types/slots/form";

export default function ({ ...form }: FormSlotType) {
  return (
    <>
      <AdminHeader crumb={form.crumb} />
      <div className="w-full px-4 md:px-8 py-8">
        <h1 className="text-2xl font-medium mb-8">{form.title}</h1>
        <Card className="overflow-x-auto px-6 max-w-4xl">
          <FormBlock
            fields={form.fields}
            data={form.data}
            passby={form.passby}
            submit={form.submit}
            loading={form.loading}
          />
        </Card>
      </div>
    </>
  );
}
