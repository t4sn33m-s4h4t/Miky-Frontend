import Profile from '@/components/Profile/Profile'
import React from 'react'

const ProfilePage = async ({params}:{params:{id:string}}) => {
   const id = (await params).id
  return (
    <>
     <Profile id={id} /> 
    </>
  )
}

export default ProfilePage
