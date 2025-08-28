import React from 'react'
import { Link } from "react-router";

const DashboardPage = () => {
  return (
    <div className='flex bg-red-500 min-h-screen w-full items-center justify-around'>
      <div className='bg-blue-500 flex-1 text-center'>
        pindah ke login  <Link to="/login">login</Link>
      </div>
      <div className='w-2/5 bg-amber-300'>hero</div>
    </div>
  )
}

export default DashboardPage
