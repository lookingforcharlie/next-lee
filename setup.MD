# Next.js project

## commands: I am using pnpm

- npx create-next-app@latest next-lee
- pn i postgres

## file system

- In next-env.d.ts file, you can pass additional options to configure to nextjs
- Delete .next folder, if you want to clear your cache
- Root layout.tsx wraps entire application

```sql
CREATE TABLE IF NOT EXISTS quizzes (
  quiz_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  question_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
  answer_id SERIAL PRIMARY KEY,
  quiz_id INT REFERENCES quizzes(quiz_id) ON DELETE CASCADE, // this is the foreign key
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL
);
```

## Idea for the quiz app

- use AI to generate quizzes
- load txt/word/pdf file to generate quizzes
- share url for the quizzes like google form
- mark
- analyze the quizzes
- User authentication: Different users see different quizzes can be realized by query
