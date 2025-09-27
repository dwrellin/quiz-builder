"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import QuizForm from "./quiz-form";
import { FormValues } from "./types";
import { addQuestions } from "@/lib/api";
import { LoaderCircle } from "lucide-react";

export default function NewQuizPage() {
  const params = useParams();
  const quizId = params.quizId;

  const { register, control, handleSubmit, watch, reset } = useForm<FormValues>(
    {
      defaultValues: {
        questions: [
          {
            type: "mcq",
            prompt: "",
            options: [{ value: "" }],
            correctAnswer: "",
          },
        ],
      },
    }
  );

  const {
    fields: questions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const quizMutation = useMutation({
    mutationFn: ({ payload }: { payload: any }) => addQuestions(payload),
    onSuccess: () => reset(),
  });

  const onSubmit = (data: FormValues) => {
    if (!quizId) return;

    data.questions.map((q) => {
      quizMutation.mutate({
        payload: {
          quizId,
          ...q,
          options: q.type === "mcq" ? q.options.map((c) => c.value) : [],
        },
      });
    });
  };

  return (
    <div className="m-auto my-12 max-w-xl">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <QuizForm
              questions={questions}
              register={register}
              control={control}
              watch={watch}
              append={append}
              remove={remove}
            />

            <Separator />
            <Button
              disabled={quizMutation.isPending}
              type="submit"
              className="flex gap-2 cursor-pointer w-full"
            >
              {quizMutation.isPending && (
                <LoaderCircle className="animate-spin" size={18} />
              )}
              Submit Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
