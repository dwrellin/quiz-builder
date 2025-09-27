import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/quizzes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({
      response: "Something went wrong.",
      status: 500,
    });
  }

  const data = await response.json();

  return NextResponse.json(data, { status: 200 });
}

export async function POST() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/quizzes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({
      response: "Something went wrong.",
      status: 500,
    });
  }

  const data = await response.json();

  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
  const { quizId } = await req.json();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/quizzes/${quizId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json({
      response: "Something went wrong.",
      status: 500,
    });
  }

  const data = await response.json();

  return NextResponse.json(data, { status: 201 });
}
