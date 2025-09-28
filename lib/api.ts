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

// Update quiz
export async function updateQuizStatus(quizId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/quizzes/${quizId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify({
          isPublished: true,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to update quiz's status");

    const data = await response.json();
    return {
      data,
      status: 200,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
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
