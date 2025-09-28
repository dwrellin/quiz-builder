"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import QuizForm from "./quiz-form";
import { FormValues } from "./types";
import { addQuestions, fetchQuizById } from "@/lib/api";

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
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!quizId) return;

      await Promise.all(
        data.questions.map((q) => {
          return quizMutation.mutateAsync({
            payload: {
              quizId,
              ...q,
              options: q.type === "mcq" ? q.options.map((c) => c.value) : [],
            },
          });
        })
      );

      toast.success("Quiz submitted successfully");
      reset();
    } catch (error) {
      toast.error("Something went wrong with submission", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      return fetchQuizById(id as string);
    },
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError)
    return (
      <div>
        Something went wrong
        <p>{error.toString()}</p>
      </div>
    );

  return (
    <div className="m-auto my-12 max-w-xl">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">{data.title}</h2>
          <p className="text-sm mb-6">{data.description}</p>

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
