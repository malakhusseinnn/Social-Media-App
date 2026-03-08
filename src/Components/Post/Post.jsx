import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
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
import { AiFillLike } from "react-icons/ai";
import { FaShareAlt } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CommentCreation from "../CommentCreation/CommentCreation";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaImage, FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";
import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoIosCloseCircleOutline } from "react-icons/io";
import PostComment from "../PostComment/PostComment";

export default function Post({ post, isPostDetails = false }) {
  const [updatedContent, setUpdatedContent] = useState("");
  const [updatedImage, setUpdatedImage] = useState(null);
  const fileInputRef = useRef(null);
  const likesQuery = useQueryClient();
  const { userId } = useContext(AuthContext); // logged user id
  const {
    body,
    createdAt,
    id,
    image,
    user,
    topComment,
    likesCount,
    commentsCount,
    sharesCount,
    likes: postLikes,
  } = post;
  const postUserId = user._id; //Post User Id
  const { name, photo } = user;
  const date = new Date(createdAt);
  const formattedPostDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if ((body === " " || !body) && !image) return;

  function getAllComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  const { data } = useQuery({
    queryKey: ["getAllComments", id],
    queryFn: getAllComments,
    enabled: isPostDetails,
  });

  const allComments = data?.data.data.comments;

  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  const navigate = useNavigate();
  const query = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success(`Post Deleted Successfully...✅`, {
        position: `top-center`,
      });
      navigate("/");
    },
    onError: () => {
      toast.error(`Can't Delete This Post right now...!!`, {
        position: `top-center`,
      });
    },
  });

  // update post  /////////////////////////////////////////////////////////////

  function updatePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}`,
      handleUpdate(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const updateQuery = useQueryClient();
  const { mutate: updateMutate } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      updateQuery.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success(`Post Updated Successfully...✅`, {
        position: `top-center`,
      });
      navigate("/");
    },
    onError: () => {
      toast.error(`Can't Update This Post right now...!!`, {
        position: `top-center`,
      });
    },
  });

  function handleUpdate() {
    const updatedPost = new FormData();
    if (body) {
      updatedPost.append("body", updatedContent);
    }
    if (updatedImage) {
      updatedPost.append("image", updatedImage);
    }
    return updatedPost;
  }

  function showBeforeUpdate() {
    if (body) {
      setUpdatedContent(body);
    }
    if (image) {
      setUpdatedImage(image);
    }
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isUploaded, setIsUploaded] = useState(null);

  function handleImagePreview(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUpdatedImage(file);
    const imagePath = URL.createObjectURL(e.target.files[0]);
    setIsUploaded(imagePath);
  }

  function removeImagePreview() {
    setIsUploaded(null);
    setUpdatedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // like - unlike post ////////////////////////////////////////////////////////////////////////////////////

  const [isLikedByMe, setIsLikedByMe] = useState(function () {
    return postLikes?.includes(userId);
  });

  function likePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  function getPostLikes() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/likes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { mutate: likeThePost } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      likesQuery.invalidateQueries({
        queryKey: isPostDetails ? ["getSinglePost", id] : ["getAllPosts"],
      });
      setIsLikedByMe((prev) => !prev);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { data: likes } = useQuery({
    queryKey: ["getPostLikes", id],
    queryFn: getPostLikes,
  });

  return (
    <Card className="max-w-125 mx-auto mb-6">
      <CardHeader className="flex justify-between ">
        <div className="flex gap-3">
          <Link to={`/profile/${postUserId}`}>
            {" "}
            <img
              alt="heroui logo"
              height={40}
              radius="sm"
              src={photo}
              width={40}
              onError={(e) => {
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
          </Link>

          <div className="flex flex-col">
            <p className="text-md">{name}</p>
            <p className="text-small text-default-500">{formattedPostDate}</p>
          </div>
        </div>

        <div className="modal">
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Edit Your Post Now!
                  </ModalHeader>
                  <ModalBody>
                    <textarea
                      value={updatedContent}
                      onChange={(e) => setUpdatedContent(e.target.value)}
                      className="w-full p-2 outline-none bg-slate-100 focus:bg-slate-200 rounded-xl"
                      placeholder="Write Here..."
                    ></textarea>

                    {(isUploaded || updatedImage) && (
                      <div className="relative">
                        <img
                          alt="Card background"
                          className="object-cover rounded-xl"
                          src={isUploaded || updatedImage}
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
                        updateMutate();
                      }}
                    >
                      Edit Post
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>

        {postUserId === userId && (
          <Dropdown>
            <DropdownTrigger>
              <BsThreeDotsVertical className="cursor-pointer hover:bg-slate-100 rounded-3xl p-1 size-6 outline-none" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="edit">
                <div
                  className="flex justify-between items-center"
                  onClick={function () {
                    onOpen();
                    showBeforeUpdate();
                  }}
                >
                  <span>Edit Post</span> <FaPen />
                </div>
              </DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                <div
                  className="flex justify-between items-center"
                  onClick={mutate}
                >
                  <span>Delete Post</span>
                  <FaTrash />
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        {body && <p className="my-2 p-2"> {body}</p>}
        {image && (
          <img
            src={image}
            alt={body || "Image Description"}
            className="rounded-2xl"
          />
        )}

        <div className="mt-5 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="bg-blue-200 rounded-full w-6 h-6 flex justify-center items-center">
              <AiFillLike className="text-blue-600" />
            </div>
            <span className="text-gray-400">{likesCount} likes</span>
          </div>

          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <span className="text-gray-400">{sharesCount} shares</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-gray-400">{commentsCount} comments</span>
            </div>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="w-full flex justify-between p-2">
          <div
            className={`cursor-pointer flex gap-2 items-center hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm ${
              isLikedByMe ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
            onClick={likeThePost}
          >
            <AiFillLike />
            Like
          </div>
          <div className="cursor-pointer hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm">
            <Link
              to={`/postdetails/${id}`}
              className=" flex gap-2 items-center"
            >
              <FaComment className="text-gray-500" />
              <span className="text-gray-500">Comment</span>
            </Link>
          </div>
          <div className="cursor-pointer flex gap-2 items-center hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm">
            <FaShareAlt className="text-gray-500" />
            <span className="text-gray-500">Share</span>
          </div>
        </div>
      </CardFooter>

      <CommentCreation
        postId={id}
        queryKey={isPostDetails ? ["getAllComments"] : ["getAllPosts"]}
        isPostDetails={isPostDetails}
      />

      {topComment && !isPostDetails && <PostComment comment={topComment} />}

      {isPostDetails &&
        allComments?.map((currentComment) => (
          <PostComment
            key={currentComment.id}
            comment={currentComment}
            isPostDetails
          />
        ))}
    </Card>
  );
}
