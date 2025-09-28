"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { createQuiz } from "@/lib/api";
import { LoaderCircle } from "lucide-react";

type QuizFormValues = {
  title: string;
  description: string;
};

export default function BuilderPage() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<QuizFormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const quizMutation = useMutation({
    mutationFn: ({ payload }: { payload: QuizFormValues }) =>
      createQuiz(payload),
    onSuccess: (data) => {
      toast.success("Quiz successfully created");
      router.push(`/builder/${data.id}/new`);
    },
    onError: (error) => {
      console.log("hello world", error);
      toast.error("Something went wrong");
    },
  });

  const onSubmit = (data: QuizFormValues) => {
    quizMutation.mutate({
      payload: {
        title: data.title,
        description: data.description,
      },
    });
  };

  return (
    <div className="m-auto mt-12 max-w-md">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label>Quiz Name</Label>
                <Input
                  type="text"
                  placeholder="General Knowledge Quiz"
                  {...register("title")}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label>Description</Label>
                <Textarea rows={5} {...register("description")} required />
              </div>
              <Button
                type="submit"
                disabled={quizMutation.isPending}
                className="flex gap-2 cursor-pointer w-full"
              >
                {quizMutation.isPending && (
                  <LoaderCircle className="animate-spin" size={18} />
                )}
                Create Quiz
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
