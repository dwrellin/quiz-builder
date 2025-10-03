"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import ErrorCard from "@/app/components/error-card";
import SkeletonLoader from "@/app/components/skeleton-loader";
import { useQuizContext } from "@/app/providers/context-provider";

import { answerQuestionById, fetchQuizById } from "@/lib/api";
import { QuizAnswer } from "@/lib/types";

type FormValues = {
  answer: string;
};

export default function QuizPlayerPage() {
  const params = useParams();
  const quizId = params.id;

  const searchParams = useSearchParams();
  const attemptId = searchParams.get("aid");
  const qNumber = searchParams.get("n");

  const router = useRouter();

  const { userType } = useQuizContext();

  const { register, watch, setValue, reset, handleSubmit } =
    useForm<FormValues>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      return fetchQuizById(id as string);
    },
  });

  const quizMutation = useMutation({
    mutationFn: ({
      attemptId,
      payload,
    }: {
      attemptId: string;
      payload: QuizAnswer;
    }) => answerQuestionById(attemptId, payload),
    onSuccess: () => {
      if (!quizId || !qNumber) return;
      reset();

      if (+qNumber !== data.questions.length) {
        router.replace(
          `/quiz/${quizId}/question?n=${+qNumber + 1}&aid=${attemptId}`
        );
      } else {
        router.replace(`/quiz/${quizId}/result?aid=${attemptId}`);
      }
    },
    onError: (error) => {
      toast.error("Something went wrong.", {
        description: error.toString(),
      });
    },
  });

  if (isLoading) return <SkeletonLoader />;
  if (isError) return <ErrorCard error={error.toString()} />;

  const qNumIndex = +qNumber! - 1;

  const onSubmit: SubmitHandler<FormValues> = (d) => {
    if (!qNumber || !attemptId) return;

    if (!d.answer) {
      toast.info("Please provide an answer");
      return;
    }

    const payload: QuizAnswer = {
      questionId: data.questions[+qNumber - 1].id,
      value: d.answer,
    };

    quizMutation.mutate({
      attemptId,
      payload,
    });
  };

  const selected = watch("answer");

  if (!userType) router.replace("/");

  return (
    <Card className="my-12">
      <CardContent>
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold">{data.title}</h3>
          <p className="text-sm text-slate-500">Quiz ID: #{data.id}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="mt-3 mb-6 last:mb-0">
            <CardContent>
              {data.questions.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <p className="font-bold text-3xl">
                      {data.questions[qNumIndex].position + 1}
                    </p>
                    <p>{data.questions[qNumIndex].prompt}</p>
                  </div>

                  {data.questions[qNumIndex].options ? (
                    data.questions[qNumIndex].options.map(
                      (o: string | { value: string }) => {
                        const value = typeof o !== "string" ? o.value : o;

                        return (
                          <Button
                            type="button"
                            onClick={() =>
                              setValue("answer", value, {
                                shouldValidate: true,
                              })
                            }
                            variant={selected === value ? "default" : "outline"}
                            className="cursor-pointer p-6 w-full justify-start mb-3"
                          >
                            {value}
                          </Button>
                        );
                      }
                    )
                  ) : (
                    <div className="mt-5 grid gap-3">
                      <Label>Your answer:</Label>
                      <Input type="text" required {...register("answer")} />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h4 className="font-medium text-slate-500 text-center">
                    No questions posted here.
                  </h4>
                </div>
              )}
            </CardContent>
          </Card>

          {data.questions.length > 0 ? (
            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                variant="outline"
                className="gap-2 cursor-pointer"
              >
                Next
                <ChevronRight size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                asChild
              >
                <Link href="/dashboard">Go back to quizzes</Link>
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
