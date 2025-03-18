import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import { Post, User } from '../../../types';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import DotButton from '../Helper/DotButton';
import { Button } from '../ui/button';
import { addCommentHandler } from '../Helper/CommentHandler';
import { RootState } from '../../../Store/Store';
import { useDispatch, useSelector } from 'react-redux'; 
import { useRouter } from 'next/navigation'; 
import { addComment } from '../../../Store/postSlice';

type Props = {
    post: Post | null;
};

const PostCard = ({ post }: Props) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("");
    const router = useRouter(); 
    const dispatch = useDispatch();

    const handleComment = async (id: string) => {
        if (!comment.trim()) return;
        const result = await addCommentHandler(id, comment, setComment); 
        if (result) {
            dispatch(addComment(result));
            post?.comments.push(result.comment)
        }
    }; 
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === 'Enter') {
            handleComment(id);
        }
    };

 

    return (
        <div>
            <div onClick={() => setIsOpen(true)} className='relative group overflow-hidden cursor-pointer'>
                {post?.image?.url && (
                    <Image src={post.image.url} alt="Post Image" width={300} height={300} className='w-full h-full object-cover aspect-square' />
                )}

                <div className='absolute inset-0 flex items-center justify-center group-hover:bg-black/50 transition duration-300'>
                    <div className="flex space-x-6 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button className='p-2 rounded-full text-white flex items-center font-black'>
                            <Heart className='w-7 h-7' />
                            <span>{post?.likes.length || 0}</span>
                        </button>
                        <button className='p-2 rounded-full text-white flex items-center font-black'>
                            <MessageCircle className='w-7 h-7' />
                            <span>{post?.comments?.length || 0}</span>
                        </button>
                    </div>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent id='comments' className='p-2 bg-secondary-200 gap-0 min-h-96 flex flex-col'>
                    <DialogTitle></DialogTitle>
                    <div className="flex flex-1">
                        {post?.image?.url && (
                            <div className='sm:w-1/2 hidden max-h-[80vh] sm:flex'>
                                <Image src={post.image.url} alt='Post Image' width={300} height={300} className='w-full object-cover rounded' />
                            </div>
                        )}
                        <div className='w-full sm:w-1/2 flex flex-col justify-between bg-white'>
                            <div className='flex items-center mt-4 justify-between p-4 pb-2'>
                                <div className='flex gap-3 items-center'>
                                  
                                        <Avatar onClick={() => router.push(`/profile/${post?.user?._id}`)} className='cursor-pointer'>
                                            <AvatarImage src={post?.user?.profilePicture} />
                                            <AvatarFallback className='bg-primary-350 text-secondary-100'>
                                                {post?.user?.username[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                
                                    <div>
                                        <p onClick={() => post?.user && router.push(`/profile/${post?.user?._id}`)} className='font-semibold cursor-pointer text-sm'>
                                            {post?.user?.username}
                                        </p>
                                    </div>
                                </div>
                                <DotButton user={user} post={post} />
                            </div>
                            <hr className='mx-2 text-secondary-400' />
                            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                                {post?.comments?.map((comment) => (
                                    <div key={comment?._id} className='flex mb-4 gap-3 items-center'>
                                        <Avatar onClick={()=>router.push(`/profile/${comment.user._id}`)} className='cursor-pointer'>
                                            <AvatarImage src={comment?.user?.profilePicture} />
                                            <AvatarFallback className='bg-primary-350 text-secondary-100'>
                                                {comment?.user?.username[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center space-x-2">
                                            <p  onClick={()=>router.push(`/profile/${comment.user._id}`)} className='text-sm cursor-pointer font-bold'>{comment?.user?.username}:</p>
                                            <p className='font-normal text-sm'>{comment?.text}</p>
                                        </div>
                                    </div>
                                ))}
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
                                        className='bg-secondary-200 text-secondary-700 hover:bg-primary-300 hover:text-secondary-100 shadow'>
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

export default PostCard;