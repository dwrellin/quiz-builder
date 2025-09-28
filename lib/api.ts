const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_TOKEN}`,
};

export async function fetchQuizzes() {
  try {
    const response = await fetch(`${BASE_URL}/quizzes`, {
      method: "GET",
      headers,
    });

    if (!response.ok) throw new Error("Failed to fetch quizzes");
    return await response.json();
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

export async function fetchQuizById(quizId: string) {
  try {
    const response = await fetch(`${BASE_URL}/quizzes/${quizId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) throw new Error("Failed to fetch quiz");

    const data = await response.json();
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

// Create quizzes
export async function createQuiz(payload: any) {
  try {
    const response = await fetch(`${BASE_URL}/quizzes`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to create quiz");

    const data = response.json();
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

// Update quiz
export async function updateQuizStatus(quizId: string) {
  try {
    const response = await fetch(`${BASE_URL}/quizzes/${quizId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        isPublished: true,
      }),
    });

    if (!response.ok) throw new Error("Failed to update quiz's status");

    const data = await response.json();
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

// Insert questions to quizId
export async function addQuestions(payload: any) {
  try {
    const response = await fetch(
      `${BASE_URL}/quizzes/${payload.quizId}/questions`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...payload,
          quizId: +payload.quizId,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to add questions to quiz");

    const data = await response.json();
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}
