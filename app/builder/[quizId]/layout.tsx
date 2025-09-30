import * as React from "react";

export default function QuizBuilderPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[calc(100vh-48px)] my-12 max-w-xl">
      {children}
    </div>
  );
}
