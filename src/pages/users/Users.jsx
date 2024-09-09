import { MdOutlineFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaRegPlusSquare, FaEye, FaPencilAlt } from "react-icons/fa";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useContext, useState } from "react";
import { useSidebar } from "../../context/sidebar/SidebarContext";
import { useUserContext } from "../../context/users/UserContext";
import ExportToExcelButton from "../../components/ExcelButton";

function User() {
  const navigate = useNavigate();

  const { isOpened } = useSidebar();
  const { users, getAllUsers } = useUserContext();

  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 3


  useEffect(() => {
    Aos.init({ duration: 1000 });
    getAllUsers(0, 10); 
  }, []);

  const indexOfLastUsers = currentPage * usersPerPage
  const indexOfFirstUsers = indexOfLastUsers - usersPerPage
  const currentUsers = users.slice(
    indexOfFirstUsers,
    indexOfLastUsers
  )

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div>
        <Sidebar />
        <div className={`content-transition ${isOpened ? "sidebar-opened mr-5" : "sidebar-closed mr-5"}`}>
          <div className="flex justify-end pt-14 pb-2">
            <div className="flex space-x-4 items-center mr-2">
              <input
                type="text"
                placeholder="Search..."
                className="p-3 rounded-xl border-2 border-black"
              />
                <ExportToExcelButton tableId='users'/>
            </div>
          </div>
          <div className="pt-10">
            <table id='users' className={"w-full shadow-md cursor-pointer"}>
              <thead className="bg-black rounded-t-lg">
                <tr>
                  <th className="text-white text-left p-4 py-4">Username</th>
                  <th className="text-white text-left p-4 py-4">Status</th>
                  <th className="text-white text-center p-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white content-center">
                {currentUsers && currentUsers.length > 0 ?(
                  currentUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-slate-100">
                    <td className="font-normal p-4">{user.username}</td>
                    <td className="font-normal p-4">{user.status}</td>
                    <td className="font-normal p-4">
                      <div className="flex justify-center space-x-2">
                        <button className="text-black hover:text-gray-800">
                          <FaEye />
                        </button>
                        <button
                          className="text-black hover:text-gray-800"
                          onClick={() => {
                            navigate("/user-update", { state: { user } });
                          }}
                        >
                          <FaPencilAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))):(
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No Users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            {Array.from(
              { length: Math.ceil(users.length / usersPerPage)},
              (_,i) => (
                <button
                 key={i}
                 onClick={() => paginate(i+1)}
                 className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i+1
                  ? "bg-black text-white"
                  :"bg-white text-black border border-black"
                 }`}
                >
                  {i+1}
                </button>
              )
            )}
          </div>
        </div>
        {
          
        }
      </div>
    </>
  );
}

export default User;
