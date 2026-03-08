import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { CiMail } from "react-icons/ci";
import { MdDateRange } from "react-icons/md";
import Loader from "../Loader/Loader";
import { AuthContext } from "../../Context/AuthContext";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { FaCamera, FaComment, FaShareAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PostComment from "../PostComment/PostComment";
import { AiFillLike } from "react-icons/ai";

export default function Profile() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setUserPhoto } = useContext(AuthContext);
  const query = useQueryClient();
  const userPhoto = useRef(null);
  const { userId } = useContext(AuthContext);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { mutate } = useMutation({
    mutationFn: changeProfilePhoto,
    onSuccess: (res) => {
      const newPhoto = res?.data.data.photo;
      setUserPhoto(newPhoto);
      query.invalidateQueries({ queryKey: ["getProfileInfo"] });
      query.invalidateQueries({ queryKey: ["getPosts"] });
      toast.success("Profile Photo Updated Successfully..💜💜", {
        position: "top-center",
      });
    },
    onError: () => {
      toast.error("Can't update profile photo right now..!", {
        position: "top-center",
      });
    },
  });
  function getProfileInfo() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }
  useEffect(() => {
    getProfileInfo();
  }, []);

  const { isError, isLoading, data } = useQuery({
    queryKey: ["getProfileInfo"],
    queryFn: getProfileInfo,
  });

  function getPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  useEffect(() => {
    getPosts();
  }, []);

  const { data: posts, isLoading: loading } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getPosts,
  });

  const formatted = data?.data.data.user.dateOfBirth
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(data.data.data.user.dateOfBirth))
    : "";

  if (isLoading || loading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="min-h-screen justify-center items-center flex">
        <h1 className="bg-red-900 text-white text-3xl font-bold text-center rounded-3xl w-full">
          Cannot load profile now...!
        </h1>
      </div>
    );
  }

  const myPosts = posts?.data.data.posts;

  function changeProfilePhoto() {
    const profilePhoto = new FormData();
    profilePhoto.append("photo", profileImage);
    return axios.put(
      `https://route-posts.routemisr.com/users/upload-photo`,
      profilePhoto,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  function handleImagePreview(e) {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    const imagePreview = URL.createObjectURL(file);
    setSelectedPhoto(imagePreview);
    onOpen();
  }

  return (
    <>
      <Helmet>
        <title> {`${data?.data.data.user.name}`} Profile</title>
      </Helmet>

      <div className="w-[80%] mx-auto">
        <div className="flex flex-col gap-4 shadow-sm p-8 rounded-2xl">
          <div className="flex gap-3 items-center">
            <div className="group w-[120px] h-[120px] rounded-full border-1 border-slate-400/40 flex justify-center items-center p-3 relative">
              <img
                src={`${data?.data.data.user.photo}`}
                alt="Profile Photo"
                className="w-full rounded-full"
              />
              <div className="bg-blue-600 w-10 h-10 rounded-full absolute flex justify-center items-center end-0 bottom-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <label htmlFor="userPhoto">
                  <FaCamera className="text-white cursor-pointer" />
                </label>
                <input
                  type="file"
                  id="userPhoto"
                  onChange={handleImagePreview}
                  ref={userPhoto}
                  hidden
                />
              </div>
            </div>
            <div>
              <p className="font-bold text-2xl">{`${data?.data.data.user.name}`}</p>
              <p className="font-semibold text-slate-500 text-lg">
                @{`${data?.data.data.user.username}`}
              </p>
            </div>
          </div>
          <div>
            <div className=" p-4 rounded-2xl bg-slate-200 border-1 border-slate-500/20 flex flex-col gap-2">
              <p className="font-bold text-xl">About</p>
              <p className="flex gap-2 items-center">
                <CiMail className="text-lg text-slate-700/80 font-extrabold" />{" "}
                <span className="text-lg text-slate-700/80">{`${data?.data.data.user.email}`}</span>
              </p>
              <p className="flex gap-2 items-center">
                <MdDateRange className="text-lg text-slate-700/80 font-extrabold" />{" "}
                <span className="text-lg text-slate-700/80">{`${formatted}`}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="shadow-sm border-slate-300/40 border-1 bg-white p-3 rounded-lg text-center mt-10">
          <p className="text-xl font-bold">My Posts</p>
        </div>

        <div className="w-full my-8">
          {myPosts &&
            myPosts.map((post) => (
              <Card className="w-full mx-auto mb-6">
                <CardHeader className="flex justify-between ">
                  <div className="flex gap-3">
                    <img
                      alt="heroui logo"
                      height={40}
                      radius="sm"
                      src={post.user.photo}
                      width={40}
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="flex flex-col">
                      <p className="text-md">{post.user.name}</p>
                      <p className="text-small text-default-500">
                        @{`${data?.data.data.user.username}`}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  {post.body && <p className="my-2 p-2"> {post.body}</p>}
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.body || "Image Description"}
                      className="rounded-2xl"
                    />
                  )}
                </CardBody>
                <Divider />
                <CardFooter>
                  <div className="w-full flex justify-between p-2">
                    <div
                      className="cursor-pointer flex gap-2 items-center hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm
                          text-gray-500"
                    >
                      <AiFillLike />
                      <span>{post.likesCount} Like</span>
                    </div>
                    <div className="cursor-pointer hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm">
                      <Link
                        to={`/postdetails/${post.id}`}
                        className=" flex gap-2 items-center"
                      >
                        <FaComment className="text-gray-500" />
                        <span className="text-gray-500">
                          {post.commentsCount} Comment
                        </span>
                      </Link>
                    </div>
                    <div className="cursor-pointer flex gap-2 items-center hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm">
                      <FaShareAlt className="text-gray-500" />
                      <span className="text-gray-500">
                        {post.sharesCount} Share
                      </span>
                    </div>
                  </div>
                </CardFooter>

                {post.topComment && <PostComment comment={post.topComment} />}
              </Card>
            ))}

          {myPosts?.length === 0 && (
            <p className="bg-blue-200 text-2xl text-center font-bold rounded-lg">
              There is no Posts yet..
            </p>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div className="modal">
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Update Profile Photo..
                  </ModalHeader>
                  <ModalBody>
                    {selectedPhoto && (
                      <div className="relative">
                        <img
                          alt="Card background"
                          className="object-cover rounded-xl"
                          src={selectedPhoto}
                        />
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter className="flex items-center">
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
                      Update Photo
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      )}
    </>
  );
}
