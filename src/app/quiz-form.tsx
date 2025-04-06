// 'use client'
import { revalidatePath } from 'next/cache'
import postgres from 'postgres'

// We probably need to use ORM in production, postgres package is just make it easier
const sql = postgres(process.env.DATABASE_URL!, { ssl: 'verify-full' })

function AnswerInput({ id }: { id: number }) {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={`answer-${id}`}>Answer {id}</label>
      <div className='flex items-center gap-2'>
        <input
          type='text'
          id={`answer-${id}`}
          // name is important, this is how we are able to denote specific this element in the form
          name={`answer-${id}`}
          className='border rounded-md px-2 py-1 flex-1'
        />
        <label htmlFor={`correct-${id}`}>Correct Answer</label>
        <input
          type='checkbox'
          id={`correct-${id}`}
          name={`correct-${id}`}
          className='w-5 h-5 rounded-full'
          // onChange={(e) => {
          //   // If this checkbox is checked, disable all other checkboxes
          //   const checkboxes = document.querySelectorAll(
          //     'input[type="checkbox"]'
          //   ) as NodeListOf<HTMLInputElement>
          //   checkboxes.forEach((checkbox) => {
          //     if (checkbox.id !== e.target.id) {
          //       checkbox.disabled = e.target.checked
          //     }
          //   })
          // }}
        />
      </div>
    </div>
  )
}

export default function QuizForm() {
  // It passes in the entire form data
  const createQuiz = async (formData: FormData) => {
    'use server'
    console.log(formData)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const question = formData.get('question') as string

    const answers = [1, 2, 3, 4].map((id) => ({
      answer: formData.get(`answer-${id}`) as string,
      isCorrect: formData.get(`correct-${id}`) === 'on',
    }))

    console.log({ title, description, question, answers })

    await sql`
      WITH new_quiz AS (
        INSERT INTO quizzes (title, description, question_text, created_at)
        VALUES (${title}, ${description}, ${question}, NOW())
        -- RETURNING quiz_id is to get quiz_id that was just created immediately
        -- Without it, we would have to query the database again to get the quiz_id
        RETURNING quiz_id
      )
      INSERT INTO answers (quiz_id, answer_text, is_correct)
      VALUES
        (
          (SELECT quiz_id FROM new_quiz),
          ${answers[0].answer},
          ${answers[0].isCorrect}
        ),
        (
          (SELECT quiz_id FROM new_quiz),
          ${answers[1].answer},
          ${answers[1].isCorrect}
        ),
        (
          (SELECT quiz_id FROM new_quiz),
          ${answers[2].answer},
          ${answers[2].isCorrect}
        ),
        (
          (SELECT quiz_id FROM new_quiz),
          ${answers[3].answer},
          ${answers[3].isCorrect}
        )
    `

    // make the data refresh on the page without putting page in the loading state
    revalidatePath('/')
  }

  return (
    <div className='flex flex-col mt-8'>
      <h1 className='text-2xl font-semibold text-amber-600 mb-4'>
        Quiz Edit Form
      </h1>

      {/* We can reference items by names in the form */}
      <form action={createQuiz} className='flex flex-col gap-2'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            id='title'
            name='title'
            className='border rounded-md px-2 py-1'
            defaultValue='JavaScript Quirks'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            name='description'
            className='border rounded-md px-2 py-1'
            defaultValue='A quiz on some of JavaScript unusual behaviors.'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='question'>Question</label>
          <input
            type='text'
            id='question'
            name='question'
            className='border rounded-md px-2 py-1'
            defaultValue='hat is the output of `typeof null` in JavaScript?'
          />
        </div>

        <AnswerInput id={1} />
        <AnswerInput id={2} />
        <AnswerInput id={3} />
        <AnswerInput id={4} />

        <button
          type='submit'
          className='border border-amber-300 mt-4 bg-amber-600 text-white px-4 py-2 rounded-md cursor-pointer'
        >
          Create Quiz
        </button>
      </form>
    </div>
  )
}

// mutate the data: add a new quiz, delete a quiz
// reflect that in the UI
// revalidate the data
