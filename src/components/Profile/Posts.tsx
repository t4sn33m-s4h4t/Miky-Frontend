"use client";
import React from 'react'
import { User } from '../../../types'
import PostCard from './PostCard';


type Props = {
  userProfile: User | undefined
}
const Posts = ({ userProfile }: Props) => {
  return (
    <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {
        userProfile?.posts.map((post) => {
          return (
            <div key={post._id}>
              <PostCard post={post} />
            </div>
          )
        })
      }
    </div>
  )
}

export default Posts
