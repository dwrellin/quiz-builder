"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import SkeletonLoader from "@/app/components/skeleton-loader";
import ErrorCard from "@/app/components/error-card";

import { fetchQuizById } from "@/lib/api";

export default function ViewQuizPage() {
  const params = useParams();
  const quizId = params.quizId;

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

  if (isError) return <ErrorCard error={error} />;

  console.log("hello world", isError, error);

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
        {/* TODO: Fix types here */}
        {data.questions.map((d: any, i: any) => (
          <Card className="mt-3 mb-8 last:mb-0">
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <p className="font-bold text-3xl">{i + 1}</p>
                <p>{d.prompt}</p>
              </div>

              {d.options &&
                d.options.map((o: any) => (
                  <Button
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
        ))}

        <div className="text-right">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
