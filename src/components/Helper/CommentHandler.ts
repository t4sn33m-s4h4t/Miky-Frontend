
import { toast } from "sonner";

import { handleAuthRequest } from "../utils/apiRequest";
import { BASE_API_URL } from "../../../server";
import axios from "axios";
import { PostComment } from "../../../types";


export const addCommentHandler = async (
    id: string,
    comment: string,
    setComment: (value: string) => void
): Promise<{ postId: string; comment: PostComment } | null> => {
    if (!comment.trim()) return null;

    try {
        const addCommentReq = () =>
            axios.post(
                `${BASE_API_URL}/posts/comment/${id}`,
                { text: comment },
                { withCredentials: true }
            );

        const result = await handleAuthRequest(addCommentReq);

        if (result?.data?.status === "success") {
            toast.success("Comment Posted");
            setComment("");
 
            const commentData: PostComment = {
                _id: result.data.data.comment._id,
                text: result.data.data.comment.text,
                user: result.data.data.comment.user,
                createdAt: result.data.data.comment.createdAt,
            };

            return {
                postId: id,
                comment: commentData,  
            };
        }

        return null;
    } catch (error) {
        console.error("Failed to add comment:", error);
        toast.error("Failed to post comment");
        return null;
    }
};