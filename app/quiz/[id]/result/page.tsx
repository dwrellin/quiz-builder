"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { useMutation } from "@tanstack/react-query";
import { HeartCrackIcon, PartyPopperIcon } from "lucide-react";

import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { submitQuiz } from "@/lib/api";

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("aid");

  const submitQuizMutation = useMutation({
    mutationFn: (attemptId: string) => submitQuiz(attemptId),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      toast.error("Something went wrong.", {
        description: error.toString(),
      });
    },
  });

  const handleViewResult = () => {
    if (!attemptId) return;
    submitQuizMutation.mutate(attemptId);
  };

  return (
    <Card>
      <CardContent>
        <div className="text-center">
          {submitQuizMutation.isSuccess ? (
            <>
              {submitQuizMutation.data.score > 0 ? (
                <CongratsCard data={submitQuizMutation.data} />
              ) : (
                <FailedCard data={submitQuizMutation.data} />
              )}
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
      <Separator className="my-8" />
      <Button variant="link" className="underline" asChild>
        <Link href="/">Return to selection screen</Link>
      </Button>
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
      <Separator className="my-8" />
      <Button variant="link" className="underline" asChild>
        <Link href="/">Return to selection screen</Link>
      </Button>
    </>
  );
}
