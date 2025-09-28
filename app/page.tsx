"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { UserRoundPenIcon, UserRoundSearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useQuizContext } from "./providers/context-provider";

export default function Home() {
  const router = useRouter();
  const { setUserType } = useQuizContext();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-center text-2xl font-bold">Log in as:</h2>
      <div className="flex items-center justify-center gap-8">
        <div className="bg-slate-200 px-4 pt-8 pb-6 flex flex-col justify-center gap-2 rounded-md">
          <UserRoundSearchIcon size={36} className="mx-auto" />
          <Button
            onClick={() => {
              setUserType("examiner");
              router.push("/dashboard");
            }}
            size="lg"
            variant="ghost"
            className="cursor-pointer text-xl"
          >
            Examiner
          </Button>
        </div>

        <p className="text-sm font-medium">or</p>

        <div className="bg-slate-200 px-4 pt-8 pb-6 flex flex-col justify-center gap-2 rounded-md">
          <UserRoundPenIcon size={36} className="mx-auto" />
          <Button
            onClick={() => {
              setUserType("examinee");
              router.push("/dashboard");
            }}
            size="lg"
            variant="ghost"
            className="cursor-pointer text-xl"
          >
            Examinee
          </Button>
        </div>
      </div>
    </div>
  );
}
