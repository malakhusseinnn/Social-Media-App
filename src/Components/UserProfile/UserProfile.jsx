import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Loader from "../Loader/Loader";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import { Link, useParams } from "react-router-dom";
import PostComment from "../PostComment/PostComment";
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaShareAlt } from "react-icons/fa";

export default function UserProfile() {
  const { id } = useParams();

  function getProfileInfo() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }
  useEffect(() => {
    getProfileInfo();
  }, []);

  const { isError, isLoading, data } = useQuery({
    queryKey: ["getProfileInfo", id],
    queryFn: getProfileInfo,
  });

  function getPosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  useEffect(() => {
    getPosts();
  }, []);

  const { data: userPosts, isLoading: loading } = useQuery({
    queryKey: ["getPosts", id],
    queryFn: getPosts,
  });

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

  const posts = userPosts?.data.data.posts;

  return (
    <>
      <Helmet>
        <title> {`${data?.data.data.user.name}`} Profile</title>
      </Helmet>

      <div className="w-[80%] mx-auto">
        <div className="shadow-sm p-8 rounded-2xl">
          <div className="flex gap-3 items-center">
            <div className="group w-[120px] h-[120px] rounded-full border-1 border-slate-400/40 flex justify-center items-center p-3 relative">
              <img
                src={`${data?.data.data.user.photo}`}
                alt="Profile Photo"
                className="w-full rounded-full"
              />
            </div>
            <div>
              <p className="font-bold text-2xl">{`${data?.data.data.user.name}`}</p>
              <p className="font-semibold text-slate-500 text-lg">
                @{`${data?.data.data.user.username}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-sm border-slate-300/40 border-1 bg-white p-3 rounded-lg text-center mt-10">
        <p className="text-xl font-bold">Posts</p>
      </div>

      <div className="w-full my-8">
        {posts &&
          posts.map((post) => (
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
                  <div className="cursor-pointer flex gap-2 items-center hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm text-gray-500">
                    <AiFillLike />
                    {post.likesCount}
                    <span>Like</span>
                  </div>
                  <div className="cursor-pointer hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm">
                    <Link
                      to={`/postdetails/${post.id}`}
                      className=" flex gap-2 items-center"
                    >
                      <FaComment className="text-gray-500" />
                      <span className="text-gray-500">
                        {" "}
                        {post.commentsCount} Comment
                      </span>
                    </Link>
                  </div>
                  <div className="cursor-pointer flex gap-2 items-center hover:bg-slate-100 transition-all duration-300 p-2 rounded-sm">
                    <FaShareAlt className="text-gray-500" />
                    <span className="text-gray-500">{post.sharesCount} Share</span>
                  </div>
                </div>
              </CardFooter>

              {post.topComment && <PostComment comment={post.topComment} />}
            </Card>
          ))}

        {posts.length === 0 && (
          <p className="bg-blue-200 text-2xl text-center font-bold rounded-lg">
            There is no Posts yet..
          </p>
        )}
      </div>
    </>
  );
}
