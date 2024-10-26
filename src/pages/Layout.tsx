import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex h-screen overflow-auto bg-slate-50'>
      <Outlet />
    </div>
  )
}

export default Layout
