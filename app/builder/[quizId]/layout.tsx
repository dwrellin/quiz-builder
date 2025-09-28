import React from "react";

export default function QuizBuilderPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="m-auto my-12 max-w-xl">{children}</div>;
}
