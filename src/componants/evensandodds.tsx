import React, { useEffect, useRef, useState } from 'react'
import { FontProviderButton } from '~/cva/fontProvider'
import type { Dispatch, SetStateAction } from 'react'
import { motion } from 'framer-motion'
import useUserStore from '~/stores/userStore'
import type { SelectFont } from '~/utils/types'
import Timer from '~/utils/timer'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'
import { formatDate } from '~/utils/helpers'
const DEFAULT =
  'flex text-white md:text-3xl text-2xl justify-center p-4 border-2 border-slate-700 gap-0 bg-white/20'
const HILIGHT =
  'flex text-white md:text-3xl text-2xl justify-center p-4 bg-blue-500 border-2 border-slate-700 gap-0 bg-slate-700/40'

type EvenOddProps = {
  segFigs: number
  evens: number
  cols: number
  rows: number
  framesCleared?: number
  frameSetter?: Dispatch<SetStateAction<number>>
}

type CellProps = {
  id: number
  defaultClass: string
  hilightClass: string
  evenEvent: () => void
  oddEvent: () => void
}

type GenerateorProps = {
  props: EvenOddProps,
  evenEvent: () => void,
  oddEvent: () => void,
}

function randomNumber(segFigs: number, isEven: boolean){
  const min = Math.pow(10, segFigs - 1)
  const max = Math.pow(10, segFigs) - 1
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  if (isEven) {
    const newNumber = randomNumber % 2 === 0 ? randomNumber : randomNumber + 1
    if (newNumber > max) {
      return newNumber - 2
    } else if (newNumber < min) {
      return newNumber + 2
    } else {
      return newNumber
    }
  } else {
    const newNumber = randomNumber % 2 === 0 ? randomNumber + 1 : randomNumber
    if (newNumber > max) {
      return newNumber - 2
    } else if (newNumber < min) {
      return newNumber + 2
    } else {
      return newNumber
    }
  }
}

function generateNumbers(props: EvenOddProps): number[]{
  const count = props.cols * props.rows
  const numbers: number[] = []

  for (let i = 0; i < count; i++) {
    numbers.push(randomNumber(props.segFigs, i < props.evens ? true : false))
  }
  console.log(numbers)
  return numbers.sort(() => Math.random() - 0.5)
}

function Cell(props: CellProps){
  const [currentClass, setCurrentClass] = useState(props.defaultClass)
  const userStore = useUserStore()
  const [font, setFont] = useState<SelectFont>('sans')
  const [disabled, setDisabled] = useState(false)

  function handleClick(){
    if (props.id % 2 === 0 && !disabled) {
      setCurrentClass(props.hilightClass)
      setDisabled(true)
      props.evenEvent()
    } else {
      props.oddEvent()
    }
  }

  useEffect(() => {
    if (currentClass === HILIGHT) {
      setCurrentClass(props.defaultClass)
      setDisabled(false)
    }
  }, [props.id])

  useEffect(() => {
    if (!userStore.user) return
    setFont(userStore.user.font)
  }, [userStore.user])

  return (
    <FontProviderButton
      font={font}
      className={currentClass}
      key={props.id}
      onClick={() => handleClick()}
      id={props.id.toString()}
      disabled={disabled}
    >
      {props.id}
    </FontProviderButton>
  ) 
}

function Grid({ props, evenEvent,oddEvent } : GenerateorProps){
  return generateNumbers(props).map((num, i) => (
      <Cell
        id={num}
        key={i}
        defaultClass={DEFAULT}
        hilightClass={HILIGHT}
        evenEvent={() => evenEvent()}
        oddEvent={() => oddEvent()}
      />
    )
  )
}

export default function EvensAndOdds(props: EvenOddProps){
  const evenCount = useRef(0)
  const errorCount = useRef(0)
  const GRID_CLASS = useState(`grid grid-cols-${props.cols}`)[0]
  const timer = new Timer
  const router = useRouter()
  const { mutate } = api.user.setUser.useMutation()
  const user = api.user.getUnique.useQuery().data
  const userStore = useUserStore()

  function tearDown(){
    //TODO add data to db
    if(!user) return
    timer.end()
    mutate({...user, lastEvenNumbers: formatDate(new Date())})
    userStore.setUser({...user, lastEvenNumbers: formatDate(new Date())})
    router.replace('/next').catch((err) => console.log(err))
  }

  const pressEven = () => {
    evenCount.current++
    if (evenCount.current === props.evens && props.frameSetter) {
      tearDown()
    }
  }

  const pressOdd = () => {
    errorCount.current++
  }

  useEffect(() => {
    timer.start()
  }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={GRID_CLASS}>
          <Grid
            props={props}
            evenEvent={() => pressEven()}
            oddEvent={() => pressOdd()}
          />
        </div>
      </motion.div>
    </>
  )
}

export { generateNumbers }
export type { EvenOddProps }
