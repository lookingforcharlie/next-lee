import Link from 'next/link'
import { redirect } from 'next/navigation'
import postgres from 'postgres'

// Create a connection to the database
// we are pretty much sure we have process.env.DATABASE_URL
const sql = postgres(process.env.DATABASE_URL!, { ssl: 'verify-full' })

async function Quiz({ id, show }: { id: string; show: string | undefined }) {
  // the query returns four rows (one for each answer), each including the quiz details as well as the answer details
  // We are using INNER JOIN (the default when you simply use JOIN),
  // and it returns only the records that have matching values in both tables.
  let quizWithAnswers = await sql`
    SELECT 
      q.quiz_id,
      q.title AS quiz_title,
      q.description AS quiz_description,
      q.question_text AS quiz_question,
      a.answer_id,
      a.answer_text,
      a.is_correct
    FROM quizzes AS q
    JOIN answers AS a ON q.quiz_id = a.quiz_id 
    WHERE q.quiz_id = ${id}
  `
  // console.log(quizWithAnswers)

  console.log('show:', show)
  return (
    <div>
      <h1 className='text-2xl'>{quizWithAnswers[0].quiz_title}</h1>
      <p className='text-2xl text-gray-400'>
        {quizWithAnswers[0].quiz_description}
      </p>
      <p className='text-x my-4'>{quizWithAnswers[0].quiz_question}</p>
      <ul>
        {quizWithAnswers.map((quiz) => (
          <li key={quiz.answer_id} className='space-x-2'>
            <input
              type='radio'
              name='answer'
              id={`answer-${quiz.answer_id}`}
              value={quiz.answer_id}
            />
            <label htmlFor={`answer-${quiz.answer_id}`}>
              {quiz.answer_text}
              {show && (
                <span className='text-sm text-gray-400'>
                  {quiz.is_correct ? ' ✅' : ' ❌'}
                </span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ show?: string }>
}) {
  const { id } = await params
  const { show } = (await searchParams) ?? {}

  return (
    <section>
      <h1 className='text-2xl text-amber-500 mb-8'>Quiz {id}</h1>

      <Quiz id={id} show={show} />

      {/* server action to update url */}
      <form
        action={async () => {
          // creating API code directly inline here in the action handler
          'use server'
          console.log('hello server action')

          // this redirect enables searchParams as an object has a field called show and it's value is true
          // lifting the state up to the server, think about your url
          redirect(`/quiz/${id}?show=true`)
        }}
        className='mt-8'
      >
        <button className='border rounded-md text-amber-600 bg-gray-200 px-2 py-1 hover:bg-gray-400 transition-all'>
          Reveal Answer
        </button>
      </form>

      <Link href='/'>
        <button className='border rounded-md px-4 hover:cursor-pointer mt-12 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'>
          Back to All Quizzes
        </button>
      </Link>
    </section>
  )
}
