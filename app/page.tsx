"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { fetchQuizzes } from "@/lib/api";

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["quizzes"],
    queryFn: fetchQuizzes,
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    return (
      <div>
        <p>Something went wrong</p>
        <p>{error.toString()}</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-300">
      {data.map((d: any) => (
        <Link key={d.id} href={d.id.toString()}>
          {d.title}
        </Link>
      ))}
    </div>
  );
}
