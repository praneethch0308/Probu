import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authentication/AuthContext";
import { MdOutlineFileDownload, MdCancel } from "react-icons/md";
import { FaEye, FaPencilAlt, FaRegPlusSquare } from "react-icons/fa";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import TeamContext from "../../context/teams/TeamsContext";
import { useSidebar } from "../../context/sidebar/SidebarContext";

const Teams = () => {
  const context = useContext(TeamContext);
  const { teams = [], getAllTeams } = context;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { isOpened } = useSidebar();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAllTeams();
    } else {
      navigate("/");
    }
  }, []);

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = Array.isArray(teams)
    ? teams.slice(indexOfFirstTeam, indexOfLastTeam)
    : [];
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Array.isArray(teams)
    ? Math.ceil(teams.length / teamsPerPage)
    : 0;

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    setSelectedTeam(null);
  };

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    onOpenModal();
  };
  const handleEditTeam = (team) => {
    navigate(`/team-update`, { state: { team } });
  };
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
                className="p-3 rounded-2xl border-2 border-black"
              />
              <button
                className="flex items-center bg-green-600 rounded-2xl p-3 text-white font-semibold hover:bg-green-700 transition duration-300"
                onClick={() => navigate("/")}
              >
                <MdOutlineFileDownload className="h-6 w-6 mr-2" />
                Export to Excel
              </button>
              <button
                className="flex items-center bg-black text-white rounded-2xl p-3 font-semibold hover:bg-neutral-600"
                onClick={() => navigate("/team-create")}
              >
                <FaRegPlusSquare className="h-6 w-6 mr-2" />
                Create Team
              </button>
            </div>
          </div>
          <div className="pt-10">
            <table className="w-full shadow-md">
              <thead className="bg-black rounded-t-lg">
                <tr>
                  <th className={`text-white py-4`}>Team Name</th>
                  <th className={`text-white py-4`}>Status</th>
                  <th className={`text-white py-4`}>Project Names</th>
                  <th className={`text-white py-4`}>Team Leads</th>
                  <th className={`text-white py-4`}>Project Manager</th>
                  <th className={`text-white py-4`}>Action</th>
                </tr>
              </thead>
              <tbody className="bg-white content-center">
                {currentTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="p-5 border-b hover:bg-slate-100 cursor-pointer"
                    onDoubleClick={() => handleViewTeam(team)}
                  >
                    <td className={`text-center font-normal`}>
                      {team.teamName}
                    </td>
                    <td className={`text-center font-normal`}>
                      {team.status}
                    </td>
                    <td className={`text-center font-normal`}>
                      {team.projectNames}
                    </td>
                    <td className={`text-center font-normal`}>
                      {team.teamLead}
                    </td>
                    <td className={`text-center font-normal`}>
                      {team.projectManager}
                    </td>
                    <td className="text-center items-center p-4">
                      <button
                        onClick={() => handleViewTeam(team)}
                        className="text-black hover:text-gray-800 p-2"
                      >
                        <FaEye />
                      </button>
                      <button className="text-black hover:text-gray-800 p-2">
                        <FaPencilAlt
                          onClick={() => {
                            handleEditTeam(team);
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-9 flex justify-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 mx-1 ${
                    currentPage === index + 1
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } border border-black rounded-sm`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {open && selectedTeam && (
        <div
          onClick={onCloseModal}
          className={`fixed inset-0 ml-28 mt-5 flex justify-center items-center transition-colors ${
            open ? "visible bg-black/20" : "invisible"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white w-2/3 rounded-xl shadow-sm shadow-black p-6 transition-all ${
              open ? "scale-100 opacity-100" : "scale-125 opacity-0"
            }`}
          >
            <div className="flex items-center">
              <div className="w-full">
                <h1 className="text-center text-2xl font-bold">{selectedTeam.teamName}</h1>
                <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Status:</div>
                  <div className="pl-4">{selectedTeam.status}</div>
                </div>
                <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Team Name:</div>
                  <div className="pl-4">{selectedTeam.teamName}</div>
                </div>
                <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Created Date:</div>
                  <div className="pl-4">{selectedTeam.createdDate}</div>
                </div>
                <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Project Manager:</div>
                  <div className="pl-4">{selectedTeam.projectManager}</div>
                </div>
                <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Team Leads:</div>
                  <div className="pl-4">{selectedTeam.teamLead}</div>
                </div>
                <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Team Size:</div>
                  <div className="pl-4">{selectedTeam.size}</div>
                </div>
                <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Project:</div>
                  <div className="pl-4">{selectedTeam.projectNames}</div>
                </div>
              </div>
            </div>
            <button
              onClick={onCloseModal}
              className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
            >
              <MdCancel />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Teams;
