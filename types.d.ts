export interface User {
    _id: string;
    username: string;
    email: string;
    password?: string;
    profilePicture?: string;
    bio?: string;
    followers: string[];
    following: string[];
    posts: Post[];
    savedPosts: string[] | Post[];
    isVerified: boolean;
    isAdmin: boolean;
}

export interface PostComment {  
    _id: string;
    text: string;
    user: {
        _id: string;
        username: string;
        profilePicture?: string;
    } | User;
    createdAt: string;
}

export interface Post {
    _id: string;
    caption: string;
    image?: {
        url: string;
        publicId: string;
    };
    user: User;
    likes: string[];
    comments: PostComment[];  
    createdAt: string;
}