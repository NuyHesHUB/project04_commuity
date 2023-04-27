import Link from 'next/link'
import React from 'react'
import { useAuthState } from '../context/auth'
import { Sub } from '../types'
import dayjs from 'dayjs';
type Props = {
    sub: Sub
}

const SideBar = ({ sub }: Props) => {
    const { authenticated } = useAuthState();
    return (
        <div className='hidden w-4/12 ml-3 md:block'>
            <div className='bg-white border rounded shadow-sm'>
                <div className='p-3 bg-orange-500 rounded-t'>
                    <p className='font-semibold text-white text-center'>커뮤니티에 대해서</p>
                </div>
                <p className='my-3 text-xs text-center'>
                        커뮤니티 생성일 : {dayjs(sub?.createdAt).format('YYYY.MM.DD')}
                </p>
                <div className='p-3 border-t'>
                    <p className='mb-3 text-base'>{sub?.description}</p>
                    <div className='flex mb-3 text-sm font-medium'>
                        <div className='w-100 text-sm'>
                            <p>Hello, welcome to the community.</p>
                            <br/>
                            <p>
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                                Omnis laborum adipisci ratione aut et aspernatur numquam tempora 
                                cupiditate illum quae fugit voluptatibus harum earum deserunt in 
                                temporibus aliquam, perferendis quaerat?
                            </p>
                        </div>
                    </div>
                    {authenticated && (
                        <div className='mx-0 my-2 text-center mt-10'>
                            <Link href={`/r/${sub.name}/create`}>
                                <span className='w-full p-2 text-sm text-white bg-orange-500 rounded'>
                                    포스트 생성
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SideBar