import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '~/componants/sidebar'
import { api } from '~/utils/api'
import type { Answer } from '~/utils/types'

function Loading(){
  return(
    <>
      <Sidebar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p className='text-white text-4xl font-normal'>Loading...</p>
      </div>
    </>
  )
}

function QuestionForm(){
  const [passage, setPassage] = useState('')
  const [question, setQuestion] = useState('')
  const [answerA, setAnswerA] = useState('')
  const [answerB, setAnswerB] = useState('')
  const [answerC, setAnswerC] = useState('')
  const [answerD, setAnswerD] = useState('')
  const { mutate } = api.createSpeedTest.createSpeedTest.useMutation()
  const [correctAnswer, setCorrectAnswer] = useState<Answer>('A')
  const router = useRouter()

  function submit(){
    if(
      passage == '' ||
      question == ''||
      answerA == '' ||
      answerB == '' ||
      answerC == '' ||
      answerD == ''
    ){
      alert('Please fill out all fields')
      return
    }
    const body = {
      passage,
      question,
      answerA,
      answerB,
      answerC,
      answerD,
      correctAnswer
    }
    mutate(body)
    router.push('/admin/createquestion/done').catch((err) => console.log(err))

  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-4 px-4">
        <button
          type='button'
          className='flex bg-white/20 rounded-full items-center p-4 h-12 py-2 text-white text-4xl font-normal'
          onClick={() => submit()}>
          Submit
        </button>
        <form className='gap-4 p-4'>
          <div className='flex flex-col p-4'>
            <label 
              className='text-white text-2xl font-normal'>
              Passage:{' '} 
            </label>
            <textarea 
              name='passage'
              className='text-black bg-white/80 rounded-lg h-48 w-96'
              onChange={(e) => setPassage(e.target.value)}
            />
          </div>
          <div className='flex p-4'>
            <label
              className='text-white text-2xl font-normal'>
              Question:{' '}
            </label>
            <input
              name='Question'
              onChange={(e) => setQuestion(e.target.value)}
              className='text-black bg-white/80 rounded-lg' />
          </div>
          <div className='flex p-4'>
            <label
              className='text-white text-2xl font-normal'>
              Answer A:{' '}
            </label>
            <input
              name='answerA'
              onChange={(e) => setAnswerA(e.target.value)}
              className='text-black bg-white/80 rounded-lg' />
          </div>
          <div className='flex p-4'>
            <label
              className='text-white text-2xl font-normal'>
              Answer B:{' '}
            </label>
            <input
              name='answerB'
              onChange={(e) => setAnswerB(e.target.value)}
              className='text-black bg-white/80 rounded-lg' />
          </div>
          <div className='flex p-4'>
            <label
              className='text-white text-2xl font-normal'>
              Answer C:{' '}
            </label>
            <input
              name='answerC'
              onChange={(e) => setAnswerC(e.target.value)}
              className='text-black bg-white/80 rounded-lg'>
            </input>
          </div>
          <div className='flex p-4'>
            <label
              className='text-white text-2xl font-normal'>
              Answer D:{' '}
            </label>
            <input
              name='answerD'
              onChange={(e) => setAnswerD(e.target.value)}
              className='text-black bg-white/80 rounded-lg' />
          </div>
          <div className='col-auto p-4'>
            <label 
              className='text-white text-2xl font-normal'
              htmlFor="dropdown">
              Select Correct Answer:{' '}
            </label>
            <select
              className="w-full p-2 border rounded-md"
              id="dropdown"
              name="dropdown"
              onChange={(e) => setCorrectAnswer(e.target.value as Answer)}
            >
              <option value={ "A" as Answer }>A</option>
              <option value={ "B" as Answer }>B</option>
              <option value={ "C" as Answer }>C</option>
              <option value={ "D" as Answer }>D</option>
            </select>
          </div>
        </form> 
      </div>
    </>
  )
}

export default function Page(){
  const router = useRouter()  
  const { data: user} = api.user.getUnique.useQuery()
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    if(!user) return
    if(!user.isAdmin){ 
      router.push('/').catch(() => console.log('permission denied'))
    }
    else{
      setApproved(true)
    }  
  }, [user])

  return approved ? <QuestionForm /> : <Loading />
}
