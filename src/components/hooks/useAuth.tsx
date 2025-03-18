import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_API_URL } from "../../../server";
import { handleAuthRequest } from "../utils/apiRequest";
import { setAuthUser } from "../../../Store/AuthSlice";
import { toast } from "sonner";

export const useFollowUnfollow = () => {
    const dispatch = useDispatch();

    const handleFollowUnfollow = async (userId: string) => {
        const followUnfollowReq = async () =>
            await axios.post(
                `${BASE_API_URL}/users/follow-unfollow/${userId}`,
                {},
                { withCredentials: true }
            );

        const result = await handleAuthRequest(followUnfollowReq); 
        if (result?.data.status === 'success') {
            dispatch(setAuthUser(result.data.user));
            toast.success((result.data.message))
        }
    };

    return {handleFollowUnfollow};
};