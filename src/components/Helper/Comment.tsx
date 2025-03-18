"use client";
import React, { useState } from 'react';
import { Post, User } from '../../../types';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import DotButton from './DotButton';
import { Button } from '../ui/button';
import { addCommentHandler } from './CommentHandler';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addComment } from '../../../Store/postSlice';

type Props = {
    user: User | null;
    post: Post | null;
    showIcon?: boolean;
};

const Comment = ({ user, post, showIcon = false }: Props) => {
    const [comment, setComment] = useState("");
    const [isOpen, setIsOpen] = useState(showIcon);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleComment = async (id: string) => {
        if (!id) return;
        const result = await addCommentHandler(id, comment, setComment);
        if (result) {  
            const { postId, comment: c } = result;
            dispatch(addComment({ postId, comment: c }));
        }
    };
    const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter' && id) {  
            handleComment(id);
        }
    }; 
    return (
        <div>
            <p
                className='mt-2 text-sm font-semibold cursor-pointer'
                onClick={() => setIsOpen(true)}
            >
                View All {post?.comments?.length || 0} Comment(s)
            </p>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent
                    id='comments'
                    className='p-2 bg-secondary-200 gap-0 min-h-96 flex flex-col'
                >
                    <DialogTitle></DialogTitle>
                    <div className="flex flex-1">
                        <div className='sm:w-1/2 hidden max-h-[80vh] sm:flex'>
                            <Image
                                src={`${post?.image?.url}`}
                                alt='Post Image'
                                width={300}
                                height={300}
                                className='w-full object-cover rounded'
                            />
                        </div>
                        <div className='w-full sm:w-1/2 flex flex-col justify-between bg-white'>
                            <div className='flex items-center mt-4 justify-between p-4 pb-2'>
                                <div className='flex gap-3 items-center'>
                                    <Avatar className='cursor-pointer' onClick={() => router.push(`/profile/${user?._id}`)}>
                                        <AvatarImage src={post?.user?.profilePicture} />
                                        <AvatarFallback className='bg-primary-350 text-secondary-100'>
                                            {post?.user?.username ? post?.user.username[0].toUpperCase() : ''}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div onClick={() => router.push(`/profile/${post?.user?._id}`)} className='cursor-pointer'>
                                        <p className='font-semibold text-sm'>{post?.user?.username}</p>
                                    </div>
                                </div>
                                <DotButton user={user} post={post} />
                            </div>
                            <hr className='mx-2 text-secondary-400' />
                            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                                {post?.comments && post.comments.length > 0 ? (
                                    post.comments.map((item) => (
                                        <div key={item?._id} className='flex mb-4 gap-3 items-center'>
                                            <Avatar onClick={()=>router.push(`/profile/${item.user._id}`)} className='cursor-pointer'>
                                                <AvatarImage src={item?.user?.profilePicture} />
                                                <AvatarFallback className='bg-primary-350 text-secondary-100'>
           
                                                    {item?.user?.username ? item.user.username[0].toUpperCase() : ''}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex items-center space-x-2">
                                                <p onClick={()=>router.push(`/profile/${item.user._id}`)} className='text-sm cursor-pointer font-bold'>
                                                    {item?.user?.username}:
                                                </p>
                                                <p className='font-normal text-sm'>
                                                    {item?.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                            </div>
                            <div className="p-4">
                                <div className='flex items-center gap-2'>
                                    <input
                                        type="text"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        onKeyDown={(e) => handleKeyPress(e, post?._id || '')}
                                        placeholder='Add a comment...'
                                        className='w-full outline-none border-b-2 border-secondary-400 pb-1'
                                        aria-label="Add a comment"
                                    />
                                    <Button
                                        onClick={() => handleComment(post?._id || '')}
                                        className='bg-secondary-200 text-secondary-700 hover:bg-primary-300 hover:text-secondary-100 shadow'
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Comment;