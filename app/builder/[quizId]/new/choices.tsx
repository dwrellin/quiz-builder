import * as React from "react";

import { Control, Controller, useFieldArray } from "react-hook-form";
import { Plus, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { QuestionFormValues } from "@/lib/types";

export default function Choices({
  control,
  questionIndex,
}: {
  control: Control<QuestionFormValues>;
  questionIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <div className="grid gap-3">
      <Label>Choices</Label>
      {fields.map((c, ci) => (
        <div key={c.id} className="flex gap-2">
          <Controller
            control={control}
            name={`questions.${questionIndex}.options.${ci}.value`}
            render={({ field }) => (
              <Input {...field} placeholder={`Choice ${ci + 1}`} required />
            )}
          />
          {ci === fields.length - 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ value: "" })}
            >
              <Plus size={18} />
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => remove(ci)}>
              <X size={18} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
