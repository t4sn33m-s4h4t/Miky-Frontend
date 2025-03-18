"use client";
import React, { useState } from 'react'; 
import { Post, User } from '../../../types';
import { useDispatch } from 'react-redux';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Ellipsis } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import axios from 'axios';
import { setAuthUser } from '../../../Store/AuthSlice';
import { toast } from 'sonner';
import { BASE_API_URL } from '../../../server';
import { useFollowUnfollow } from '../hooks/useAuth';
import { handleAuthRequest } from '../utils/apiRequest';
import { deletePost } from '../../../Store/postSlice';  
import { useRouter } from 'next/navigation';

type Props = {
    post: Post | null;
    user: User | null;
};
const DotButton = ({ post, user }: Props) => {
    const { handleFollowUnfollow } = useFollowUnfollow();
    const dispatch = useDispatch();
    const isOwnPost = post?.user?._id === user?._id || post?.user === user?._id;
    const isFollowing = post?.user?._id ? user?.following.includes(post.user._id) : false;
    const isSaved = user?.savedPosts.some(savedPost => 
        typeof savedPost !== 'string' && savedPost._id === post?._id
      );
      

    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeletePost = async () => { 
        setIsDeleting(true); 
        try {
            const deletePostReq = async () => await axios.delete(`${BASE_API_URL}/posts/delete-post/${post?._id}`, { withCredentials: true });
            const result = await handleAuthRequest(deletePostReq);
 
            if (result?.data.status === 'success') {
                if (post?._id) {
                    dispatch(deletePost(post._id));
                    toast.success(result.data.message); 
                    router.push("/")
                }
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error('Error');
        } finally {
            setIsDeleting(false); 
        }
    };

    const handleSaveUnsave = async (id: string) => {
        const result = await axios.post(`${BASE_API_URL}/posts/save-unsave-post/${id}`, {}, { withCredentials: true });
        if (result.data.status === 'success') {
            dispatch(setAuthUser(result.data.data));
            toast.success(result.data.message);
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Ellipsis className='w-8 h-8 text-primary-650' aria-label="More options" />
                </DialogTrigger>
                <DialogContent>
                    <div id="create-post">
                        <DialogTitle> </DialogTitle>
                        <div className="space-y-4 flex flex-col w-fit justify-center items-center mx-auto">
                            {!isOwnPost && (
                                <div>
                                    <Button
                                        onClick={() => {
                                            if (post?.user) {
                                                handleFollowUnfollow(post.user._id);
                                            }
                                        }}
                                        className={`${isFollowing ? "bg-secondary-300 text-white" : "bg-secondary-400 text-white"}`}
                                    >
                                        {isFollowing ? "Following" : "Follow"}
                                    </Button>
                                </div>
                            )}
                            <Link href={`/profile/${post?.user?._id || post?.user}`}>
                                <Button variant={'outline'} className='bg-secondary-100 border-secondary-300 hover:bg-white text-primary-650'>
                                    About
                                </Button>
                            </Link>
                            <Button
                                onClick={() => handleSaveUnsave(post?._id)}
                                className={`${!isSaved ? "bg-secondary-400 text-white hover:bg-secondary-500" : "bg-secondary-400/45 hover:bg-secondary-400/70 text-white"}`}
                            >
                                {isSaved ? "Unsave" : "Save"}
                            </Button>

                            {(isOwnPost || user?.isAdmin) && (
                                <Button
                                    onClick={handleDeletePost}
                                    className='hover:bg-red-400 text-secondary-100 bg-red-600 hover:text-white'
                                    disabled={isDeleting} 
                                >
                                    {isDeleting ? "Deleting..." : "Delete Post"}
                                </Button>
                            )}
                            <DialogClose asChild>
                                <Button variant={'outline'} className='bg-secondary-100 border-secondary-300 hover:bg-white text-primary-650'>
                                    Cancel
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DotButton;