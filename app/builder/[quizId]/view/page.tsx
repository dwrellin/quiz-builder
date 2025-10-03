"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { useQuizContext } from "@/app/providers/context-provider";
import SkeletonLoader from "@/app/components/skeleton-loader";
import ErrorCard from "@/app/components/error-card";

import { fetchQuizById } from "@/lib/api";
import { QuestionFromDB } from "@/lib/types";

export default function ViewQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId;
  const { userType } = useQuizContext();

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

  const handleCopy = async (textToCopy: string) => {
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Quiz ID copied");
  };

  return (
    <Card>
      <CardContent>
        <h2 className="flex items-baseline-last justify-between gap-2 font-bold text-2xl">
          {data.title}

          <Button
            onClick={() => handleCopy(data.id)}
            variant="ghost"
            className="cursor-pointer text-slate-500 text-base"
          >
            Quiz ID: {data.id}
          </Button>
        </h2>
        <p className="text-slate-500 mb-6">{data.description}</p>

        <h3 className="font-medium text-xl">Questions:</h3>
        {data.questions.length < 1 ? (
          <div className="text-center mt-4 mb-6">
            <h4 className="font-medium text-slate-500 text-center">
              No questions posted — yet.
            </h4>
            <Button variant="link" className="underline" asChild>
              <Link href={`/builder/${data.id}/new`}>Add Questions</Link>
            </Button>
          </div>
        ) : (
          data.questions.map((d: QuestionFromDB, i: number) => (
            <Card key={i} className="mt-3 mb-8 last:mb-0">
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <p className="font-bold text-3xl">{i + 1}</p>
                  <p>{d.prompt}</p>
                </div>

                {d.options &&
                  d.options.map((o, i: number) => (
                    <Button
                      key={i}
                      variant={o === d.correctAnswer ? "default" : "outline"}
                      className="p-6 w-full justify-start mb-3 pointer-events-none"
                    >
                      {o}
                    </Button>
                  ))}

                <p className="mt-3">
                  Correct Answer:{" "}
                  <span className="font-bold">{d.correctAnswer}</span>
                </p>
              </CardContent>
            </Card>
          ))
        )}

        <div className="text-right">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
