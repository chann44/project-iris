import type { NextPage } from 'next'
import Head from 'next/head'
import FlashingGrid from 'src/componants/flashingcell'
import { FlasherLayout } from 'src/componants/flashingcell'
import HomeButton from 'src/componants/homebutton'
import SettingsButton from '~/componants/settingsbutton'

interface PageProps {
  grid?: JSX.Element
}

const Page: NextPage<PageProps> = () => {
  return (
    <>
      <Head>
        <title>Speed Read</title>
      </Head>
      <SettingsButton />
      <HomeButton />
      <div className='flex min-h-screen grid-cols-2 flex-col items-center justify-center gap-4 py-2'>
        <FlashingGrid layout={FlasherLayout.FOUR_BY_ONE} />
      </div>
    </>
  )
}

export default Page