import {
  CardFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
  Button,
} from "@heroui/react";
import React, { useContext, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaImage, FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function PostComment({ comment, isPostDetails = false }) {
  const commentDate = new Date(comment?.createdAt);
  const formattedCommentDate = commentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const postId = comment.post;
  const commentUserId = comment.commentCreator._id;
  const { userId: loggedUserId } = useContext(AuthContext);
  const commentId = comment._id;

  // delete comment //////////////////////////////////////////////////////

  function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const query = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: isPostDetails ? ["getAllComments"] : ["getAllPosts"],
      });
      updateCommentQuery.invalidateQueries({
        queryKey: isPostDetails ? ["getSinglePost", postId] : "",
      });
      toast.success(`Comment Deleted Successfully...✅`, {
        position: `top-center`,
      });
    },
    onError: () => {
      toast.error(`Can't Delete This Comment Right Now...!!`, {
        position: `top-center`,
      });
    },
  });

  // edit comment ////////////////////////////////////////////////////////////

  function updateComment() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      collectComment(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const updateCommentQuery = useQueryClient();

  const { mutate: updateCommentMutate } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      updateCommentQuery.invalidateQueries({
        queryKey: isPostDetails ? ["getAllComments"] : ["getAllPosts"],
      });
      toast.success(`Comment Updated Successfully...✅`, {
        position: `top-center`,
      });
    },
    onError: () => {
      toast.error(`Can't Update This Comment Right Now...!!`, {
        position: `top-center`,
      });
    },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [updatedContent, setUpdatedContent] = useState("");
  const [updatedImage, setUpdatedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  function handleOldValues() {
    if (comment.content) {
      setUpdatedContent(comment.content);
    }
    if (comment.image) {
      setPreviewImage(comment.image);
    }

    setUpdatedImage(null);
  }

  function collectComment() {
    const updatedComment = new FormData();

    if (updatedContent) {
      updatedComment.append("content", updatedContent);
    }

    if (updatedImage) {
      updatedComment.append("image", updatedImage);
    }

    return updatedComment;
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setImageRemoved(false);
      return;
    }

    setUpdatedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  }

  function removeImagePreview() {
    setPreviewImage(null);
    setUpdatedImage(null);
    setImageRemoved(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <CardFooter className="flex-col gap-2 items-start bg-blue-50 mb-2 p-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-3">
          <img
            alt="heroui logo"
            height={40}
            radius="sm"
            src={comment.commentCreator.photo}
            width={40}
            className="rounded-xl"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="flex flex-col">
            <p className="text-md">{comment.commentCreator.name}</p>
            <p className="text-small text-default-500">
              {formattedCommentDate}
            </p>
          </div>
        </div>

        <div className="modal">
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Edit Your Comment..
                  </ModalHeader>
                  <ModalBody>
                    <textarea
                      value={updatedContent}
                      onChange={(e) => setUpdatedContent(e.target.value)}
                      className="w-full p-2 outline-none bg-slate-100 focus:bg-slate-200 rounded-xl"
                      placeholder="Write Here..."
                    ></textarea>

                    {previewImage && (
                      <div className="relative">
                        <img
                          alt="Card background"
                          className="object-cover rounded-xl"
                          src={previewImage}
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
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />
                    </label>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => {
                        onClose();
                        updateCommentMutate();
                      }}
                    >
                      Edit Comment
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>

        {commentUserId === loggedUserId && (
          <Dropdown>
            <DropdownTrigger>
              <BsThreeDotsVertical className="cursor-pointer hover:bg-slate-100 rounded-3xl p-1 size-6 outline-none" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="edit">
                <div
                  className="flex justify-between items-center"
                  onClick={function () {
                    handleOldValues();
                    onOpen();
                  }}
                >
                  <span>Edit</span> <FaPen />
                </div>
              </DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                <div
                  className="flex justify-between items-center"
                  onClick={mutate}
                >
                  <span>Delete</span>
                  <FaTrash />
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
      {comment.content && <p>{comment.content}</p>}
      {comment.image && <img src={`${comment.image}`} />}
    </CardFooter>
  );
}
