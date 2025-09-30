"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, HeartCrackIcon, PartyPopperIcon, X } from "lucide-react";

import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useQuizContext } from "@/app/providers/context-provider";

import { fetchQuizById, submitQuiz } from "@/lib/api";
import SkeletonLoader from "@/app/components/skeleton-loader";
import ErrorCard from "@/app/components/error-card";

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("aid");

  const params = useParams();
  const quizId = params.id;

  const router = useRouter();

  const { userType } = useQuizContext();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      return fetchQuizById(id as string);
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: (attemptId: string) => submitQuiz(attemptId),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      toast.error("Something went wrong.", {
        description: error.toString(),
      });

      router.replace("/");
    },
  });

  if (isLoading) return <SkeletonLoader />;
  if (isError) return <ErrorCard error={error} />;

  const handleViewResult = () => {
    if (!attemptId) return;
    submitQuizMutation.mutate(attemptId);
  };

  if (!userType) router.replace("/");

  const merged = submitQuizMutation.data && {
    ...submitQuizMutation.data,
    details: submitQuizMutation.data.details.map((sqm: any) => {
      const q = data.questions.find((q: any) => q.id === sqm.questionId);
      return {
        ...sqm,
        correctAnswer: q.correctAnswer || null,
      };
    }),
  };

  const total =
    submitQuizMutation.data && submitQuizMutation.data.details.length;
  const percentage =
    submitQuizMutation.data && (submitQuizMutation.data.score / total) * 100;

  return (
    <Card>
      <CardContent>
        <div className="text-center">
          {submitQuizMutation.isSuccess ? (
            <>
              {percentage >= 50 ? (
                <CongratsCard data={submitQuizMutation.data} />
              ) : (
                <FailedCard data={submitQuizMutation.data} />
              )}

              <div className="bg-slate-50 p-3 my-8 max-w-80 mx-auto rounded-md">
                <div className="flex justify-center gap-2 font-semibold">
                  <h4 className="mb-2">Score Percentage:</h4>
                  <p
                    className={
                      percentage >= 50 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {percentage.toFixed(2)}%
                  </p>
                </div>
                <Table className="text-center">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        Correct Answer
                      </TableHead>
                      <TableHead className="text-center">Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {merged &&
                      merged.details.map((d: any) => (
                        <TableRow key={d.questionId}>
                          <TableCell className="font-bold">
                            {d.correctAnswer}
                          </TableCell>
                          <TableCell>
                            {d.correct ? (
                              <Check
                                size={18}
                                className="text-green-500 mx-auto"
                              />
                            ) : (
                              <X size={18} className="text-red-500 mx-auto" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <Separator className="mb-6" />
              <Button variant="link" className="underline" asChild>
                <Link href="/">Return to selection screen</Link>
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-medium mb-3">
                Ready to see how you did?
              </h3>
              <Button
                className="cursor-pointer mx-auto max-w-max"
                onClick={handleViewResult}
              >
                View Result
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CongratsCard({ data }: { data: any }) {
  const { score } = data;

  return (
    <>
      <PartyPopperIcon size={60} className="mx-auto mb-3" />
      <h1 className="text-3xl font-bold">Congratulations!</h1>

      <p className="text-lg mt-4 mb-1">You scored</p>
      <p className="text-2xl font-medium mb-4">{score}</p>

      <p className="text-slate-500">You're a great quiz-taker!</p>
    </>
  );
}

function FailedCard({ data }: { data: any }) {
  const { score } = data;

  return (
    <>
      <HeartCrackIcon size={60} className="mx-auto mb-3" />

      <h1 className="text-3xl font-bold">Aww, it happens</h1>
      <p className="text-lg mt-4 mb-1">You scored</p>
      <p className="text-2xl font-medium mb-4">{score}</p>

      <p className="text-slate-500">Well… that didn’t go as planned.</p>
    </>
  );
}
