import { useEffect, useState } from 'react'
import Head from 'next/head'
import { api } from '~/utils/api'
import { type SingletonRouter, useRouter } from 'next/router'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { SignIn } from '@clerk/clerk-react'
import { useUserStore } from '~/stores/userStore'
import type { Exercise, User } from '~/utils/types'
import {
  isAlreadyDone,
  navigate,
  getAvailableExercises,
  navigateToNextExercise,
} from '~/utils/helpers'
import Sidebar from '~/componants/sidebar'


export default function Page() {
  const buttonStyle = [
    'text-white md:text-3xl text-2xl',
    'bg-white/10 rounded-full p-4 h-16',
    'hover:bg-white/20',
  ].join(' ')
  const user = api.user.getUnique.useQuery().data
  const [isUsingChecklist, setIsUsingChecklist] = useState<boolean>(false)
  const setUserStore = useUserStore((state) => state.setUser)
  const { data, isLoading } = api.user.getUnique.useQuery()
  const mutateUser = api.user.setUser.useMutation()

  const router = useRouter()

  const start = () => {
    if (!user) return
    navigateToNextExercise(router as SingletonRouter, user)
  }

  const startTest = () => {
    navigate(router as SingletonRouter, '/exercises/speedtest')
  }

  const adminPage = () => {
    navigate(router as SingletonRouter, '/admin')
  }

  function StartButton() {
    return user?.tested ? (
      <button
        className={buttonStyle}
        onClick={() => start()}
      >
        Get Started
      </button>
    ) : (
      <button
        className={buttonStyle}
        onClick={() => startTest()}
      >
        Test your progress
      </button>
    )
  }

  function AdminButton() {
    if (user?.isAdmin) {
      return (
        <button
          className={buttonStyle}
          onClick={() => adminPage()}
        >
          Admin Page
        </button>
      )
    } else return <></>
  }

  type ExerciseCounterProps = {
    className?: string
    numberStyle?: string
  }

  function ExerciseCounter({ className, numberStyle }: ExerciseCounterProps) {
    if (!user) return <></>
    const availableExercises = getAvailableExercises(user)
    return (
      <div className={className}>
        Remaining Daily Exercises:
        <div className={numberStyle}>{availableExercises?.length ?? '0'}</div>
      </div>
    )
  }

  function CheckList() {
    type ExerciseViewProps = {
      text: string
      exercise: Exercise
      user: User | undefined
    }

    function ExerciseView({ text, exercise, user }: ExerciseViewProps) {
      if (!user) return <></>
      return (
        <p className='p-1 text-center text-xl text-white md:text-2xl'>
          {text + (isAlreadyDone(user, exercise) ? ' ✓' : '')}
        </p>
      )
    }

    return (
      <div className='flex flex-col items-center justify-center'>
        <p className='text-center text-2xl text-white md:text-4xl'>
          Daily Exercises:
        </p>
        <ExerciseView
          text='2 Moving Cubes'
          exercise='cubeByTwo'
          user={user as User}
        />
        <ExerciseView
          text='3 Moving Cubes'
          exercise='cubeByThree'
          user={user as User}
        />
        <ExerciseView
          text='4 by 1 Highlighter'
          exercise='fourByOne'
          user={user as User}
        />
        <ExerciseView
          text='1 by 1 Highlighter'
          exercise='oneByOne'
          user={user as User}
        />
        <ExerciseView
          text='1 by 2 Highlighter'
          exercise='oneByTwo'
          user={user as User}
        />
        <ExerciseView
          text='2 by 1 Highlighter'
          exercise='twoByOne'
          user={user as User}
        />
        <ExerciseView
          text='2 by 2 Highlighter'
          exercise='twoByTwo'
          user={user as User}
        />
        <ExerciseView
          text='Easy Schulte Table'
          exercise='schulteByThree'
          user={user as User}
        />
        <ExerciseView
          text='Intermediate Schulte Table'
          exercise='schulteByFive'
          user={user as User}
        />
        <ExerciseView
          text='Hard Schulte Table'
          exercise='schulteBySeven'
          user={user as User}
        />
        <ExerciseView
          text='Even Number Game'
          exercise='evenNumbers'
          user={user as User}
        />
        <ExerciseView
          text='Number Memory Game'
          exercise='numberGuesser'
          user={user as User}
        />
        <ExerciseView
          text='Matching Letter Game'
          exercise='letterMatcher'
          user={user as User}
        />
        <ExerciseView
          text='Green Dot'
          exercise='greenDot'
          user={user as User}
        />
      </div>
    )
  }

  function RemainingExercises() {
    return isUsingChecklist ? (
      <CheckList />
    ) : (
      <ExerciseCounter
        className='text-center text-2xl text-white md:text-4xl'
        numberStyle='text-8xl text-yellow-400'
      />
    )
  }

  function ExerciseViewSwitcher() {
    return (
      <button
        className={[buttonStyle, 'absolute bottom-5 right-5'].join(' ')}
        onClick={() => {
          setIsUsingChecklist(!isUsingChecklist)
          mutateUser.mutate({ isUsingChecklist: !isUsingChecklist })
        }}
      >
        {isUsingChecklist ? 'Counter' : 'Check List'}
      </button>
    )
  }

  useEffect(() => {
    console.log(user)
    if (!user) return
    setUserStore(user)
    setIsUsingChecklist(user.isUsingChecklist)
  }, [user, isLoading, data, setUserStore])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <SignedIn>
        <ExerciseViewSwitcher />
        <main className='flex min-h-screen items-center justify-center py-16'>
          <Sidebar />
          <div className='flex flex-col items-center justify-center gap-5 px-4'>
            <RemainingExercises />
            <StartButton />
            <AdminButton />
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <main className='flex min-h-screen items-center justify-center'>
          <SignIn />
        </main>
      </SignedOut>
    </>
  )
}
