export async function fetchQuizzes() {
  const response = await fetch("/api/quizzes");
  if (!response.ok) throw new Error("Failed to fetch quizzes");
  return response.json();
}

export async function fetchQuizById(quizId: string) {
  try {
    const response = await fetch(`/api/quizzes/${quizId}`);
    if (!response.ok) throw new Error("Failed to fetch quiz");

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

// Create quizzes
export async function createQuiz(payload: any) {
  try {
    const response = await fetch("/api/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to create quiz");

    const data = response.json();
    return data;
  } catch (error) {
    return error;
  }
}

// Insert questions to quizId
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
