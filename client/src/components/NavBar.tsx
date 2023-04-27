import axios from "axios";

/* next */
import Image from "next/image";
import Link from "next/link"

/* auth */
import { useAuthDispatch, useAuthState } from "../context/auth"

/* React-icons */
import { FaSearch } from "react-icons/fa";


const NavBar: React.FC = () => {
    const { loading, authenticated } = useAuthState();
    const dispatch = useAuthDispatch();

    const handleLogout = () => {
        axios.post("/auth/logout")
            .then(() => {
                dispatch("LOGOUT");
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white shadow">
            <span className="text-2xl font-semibold text-gray-400">
                <Link href="/">
                    <span>
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={30}
                            height={30}
                        >
                        </Image>
                    </span>
                </Link>
            </span>
            <div className="search-bar max-w-full px-4">
                <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
                    <FaSearch className="ml-2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Community"
                        className="px-3 py-1 bg-transparent rounded h-7 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex">
                {!loading && (
                    authenticated ? (
                        <button
                            className="w-20 p-2 mr-2 text-sm text-center text-white border border-orange-500 bg-orange-500 rounded"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    ) : (<>
                        <Link href="/login">
                            <span className="w-20 px-3 p-2 mr-2 text-sm text-center text-orange-500 border border-orange-500 rounded">
                                로그인
                            </span>
                        </Link>
                        <Link href="/register">
                            <span className="w-20 p-2 text-sm text-center text-white border border-orange-500 bg-orange-500 rounded">
                                회원가입
                            </span>
                        </Link>
                    </>)
                )}
            </div>
        </div>
    )
}

export default NavBar