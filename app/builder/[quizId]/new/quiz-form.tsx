import * as React from "react";

import {
  Control,
  Controller,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Choices from "./choices";
import { FormValues, Question } from "./types";
import { Separator } from "@/components/ui/separator";

export default function QuizForm({
  questions,
  register,
  control,
  watch,
  append,
  remove,
}: {
  questions: Question[];
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
  append: UseFieldArrayAppend<FormValues, "questions">;
  remove: UseFieldArrayRemove;
}) {
  return questions.map((__, i: number) => {
    const watchedChoices = watch(`questions.${i}.options`);
    const currentQuestion = watch(`questions.${i}`);

    return (
      <Card key={i} className="mb-8">
        <CardContent>
          <h3 className="font-bold">Question #{i + 1}</h3>
          <Separator className="mt-2 mb-5" />

          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label>Question Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name={`questions.${i}.type`}
                  render={({ field }) => {
                    return (
                      <>
                        <Button
                          type="button"
                          onClick={() => field.onChange("mcq")}
                          variant={
                            field.value === "mcq" ? "default" : "outline"
                          }
                          className="cursor-pointer w-full"
                        >
                          Multiple Choice
                        </Button>
                        <Button
                          type="button"
                          onClick={() => field.onChange("short")}
                          variant={
                            field.value === "short" ? "default" : "outline"
                          }
                          className="cursor-pointer w-full"
                        >
                          Short Answer
                        </Button>
                      </>
                    );
                  }}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Question / Prompt</Label>
              <Input
                type="text"
                placeholder="What is the difference between X and Y?"
                {...register(`questions.${i}.prompt`)}
                required
              />
            </div>

            {currentQuestion.type === "mcq" ? (
              <>
                <Choices control={control} questionIndex={i} />

                <div className="grid gap-3">
                  <Label>Correct Answer</Label>
                  <Controller
                    control={control}
                    name={`questions.${i}.correctAnswer`}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {watchedChoices
                              .filter((c) => c.value.trim() !== "")
                              .map((choice, i) => (
                                <SelectItem key={i} value={choice.value}>
                                  {choice.value}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </>
            ) : (
              <div className="grid gap-3">
                <Label>Correct Answer</Label>
                <Input
                  type="text"
                  placeholder="X is cooler than Y"
                  {...register(`questions.${i}.correctAnswer`)}
                  required
                />
              </div>
            )}

            {i === questions.length - 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  append({
                    type: "mcq",
                    prompt: "",
                    options: [{ value: "" }],
                    correctAnswer: "",
                  })
                }
              >
                Add New Question
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() => remove(i)}
              >
                Remove Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  });
}
