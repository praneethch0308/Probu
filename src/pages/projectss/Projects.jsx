import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectContext from "../../context/projects/ProjectsContext";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaEye, FaPencilAlt, FaRegPlusSquare } from "react-icons/fa";
import Aos from 'aos';
import 'aos/dist/aos.css';

const Projects = () => {
  const context = useContext(ProjectContext);
  const { projects, getAllProjects } = context;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getAllProjects();
    } else {
      navigate("/projects");
    }
  }, [getAllProjects, navigate]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  return (
    <div>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div className="flex justify-between">
        <Sidebar />
        <div className="ml-20"> {/* Added margin-left to move the content to the right */}
          <div className="flex justify-end pt-14 pb-2">
            <div className="flex space-x-4 items-center mr-20">
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
              <button className="flex items-center bg-black text-white rounded-2xl p-3 font-semibold hover:bg-neutral-600" onClick={() => navigate('/project-create')}>
                <FaRegPlusSquare className="h-6 w-6 mr-2" />
                Create Project
              </button>
            </div>
          </div>
          <div className="pt-10 p-5 flex justify-center ml-36">
            <table className="w-2/3 table-auto shadow-md">
              <thead className="bg-black rounded-t-lg">
                <tr>
                  <th className="text-white px-5">Project Name</th>
                  <th className="text-white px-5">Project Code</th>
                  <th className="text-white px-5">Description</th>
                  <th className="text-white px-5">Status</th>
                  <th className="text-white px-5">Start Date</th>
                  <th className="text-white px-5">End Date</th>
                  <th className="text-white px-5">Manager</th>
                  <th className="text-white px-5">Action</th>
                </tr>
              </thead>
              <tbody className="bg-slate-50 content-center">
                {currentProjects.map((project) => (
                  <tr key={project.id} className="p-5 border-b">
                    <td className="text-center font-normal p-4">{project.projectName}</td>
                    <td className="text-center font-normal p-2">{project.projectCode}</td>
                    <td className="text-center font-normal p-2">{project.projectDescription}</td>
                    <td className="text-center font-normal p-2">{project.status}</td>
                    <td className="text-center font-normal p-2">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="text-center font-normal">
                      {new Date(project.endDate).toLocaleDateString()}
                    </td>
                    <td className="text-center font-normal p-2">{project.projectManager}</td>
                    <td className="text-center items-center">
                      <button className="text-black hover:text-gray-800 p-2">
                        <FaEye />
                      </button>
                      <button className="text-black hover:text-gray-800 p-2">
                        <FaPencilAlt onClick={() => { navigate('/project-update') }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            <div className='mt-9 flex justify-center'>
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
  );
};

export default Projects;