import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authentication/AuthContext";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaEye, FaRegPlusSquare } from "react-icons/fa";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import TeamContext from "../../context/teams/TeamsContext";
import Aos from 'aos';
import 'aos/dist/aos.css';

const Teams = () => {
  const context = useContext(TeamContext);
  const { teams = [], getAllTeams } = context; // Initialize teams as an empty array
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(5);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getAllTeams();
    } else {
      navigate("/");
    }
  }, [getAllTeams, navigate]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = Array.isArray(teams) ? teams.slice(indexOfFirstTeam, indexOfLastTeam) : [];
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Array.isArray(teams) ? Math.ceil(teams.length / teamsPerPage) : 0;

  return (
    <div>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div className="flex justify-between">
        <Sidebar />
        <div className="ml-40 mr-40 w-[1000px]"> {/* Adjusted width to ensure full coverage */}
          <div className="flex justify-end pt-14 pb-2 ">
            <div className="flex space-x-4 items-center mr-10">
              <input
                type="text"
                placeholder="Search..."
                className="p-3 rounded-2xl border-2 border-black"
              />
              <button
                className="flex items-center bg-green-600 rounded-2xl p-3 text-white font-semibold hover:bg-green-700 transition duration-300"
                onClick={() => navigate('/')}>
                <MdOutlineFileDownload className='h-6 w-6 mr-2' />
                Export to Excel
              </button>
              <button className="flex items-center bg-black text-white rounded-2xl p-3 font-semibold hover:bg-neutral-600" onClick={() => navigate('/team-create')}>
                <FaRegPlusSquare className="h-6 w-6 mr-2" />
                Create Team
              </button>
            </div>
          </div>
          <div className="pt-10 p-5 flex flex-col items-center"> {/* Changed to column layout for better centering */}
            <table className="w-3/4 table-auto shadow-md"> {/* Adjusted width to 3/4 */}
              <thead className="bg-black rounded-t-lg">
                <tr>
                  <th className="text-white px-5">Team Name</th>
                  <th className="text-white px-5">Status</th>
                  <th className="text-white px-5">Project Names</th>
                  <th className="text-white px-5">Team Leads</th>
                  <th className="text-white px-5">Project Manager</th>
                  <th className="text-white px-5">Action</th>
                </tr>
              </thead>
              <tbody className="bg-slate-50 content-center">
                {currentTeams.map((team) => (
                  <tr key={team.id} className="p-5 border-b">
                    <td className="text-center font-normal p-2">{team.teamName}</td>
                    <td className="text-center font-normal p-2">{team.status}</td>
                    <td className="text-center font-normal p-2">{team.projectNames}</td>
                    <td className="text-center font-normal p-2">{team.teamLead}</td>
                    <td className="text-center font-normal p-2">{team.projectManager}</td>
                    <td className="text-center items-center">
                      <Link className="items-center" to={`/organizations/${team.id}`}><FaEye className="items-center ml-8" /></Link>
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
                  className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-white text-black'} border border-black rounded-sm`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
