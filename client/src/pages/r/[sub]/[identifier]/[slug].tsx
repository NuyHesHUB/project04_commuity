import { FormEvent, useState } from "react";
import axios from "axios";

/* next */
import Link from "next/link";
import { useRouter } from "next/router";

/* auth */
import { useAuthState } from "../../../../context/auth";

/* Types */
import { Comment, Post } from "../../../../types";

/* Libaray */
import useSWR from 'swr';
import dayjs from 'dayjs';
import classNames from 'classnames';

/* React-icons */
import { FaThumbsUp, FaThumbsDown, FaCommentAlt } from "react-icons/fa";

const PostPage = () => {
    const router = useRouter();
    const { identifier, sub, slug } = router.query;
    const { authenticated, user } = useAuthState();
    const [newComment, setNewComment] = useState("");
    const { data: post, error, mutate: postMutate } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);
    const { data: comments, mutate: commentMutate } = useSWR<Comment[]>(
        identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
    )

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (newComment.trim() === "") {
            return;
        }

        try {
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
                body: newComment
            });
            commentMutate();
            setNewComment("");
        } catch (error) {
            console.log(error);
        }
    }

    const vote = async (value: number, comment?: Comment) => {
        if (!authenticated) router.push("/login");

        // 이미 클릭 한 vote 버튼을 눌렀을 시에는 reset
        if (
            (!comment && value === post?.userVote) ||
            (comment && comment.userVote === value)
        ) {
            value = 0
        }

        try {
            await axios.post("/votes", {
                identifier,
                slug,
                commentIdentifier: comment?.identifier,
                value
            })
            postMutate();
            commentMutate();
        } catch (error) {
            console.log(error);
        }
    }
    console.log('post.userVote', post?.userVote);
    return (
        <div className="max-w-5xl px-4 pt-5">
            <div className="w-full md:mr-3 md:w-8/12 mx-auto">
                <div className="bg-white p-3 rounded shadow-lg">
                    {post && (
                        <>
                            <div className="flex">
                                {/* 좋아요 싫어요 기능 */}
                                <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                                    <div 
                                        className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:text-red-500"
                                        onClick={() => vote(1)}
                                    >
                                        {post.userVote === 1?
                                            <FaThumbsUp className="text-red-500"/>
                                            : <FaThumbsUp/>
                                        }
                                    </div>
                                    <p className="text-xs font-bold mt-1 mb-1">{post.voteScore}</p>
                                    {/* 싫어요 */}
                                    <div 
                                        className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:text-blue-500"
                                        onClick={() => vote(-1)}
                                    >
                                        {post.userVote === -1?
                                            <FaThumbsDown className="text-blue-500"/>
                                            : <FaThumbsDown/>
                                        }
                                    </div>
                                </div>
                                <div className="py-2 pr-2 mb-10">
                                    <div className="flex items-center">
                                        <p className="text-xs text-gray-400">
                                            Posted by
                                            <Link href={`/u/${post.username}`}>
                                                <span className="mx-1 hover:underline">
                                                    {post.username}
                                                </span>
                                            </Link>
                                            <Link href={post.url}>
                                                <span className="mx-1 hover:underline">
                                                    {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
                                                </span>
                                            </Link>
                                        </p>
                                    </div>
                                    <h1 className="my-3 text-xl font-medium">{post.title}</h1>
                                    <p className="my-3 text-sm">{post.body}</p>
                                    
                                </div>
                            </div>
                            <div className="pr-8 pl-8 pb-4">
                                {/* 댓글 작성 구간 */}
                                <div className="flex items-center text-sm mb-2">
                                    <FaCommentAlt className="mr-1 fa-xs"></FaCommentAlt>
                                    <span className="font-bold ">
                                        {post.commentCount} Comments
                                    </span>
                                </div>
                                <div className="pr-2 mb-4 pl-2">
                                    {authenticated ? 
                                    (<div>
                                        <p className="mb-1 text-xs">
                                            <Link href={`/u/${user?.username}`}>
                                                <span className="font-semibold text-orange-500">
                                                    {user?.username}
                                                </span>
                                            </Link>
                                            {" "}으로 댓글 작성
                                        </p>
                                        <form onSubmit={handleSubmit}>
                                            <textarea
                                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                                                onChange={e => setNewComment(e.target.value)}
                                                value={newComment}
                                            ></textarea>
                                            <div className="flex justify-end">
                                                <button className="px-3 py-1 text-sm text-white bg-orange-500 rounded" disabled={newComment.trim() === ""}>
                                                    댓글 작성
                                                </button>
                                            </div>
                                        </form>
                                    </div>) 
                                    :
                                    (<div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded-lg">
                                        <p className="font-semibold ml-3 text-sm text-gray-400">
                                            댓글 작성을 위해서 로그인 해주세요.
                                        </p>
                                        <div>
                                            <Link href={`/login`}>
                                                <span className="px-3 py-2 text-white text-sm bg-orange-500 rounded">로그인</span>
                                            </Link>
                                        </div>
                                    </div>)
                                }
                                </div>
                                {/* 댓글 리스트 부분 */}
                                {comments?.map(comment => (
                                    <div className="flex bg-gray-100 rounded-lg my-3" key={comment.identifier}>
                                        {/* 댓글 좋아요 싫어요 기능 */}
                                        <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                                            <div 
                                                className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:text-red-500"
                                                onClick={() => vote(1, comment)}
                                            >
                                                {comment.userVote === 1?
                                                    <FaThumbsUp className="text-red-500"/>
                                                    : <FaThumbsUp/>
                                                }
                                            </div>
                                            <p className="text-xs font-bold mt-1 mb-1">{comment.voteScore}</p>
                                            {/* 싫어요 */}
                                            <div 
                                                className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:text-blue-500"
                                                onClick={() => vote(-1, comment)}
                                            >
                                                {comment.userVote === -1?
                                                    <FaThumbsDown className="text-blue-500"/>
                                                    : <FaThumbsDown/>
                                                }
                                            </div>
                                        </div>
                                        <div className="py-2 pr-2">
                                            <p className="mb-1 text-xs leading-none flex items-center">
                                                <Link href={`/u/${comment.username}`}>
                                                    <span className="mr-1 font-bold hover:underline">
                                                        {comment.username}
                                                    </span>
                                                </Link>
                                                <span className="text-gray-600">
                                                    {`
                                                        ${comment.voteScore}
                                                        posts
                                                        ${dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                                                    `}
                                                </span>
                                            </p>
                                            <p>{comment.body}</p>
                                        </div>    
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div> 
    )
}

export default PostPage