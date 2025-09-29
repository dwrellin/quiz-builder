# Next JS Quiz Builder App

## Getting Started

Install dependencies:

```bash
npm install
```

Create an `.env` file in the project root.

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:4000 // or whatever port your server side code is pointed to
NEXT_PUBLIC_API_TOKEN=FAKE-API-TOKEN-123456789 // can be anything, btw
```

Once done, you can now run the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architectural decisions and trade-offs

- I didn't implement entering a quiz by inputing `quizId`. I went with a quiz list where the examinee will just click on "Take Quiz" for better (I'd like to think so) user experience.

## Things to know about the app

- It doesn't have an auth / doesn't save to `localStorage`, so it doesn't persist whether you're an examiner/examinee. Once you refresh the page, you'll be redirected to the landing page again to choose.
- Additionally, if you refresh, you'll lose your progress (e.g. constructing the quiz's questions/prompts).
- Currently, there's no way to update the questions once you submit it. You can only add / view questions.
- It doesn't support going back to questions you've previously answered.
- It doesn't accept indices as answers in MCQ questions/prompts as mentioned in the requirements. It only accepts the string equivalent.
- I wasn't able to add `code` as a question type.
- Some of the components use `any` as type 😅
