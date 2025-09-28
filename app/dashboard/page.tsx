"use client";

import * as React from "react";
import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, LoaderCircle } from "lucide-react";

import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ErrorCard from "../components/error-card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { fetchQuizzes, updateQuizStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const queryClient = useQueryClient();

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

  const handlePublish = (quizId: string) => {
    setActiveQuizId(quizId);

    if (!quizId) return;
    quizMutation.mutateAsync(quizId);
  };

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    return <ErrorCard error={error} />;
  }

  return (
    <div className="max-w-4xl mx-auto my-12">
      <h2 className="text-2xl font-bold">Quizzes</h2>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((d: any) => (
          <Card key={d.id}>
            <CardContent>
              <Badge
                variant={d.isPublished ? "secondary" : "outline"}
                className={cn(
                  d.isPublished && "bg-green-500 text-white dark:bg-blue-600",
                  "uppercase"
                )}
              >
                {d.isPublished ? "Published" : "Draft"}
              </Badge>
              <h3 className="font-bold text-xl mt-2">{d.title}</h3>
              <p className="text-slate-500">{d.description}</p>

              <Separator className="mt-5 mb-3" />
              <div className="flex items-center justify-end gap-2">
                {/* TODO: 

                  PUBLISH & VIEW - When logged in as Examiner
                  TAKE - When logged in as Examinee

                  Need context for this ^
                
                */}
                {!d.isPublished && (
                  <Button
                    onClick={() => handlePublish(d.id)}
                    disabled={quizMutation.isPending && activeQuizId === d.id}
                    className="cursor-pointer"
                  >
                    {quizMutation.isPending && activeQuizId === d.id && (
                      <LoaderCircle className="animate-spin" size={18} />
                    )}
                    Publish Quiz
                  </Button>
                )}

                <Button asChild>
                  <Link
                    className="inline-flex items-center gap-2"
                    href={`/builder/${d.id}/view`}
                  >
                    View Quiz
                  </Link>
                </Button>

                <Button asChild>
                  <Link
                    className="inline-flex items-center gap-2"
                    href={`/builder/${d.id}/view`}
                  >
                    Take Quiz
                    <ChevronRight size={18} />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
