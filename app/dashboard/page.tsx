"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, LoaderCircle } from "lucide-react";

import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { fetchQuizzes, startQuiz, updateQuizStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

import ErrorCard from "../components/error-card";
import SkeletonLoader from "../components/skeleton-loader";
import { useQuizContext } from "../providers/context-provider";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { userType } = useQuizContext();
  const router = useRouter();

  const [activeQuizId, setActiveQuizId] = React.useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["quizzes"],
    queryFn: fetchQuizzes,
  });

  const quizMutation = useMutation({
    mutationFn: (quizId: string) => updateQuizStatus(quizId),
    onSuccess: () => {
      toast.success("Successfully updated the quiz's status");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onSettled: () => setActiveQuizId(null),
    onError: (error) => {
      toast.error("Something went wrong", {
        description: error.toString(),
      });
    },
  });

  const takeQuizMutation = useMutation({
    mutationFn: (quizId: string) => startQuiz(quizId),
    onSuccess: (data) => {
      toast.success("Starting the quiz. Good luck!");
      router.push(`/quiz/${data.quizId}/question?n=1&aid=${data.id}`);
    },
    onError: (error) => {
      toast.error("Something went wrong", {
        description: error.toString(),
      });
    },
  });

  const handlePublish = (quizId: string) => {
    setActiveQuizId(quizId);

    if (!quizId) return;
    quizMutation.mutateAsync(quizId);
  };

  if (isLoading) return <SkeletonLoader />;

  if (isError) {
    return <ErrorCard error={error} />;
  }

  if (!userType) router.replace("/");

  return (
    <div className="max-w-4xl mx-auto my-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quizzes</h2>
        {userType === "examiner" && (
          <Button asChild>
            <Link href="/builder">Create New Quiz</Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((d: any) => {
          if (!d.isPublished && userType === "examinee") return;

          return (
            <Card key={d.id}>
              <CardContent>
                <Badge
                  variant={d.isPublished ? "secondary" : "outline"}
                  className={cn(
                    d.isPublished && "bg-green-500 text-white dark:bg-blue-600",
                    "text-[10px] uppercase"
                  )}
                >
                  {d.isPublished ? "Published" : "Draft"}
                </Badge>
                <h3 className="font-bold text-xl mt-2">{d.title}</h3>
                <p className="text-slate-500">{d.description}</p>

                <Separator className="mt-5 mb-3" />
                <div className="flex items-center justify-end gap-2">
                  {userType === "examiner" && (
                    <>
                      {!d.isPublished && (
                        <Button
                          onClick={() => handlePublish(d.id)}
                          variant="outline"
                          disabled={
                            quizMutation.isPending && activeQuizId === d.id
                          }
                          className="cursor-pointer"
                        >
                          {quizMutation.isPending && activeQuizId === d.id && (
                            <LoaderCircle className="animate-spin" size={18} />
                          )}
                          Publish Quiz
                        </Button>
                      )}

                      <Button variant="outline" asChild>
                        <Link
                          className="inline-flex items-center gap-2"
                          href={`/builder/${d.id}/view`}
                        >
                          View Quiz
                        </Link>
                      </Button>
                    </>
                  )}

                  {userType === "examinee" && (
                    <Button
                      onClick={() => takeQuizMutation.mutate(d.id)}
                      variant="outline"
                      className="cursor-pointer items-center gap-2"
                      disabled={
                        takeQuizMutation.isPending && activeQuizId === d.id
                      }
                    >
                      {takeQuizMutation.isPending && activeQuizId === d.id && (
                        <LoaderCircle className="animate-spin" size={18} />
                      )}
                      Take Quiz
                      <ChevronRight size={18} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
