import React, { useContext, useEffect, useState } from "react";
import ProjectContext from "../../context/projects/ProjectsContext";
import { FaEye, FaPencilAlt } from "react-icons/fa";

const ProjectsTable = ({ onSelectProjects, selectedProjects }) => {
  const context = useContext(ProjectContext);
  const { projects,getAllProjects } = context;
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAllProjects();
    } else {
      navigate("/projects");
    }
  }, []);


  const handleSelectProject = (project) => {
    if (selectedProjects.includes(project)) {
      onSelectProjects(selectedProjects.filter((p) => p !== project));
    } else {
      onSelectProjects([...selectedProjects, project]);
    }
  };
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;

  const filteredProjects = Array.isArray(projects)
  ? projects.filter((project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);


  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        className="p-2 border rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
                <div className="pt-10">
            <table id="projects" className={`w-full shadow-md cursor-pointer`}>
              <thead className="bg-black rounded-t-lg">
                <tr>
                  <th className="text-white px-4 py-4">Project Name</th>
                  <th className="text-white px-4 py-4">Project Code</th>
                  <th className="text-white px-4 py-4">Description</th>
                  <th className="text-white px-4 py-4">Status</th>
                  <th className="text-white px-4 py-4">Start Date</th>
                  <th className="text-white px-4 py-4">End Date</th>
                  <th className="text-white px-4 py-4">Manager</th>
                  <th className="text-white px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white content-center">
                {currentProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="p-5 border-b hover:bg-slate-100"
                    onDoubleClick={() => {
                      navigate("/project-task", { state: { project } });
                    }}
                  >
                    <td className="text-center font-normal p-4">
                      {project.projectName}
                    </td>
                    <td className="text-center font-normal p-2">
                      {project.projectCode}
                    </td>
                    <td className="text-center font-normal p-2">
                      {project.projectDescription}
                    </td>
                    <td className="text-center font-normal p-2">
                      {project.status}
                    </td>
                    <td className="text-center font-normal p-2">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="text-center font-normal">
                      {new Date(project.endDate).toLocaleDateString()}
                    </td>
                    <td className="text-center font-normal p-2">
                      {project.projectManager}
                    </td>
                    <td className="text-center items-center">
                      <button className="text-black hover:text-gray-800 p-2">
                        <FaEye
                          onClick={() => {
                            navigate("/project-task", { state: { project } });
                          }}
                        />
                      </button>
                      <button className="text-black hover:text-gray-800 p-2">
                        <FaPencilAlt
                          onClick={() => {
                            handleEditProject(project);
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
  );
};

export default ProjectsTable;
