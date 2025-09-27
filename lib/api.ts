export async function fetchQuizzes() {
  const response = await fetch("/api/quizzes");
  if (!response.ok) throw new Error("Failed to fetch quizzes");
  return response.json();
}

export async function addQuestions(payload: any) {
  const response = await fetch(`/api/quizzes/${payload.quizId}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
    body: JSON.stringify({
      ...payload,
      quizId: +payload.quizId,
    }),
  });

  if (!response.ok) throw new Error("Failed to add questions");
  return response.json();
}
