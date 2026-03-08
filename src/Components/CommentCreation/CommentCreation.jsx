import { Input } from "@heroui/react";
import { FaComment } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import { toast } from "react-toastify";

export default function CommentCreation({
  postId,
  queryKey,
  isPostDetails = false,
}) {
  const query = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });

  let createdComment;

  function createComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      createdComment,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("Comment Created Successfully..!💜", {
        position: "top-center",
      });
      query.invalidateQueries({ queryKey: queryKey });
      reset();
      query.invalidateQueries({
        queryKey: isPostDetails ? ["getSinglePost", postId] : "",
      });
    },
    onError: (err) => {
      console.log(err);

      toast.error("Can't Create the comment right now..!☹️", {
        position: "top-center",
      });
    },
  });

  function handleCreateComment(comment) {
    if (!comment.content && !comment.image[0]) return;

    createdComment = new FormData();
    if (comment.content) {
      createdComment.append("content", comment.content);
    }
    if (comment.image[0]) {
      createdComment.append("image", comment.image[0]);
    }
    mutate();
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateComment)}>
        <Input
          {...register("content")}
          labelPlacement="outside"
          placeholder="Enter your comment..."
          endContent={
            <button
              disabled={isPending}
              type="submit"
              className="cursor-pointer bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-900 text-white p-2 rounded-xl flex justify-center items-center"
            >
              {isPending ? (
                <LuLoaderCircle className="animate-spin" />
              ) : (
                <FaComment />
              )}
            </button>
          }
          className="my-2 w-[95%] mx-auto"
        />
        <div className="p-1 bg-blue-400 flex justify-center items-center mx-auto w-[95%] rounded-xl cursor-pointer mb-3">
          <label
            htmlFor="commentImage"
            className="text-2xl cursor-pointer text-white w-full flex justify-center items-center"
          >
            <FaCloudUploadAlt />
          </label>
          <input {...register("image")} type="file" id="commentImage" hidden />
        </div>
      </form>
    </>
  );
}
