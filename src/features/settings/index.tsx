import { Outlet } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ContentSection } from './components/content-section'
import { SidebarNav } from './components/sidebar-nav'
import { paths } from './data/items'

export function Settings() {
  return (
    <>
      <Header />

      <Main fixed>
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={paths} />
          </aside>

          <div className='flex w-full overflow-y-hidden p-1'>
            <ContentSection children={<Outlet />} />
          </div>
        </div>
      </Main>
    </>
  )
}
