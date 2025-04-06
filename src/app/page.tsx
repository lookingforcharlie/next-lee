import Link from 'next/link'
import postgres from 'postgres'
import QuizForm from './quiz-form'

// Create a connection to the database
// we are pretty much sure we have process.env.DATABASE_URL
const sql = postgres(process.env.DATABASE_URL!, { ssl: 'verify-full' })

// quiz_id, title,
type Quiz = {
  quiz_id: number
  title: string
}
// We can mark components asynchronous and fetch data directly
// We can use this async component to fetch data from the database instead of using useEffect
async function Quizzes() {
  const quizzes: Quiz[] = await sql`
    SELECT * FROM quizzes
  `

  return (
    <ul>
      {quizzes.map((quiz) => (
        <li key={quiz.quiz_id} className='mt-2'>
          <Link href={`/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  return (
    <section className='gap-4'>
      <h1 className='text-2xl font-semibold text-amber-600 mb-4'>
        All Quizzes
      </h1>

      <Quizzes />

      <QuizForm />
    </section>
  )
}
