"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import axios from 'axios';
import { BASE_API_URL } from '../../../server';
import { handleAuthRequest } from '../utils/apiRequest';
import { addComment, likeOrDislike, setPost } from '../../../Store/postSlice';
import { Bookmark, HeartIcon, Loader, MessageCircle, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import DotButton from '../Helper/DotButton';
import Image from 'next/image';
import Comment from '../Helper/Comment';
import { toast } from 'sonner';
import { setAuthUser } from '../../../Store/AuthSlice';
import { addCommentHandler } from '../Helper/CommentHandler';

const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state?.posts?.posts);
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getAllPosts = useCallback(async () => {
    const getAllPostreq = async () => await axios.get(`${BASE_API_URL}/posts/all`);
    try {
      const result = await handleAuthRequest(getAllPostreq, setIsLoading);
      if (result) {
        dispatch(setPost(result.data.data?.posts));
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleLikeDislike = async (id: string) => {
    const result = await axios?.post(`${BASE_API_URL}/posts/like-dislike/${id}`, {}, { withCredentials: true })
    if (result.data.status === 'success') {
      if (user?._id) {
        dispatch(likeOrDislike({ postId: id, userId: user._id }))
        toast.success(result.data.message);
      }
    }
  };

  const handleSaveUnsave = async (id: string) => {
    const result = await axios?.post(`${BASE_API_URL}/posts/save-unsave-post/${id}`, {}, { withCredentials: true })
    if (result.data.status === 'success') {
      dispatch(setAuthUser(result.data.data))
      toast.success(result.data.message);

    }
  };

  const handleComment = async (id: string) => {
    if (!id) return;
    const result = await addCommentHandler(id, comment, setComment);
    if (result) {
      const { postId, comment: c } = result;
      dispatch(addComment({ postId, comment: c }));
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleComment(id);
    }
  };

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center flex-col'>
        <Loader className='animate-spin' />
      </div>
    );
  }

  if (posts?.length < 1) {
    return <div className='text-3xl m-8 mt-5 text-center capitalize font-black'>No Post to Show!</div>;
  }

  return (
    <div className='pb-10 w-[90%] md:w-[75%] mx-auto'>
      {posts?.map((post) => (
        <div key={post?._id} className='bg-white rounded-2xl p-[5%] mt-8'>
          <div className='flex items-center justify-between'>
            <div className="flex items-center space-x-2">
              <Avatar onClick={() => router.push(`/profile/${post?.user?._id}`)} className='w-9 h-9 cursor-pointer'>
                <AvatarImage className='h-full w-full' src={post?.user?.profilePicture} />
                <AvatarFallback className='bg-primary-350 text-secondary-100'>{post?.user?.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <h1 className='cursor-pointer' onClick={() => router.push(`/profile/${post?.user?._id}`)}>
                {post?.user?.username}
              </h1>
            </div>
            <DotButton post={post} user={user} />
          </div>
          <div className='mt-2'>
            <Image src={post?.image?.url || ""} alt='Post' width={400} height={400} className='w-full' priority />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className='flex items-center space-x-4'>
              <HeartIcon
                className={`cursor-pointer  ${user?._id && post?.likes.includes(user?._id)
                  ? 'fill-red-500 text-red-600' : ''}`}
                onClick={() => handleLikeDislike(post?._id)}
              />
              <MessageCircle className='cursor-pointer' onClick={() => handleComment(post?._id)} />
              <Send className='cursor-pointer' />
            </div>
            <Bookmark
              onClick={() => handleSaveUnsave(post?._id)} // Pass the post ID as a string
              className={`cursor-pointer ${(user?.savedPosts?.map(p => p._id) ?? []).includes(post?._id ?? "") ? "fill-secondary-400 text-secondary-400" : "text-secondary-600"}`}

            />


          </div>
          <h1 className="mt-2 text-sm font-semibold">{post?.likes.length} Likes</h1>
          <p className="mt-2 font-medium break-words overflow-hidden">{post?.caption}</p>
          <Comment post={post} user={user} />
          <div className="flex mt-3 bg-secondary-300/5 px-3 py-2 rounded-lg items-center">
            <input
              className='flex-1 placeholder:text-secondary-600 outline-none'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, post?._id)}
              type="text"
              placeholder='Add a Comment...'
            />
            <p
              className='text-sm font-semibold text-secondary-600 hover:underline cursor-pointer'
              role='button'
              onClick={() => handleComment(post?._id)}
            >
              Post
            </p>
          </div>
          <div className='pb-6 border-b-2 border-secondary-100'></div>
        </div>
      ))}
    </div>
  );
};

export default Feed;