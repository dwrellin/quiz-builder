"use client";

import * as React from "react";

export const QuizContext = React.createContext<{
  userType: UserType | null;
  setUserType: React.Dispatch<React.SetStateAction<UserType | null>>;
} | null>(null);

export function useQuizContext() {
  const context = React.useContext(QuizContext);

  if (!context) {
    throw new Error("useQuizContext must be used within an QuizProvider");
  }

  return context;
}

type UserType = "examiner" | "examinee";

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = React.useState<UserType | null>(null);

  return (
    <QuizContext.Provider value={{ userType, setUserType }}>
      {children}
    </QuizContext.Provider>
  );
}
