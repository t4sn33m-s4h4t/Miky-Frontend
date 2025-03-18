"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BASE_API_URL } from "../../../server";
import { handleAuthRequest } from "../utils/apiRequest";
import { addPost } from "../../../Store/postSlice";
import { LoadingButton } from "../Helper/LoadinButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreatePostModel = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null);
      setPreviewImage(null);
      setCaption("");
    }
  }, [isOpen]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (!file) {
        toast.error("Please select a file!");
        return;
      }
 
      if (!file.type) {
        toast.error("Invalid file type!");
        return;
      }
 
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file!");
        return;
      }


      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should not exceed 10MB!");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to create a post!");
      return;
    }

    const data = new FormData();
    if (caption) data.append("caption", caption);
    data.append("image", selectedImage);

    const createPostReq = async () =>
      await axios.post(`${BASE_API_URL}/posts/create-post`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

    const result = await handleAuthRequest(createPostReq, setIsLoading);

    if (result) {
      dispatch(addPost(result.data.data.post));
      toast.success("Post Created Successfully!");
      setPreviewImage(null);
      setCaption("");
      setSelectedImage(null);
      onClose();
      router.push("/");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div id="create-post">
          {previewImage ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="mt-4">
                <Image
                  src={previewImage}
                  alt="Image"
                  height={400}
                  width={400}
                  className="overflow-hidden max-h-96 rounded-md object-contain w-full"
                />
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a Caption..."
                  className="mt-4 p-2 border border-secondary-300 rounded-md w-full text-primary-600 focus:outline-none bg-primary-150 focus:ring-2 focus:ring-secondary-300"
                />
                <div className="flex space-x-4 mt-4">
                  <LoadingButton 
                    className="bg-primary-450 text-white hover:bg-primary-150 hover:text-secondary-500 "
                    onClick={handleCreatePost}
                    isLoading={isLoading}
                  >
                    Create Post
                  </LoadingButton>
                  <Button
                    variant={"outline"}
                    className="bg-primary-150 text-secondary-500 hover:bg-primary-450 hover:text-white"
                    onClick={() => {
                      setPreviewImage(null);
                      setSelectedImage(null);
                      setCaption("");
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-center my-3">Upload Photo</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex space-x-2 text-primary-350">
                  <ImageIcon size={40} />
                </div>
                <p className="text-primary-650 mt-4">Select a photo from your computer</p>
                <Button className="hover:bg-secondary-700 text-white bg-primary-500" onClick={handleButtonClick}>
                  Select from computer
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className=" hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModel;
