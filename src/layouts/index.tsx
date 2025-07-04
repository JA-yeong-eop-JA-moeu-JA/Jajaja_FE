import { Outlet, useLocation } from 'react-router-dom'
import BottomBar from '../components/BottomBar'

export default function Layout() {
  const path = useLocation().pathname
  const showBottomBar = ['/', '/payment'].includes(path)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 overflow-y-auto px-1">
        <Outlet />
      </main>
      {showBottomBar && <BottomBar />}
    </div>
  )
}



