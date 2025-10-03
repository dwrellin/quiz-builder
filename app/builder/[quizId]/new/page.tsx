"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { useQuizContext } from "@/app/providers/context-provider";
import SkeletonLoader from "@/app/components/skeleton-loader";
import ErrorCard from "@/app/components/error-card";
import { addQuestions, fetchQuizById } from "@/lib/api";
import { Question, QuestionFormValues } from "@/lib/types";

import QuizForm from "./quiz-form";

export default function NewQuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;

  const router = useRouter();

  const { userType } = useQuizContext();

  const { register, control, handleSubmit, watch } =
    useForm<QuestionFormValues>({
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
    });

  const {
    fields: questions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const quizMutation = useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: Question & {
        quizId: string;
      };
    }) => addQuestions(payload),
  });

  const onSubmit = async (data: QuestionFormValues) => {
    try {
      if (!quizId) return;

      await Promise.all(
        data.questions.map((q) => {
          return quizMutation.mutateAsync({
            payload: {
              quizId,
              ...q,
              options: q.type === "mcq" ? q.options : [],
            },
          });
        })
      );

      toast.success("Quiz submitted successfully");
      router.push(`/builder/${quizId}/view`);
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

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError) return <ErrorCard error={error.toString()} />;

  if (!userType) router.replace("/");

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold">{data.title}</h2>
        <p className="text-slate-500 mb-6">{data.description}</p>

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
  );
}
