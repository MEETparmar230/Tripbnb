import React, { useEffect } from 'react'

export default function Error({ serverError,setServerError }) {
useEffect(()=>{
    if(serverError){
      const timer = setTimeout(()=>{
            setServerError('')
        },3000)

        return ()=>{clearTimeout(timer)}
    }
    },[serverError,setServerError])
    if (!serverError) return null
    return (
        <div className='mx-auto flex justify-center mt-3'>
            <p className='border border-red-500 rounded-xl text-red-500 px-2 py-1  mx-5'>{serverError}</p>
        </div>
  )
}
