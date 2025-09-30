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

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }
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

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

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

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

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

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

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

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

// Start quiz
export async function startQuiz(quizId: string) {
  try {
    const response = await fetch(`${BASE_URL}/attempts/`, {
      method: "POST",
      headers,
      body: JSON.stringify({ quizId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

// Upsert answer
export async function answerQuestionById(attemptId: string, payload: any) {
  try {
    const response = await fetch(`${BASE_URL}/attempts/${attemptId}/answer`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

// Submit quiz
export async function submitQuiz(attemptId: string) {
  try {
    const response = await fetch(`${BASE_URL}/attempts/${attemptId}/submit`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}
