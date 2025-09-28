import React from "react";

export default function QuizBuilderPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full my-12 max-w-xl">{children}</div>;
}
