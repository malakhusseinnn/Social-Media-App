import {
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import React, { useContext, useRef, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthContext";

export default function PostCreation() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isUploaded, setIsUploaded] = useState(null);
  const { userPhoto } = useContext(AuthContext);

  const content = useRef(null);
  const postImage = useRef(null);

  function collectData() {
    const data = new FormData();
    if (!content.current && !postImage.current.files[0]) {
      return;
    }
    if (content.current.value) {
      data.append("body", content.current.value);
    }
    if (postImage.current.files[0]) {
      data.append("image", postImage.current.files[0]);
    }

    return data;
  }

  function createPost() {
    return axios.post(
      "https://route-posts.routemisr.com/posts",
      collectData(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const query = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setIsUploaded(null);
      toast.success("Post Created Successfully..!💜", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: (e) => {
      console.log(e);

      toast.error("Can't Create the post right now..!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("error");
    },
  });

  function handleImagePreview(e) {
    const imagePath = URL.createObjectURL(e.target.files[0]);
    setIsUploaded(imagePath);
  }

  function removeImagePreview() {
    setIsUploaded(null);
    postImage.current.value = "";
  }

  return (
    <>
      <div className="max-w-125 mx-auto mb-6 bg-slate-100 p-2 rounded-xl">
        <div className="flex gap-2">
          <Avatar
            isBordered
            size="md"
            src={userPhoto}
          />

          <input
            onClick={onOpen}
            type="text"
            className="w-full p-2 outline-none focus:bg-slate-200 rounded-xl"
            placeholder="What's in your mind..."
            readOnly
          />
        </div>

        <div className="modal">
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Create Your Post Now!
                  </ModalHeader>
                  <ModalBody>
                    <textarea
                      ref={content}
                      className="w-full p-2 outline-none bg-slate-100 focus:bg-slate-200 rounded-xl"
                      placeholder="Write Here..."
                    ></textarea>

                    {isUploaded && (
                      <div className="relative">
                        <img
                          alt="Card background"
                          className="object-cover rounded-xl"
                          src={isUploaded}
                        />

                        <IoIosCloseCircleOutline
                          onClick={removeImagePreview}
                          className="absolute top-2.5 end-2.5 text-white bg-slate-900 size-7 cursor-pointer rounded-xl"
                        />
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter className="flex items-center">
                    <label className="cursor-pointer bg-slate-100 p-3 w-20 rounded-xl hover:bg-slate-200 flex justify-center items-center">
                      <FaImage />
                      <input
                        type="file"
                        hidden
                        onChange={handleImagePreview}
                        ref={postImage}
                      />
                    </label>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => {
                        onClose();
                        mutate();
                      }}
                    >
                      Create
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
}
