import React from 'react'
import axios from 'axios'

/* next */
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

/* auth */
import { useAuthState } from '../context/auth'

/* Types */
import { Post } from '../types'

/* Library */
import dayjs from 'dayjs'

/* React-icons */
import { FaThumbsUp, FaThumbsDown, FaCommentAlt } from 'react-icons/fa'


interface PostCardProps {
    post: Post
    subMutate?: () => void
    mutate?: () => void
}

const PostCard = ({
    post: {
        identifier,
        slug,
        title,
        body,
        subName,
        createdAt,
        voteScore,
        userVote,
        commentCount,
        url,
        username,
        sub
    },
    mutate,
    subMutate
}: PostCardProps) => {
    const router = useRouter()
    const isInSubPage = router.pathname === "/r/[sub]"

    const { authenticated } = useAuthState();

    const vote = async (value: number) => {
        if (!authenticated) router.push("/login");

        if (value === userVote) value = 0;

        try {
            await axios.post("/votes", { identifier, slug, value });
            if (mutate) mutate();
            if (subMutate) subMutate();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            className='flex mb-4 bg-white rounded shadow-md'
            id={identifier}
        >
            {/* 좋아요 싫어요 기능 부분 */}
            <div className="flex-shrink-0 w-10 text-center rounded-l border-r flex flex-col justify-center">
                {/* 좋아요 */}
                <div
                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:text-red-500"
                    onClick={() => vote(1)}
                >
                    {userVote === 1 ?
                        <FaThumbsUp className="text-red-500" />
                        : <FaThumbsUp />
                    }
                </div>
                <p className="text-xs font-bold mt-2 mb-2">{voteScore}</p>
                {/* 싫어요 */}
                <div
                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:text-blue-500"
                    onClick={() => vote(-1)}
                >
                    {userVote === -1 ?
                        <FaThumbsDown className="text-blue-500" />
                        : <FaThumbsDown />
                    }
                </div>
            </div>
            {/* 포스트 데이터 부분 */}
            <div className="w-full p-2">
                <div className='flex items-center justify-between p-2 border-b'>
                    {!isInSubPage && (
                        <div className='flex items-center'>
                            <Link href={`/r/${subName}`}>
                                <span>
                                    <Image
                                        src={sub!.imageUrl}
                                        alt="sub"
                                        className='rounded-full cursor-pointer'
                                        width={20}
                                        height={20}
                                    />
                                </span>
                            </Link>
                            <Link href={`/r/${subName}`}>
                                <span className="ml-2 text-sm font-bold cursor-pointer hover:underline">
                                    {subName}
                                </span>
                            </Link>
                            {/* <span className="mx-1 text-xs text-gray-400">•</span> */}
                        </div>
                    )}

                    <p className="text-xs text-gray-400 flex items-center">
                        Posted by
                        <Link href={`/u/${username}`}>
                            <span className="mx-1 hover:underline font-semibold text-black text-sm">{username}</span>
                        </Link>
                        <Link href={url}>
                            <span className='mx-1 hover:underline'>
                                {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
                            </span>
                        </Link>
                    </p>
                </div>
                <div className='ml-2'>
                    <Link href={url}>
                        <span className="my-1 text-lg font-medium">{title}</span>
                    </Link>
                    {body && <p className="my-1 text-sm">{body}</p>}
                    <div className='pt-2'>
                        <Link href={url}>
                            <span className="flex items-center justify-end mr-2">
                                <FaCommentAlt className="mr-1 text-gray-400 fa-xs"></FaCommentAlt>
                                <span className='text-xs hover:underline'>코멘트 <span className='text-orange-400 font-semibold'>{commentCount}</span> 개</span>
                            </span>
                        </Link>
                    </div>
                </div>
                {/* <Link href={url}>
                    <a className="my-1 text-lg font-medium">{title}</a>
                </Link>
                {body && <p className="my-1 text-sm">{body}</p>}
                <div className="flex">
                    <Link href={url}>
                        <span>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span>{commentCount}</span>
                        </span>
                    </Link>
                </div> */}
            </div>
        </div>
    )
}

export default PostCard