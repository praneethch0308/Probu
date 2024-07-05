import { MdOutlineFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { FaRegPlusSquare, FaEye, FaPencilAlt } from "react-icons/fa";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from "react";

function User() {
    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({ duration: 1000 });
    })

    return (
        <div className="flex flex-col min-h-screen">
            <div className="pb-10">
                <Mainnav />
            </div>
            <div className="flex flex-grow">
                <Sidebar />
                <div className="flex flex-col flex-grow p-5 pt-14">
                    <div className="flex-grow">
                        <div className='flex justify-end pr-20 pb-10'>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="p-3 rounded-xl border-2 border-black"
                                />
                                <button
                                    className="flex items-center bg-green-600 rounded-xl p-3 text-white font-semibold hover:bg-green-700 transition duration-300"
                                    onClick={() => navigate('/')}>
                                    <MdOutlineFileDownload className='h-6 w-6 mr-2' />
                                    Export to Excel
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <table className="pr-2 pl-2 w-2/3 ml-28 table-auto shadow-md">
                                <thead className="bg-black rounded-t-lg">
                                    <tr>
                                        <th className="text-white px-2 py-2">Username</th>
                                        <th className="text-white px-2 py-2">Status</th>
                                        <th className="text-white px-2 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-100 border-b">
                                        <td className="px-2 py-2 text-center">User1</td>
                                        <td className="px-2 py-2 text-center">Active</td>
                                        <td className="px-2 py-2 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button className="text-black hover:text-gray-800">
                                                    <FaEye />
                                                </button>
                                                <button className="text-black hover:text-gray-800">
                                                    <FaPencilAlt onClick={() => { navigate('/user-update') }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100 border-b">
                                        <td className="px-2 py-2 text-center">User2</td>
                                        <td className="px-2 py-2 text-center">Inactive</td>
                                        <td className="px-2 py-2 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button className="text-black hover:text-gray-800">
                                                    <FaEye />
                                                </button>
                                                <button className="text-black hover:text-gray-800">
                                                    <FaPencilAlt onClick={() => { navigate('/user-update') }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100 border-b">
                                        <td className="px-2 py-2 text-center">User3</td>
                                        <td className="px-2 py-2 text-center">Pending</td>
                                        <td className="px-2 py-2 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button className="text-black hover:text-gray-800">
                                                    <FaEye />
                                                </button>
                                                <button className="text-black hover:text-gray-800">
                                                    <FaPencilAlt onClick={() => { navigate('/user-update') }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;