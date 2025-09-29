import * as React from "react";

export default function QuizPlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full max-w-xl">{children} </div>;
}
