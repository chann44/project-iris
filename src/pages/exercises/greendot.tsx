import Head from 'next/head'
import PieTimer from '~/componants/pietimer'
import Sidebar from '~/componants/sidebar'
import { api } from '~/utils/api'
import { FontProvider } from '~/cva/fontProvider'
import type { Font } from '~/utils/types'
import { useEffect, useState } from 'react'
import BackgroundText from '~/componants/greendottext'

export default function Page() {
  const user = api.user.getUnique.useQuery()
  const [font, setFont] = useState<Font>('sans')

  useEffect(() => {
    if (!user) return
    if (user.data) {
      setFont(user.data.font)
    }
  }, [user])

  return (
    <>
      <Head>
        <title>Speed Read</title>
      </Head>
      <div className='flex min-h-screen grid-cols-2 flex-col items-center justify-center gap-4 py-2'>
        <FontProvider className='absolute md:h-1/3 h-1/2 md:w-1/3 w-3/4 bg-white rounded-md overflow-hidden p-2' font={font}>
        <BackgroundText />
        </FontProvider>
        <div>
          <PieTimer seconds={60} pixels={15} />
        </div>
        <Sidebar />
      </div>
    </>
  )
}
