import { useContext, useEffect, useState } from 'react';
import { IoMdDownload } from "react-icons/io";
import { FaPlus, FaEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Mainnav from '../../components/Mainnav';
import Sidebar from '../../components/Sidebar';
import TaskContext from '../../context/tasks/TaskContext';

const Tasks = () => {
  const context = useContext(TaskContext);
  const { tasks, getTasks, setCurrentPage } = context;
  const navigate = useNavigate();
  const [currentPage, setLocalCurrentPage] = useState(1 );
  const [TasksPerPage] = useState(5);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getTasks(currentPage, totalPages);
    } else {
      navigate("/");
    }
  }, [currentPage, TasksPerPage, getTasks, navigate]);

  const indexOfLastTask = currentPage * TasksPerPage;
  const indexOfFirstTask = indexOfLastTask - TasksPerPage;
  const currentTasks = Array.isArray(tasks) ? tasks.slice(indexOfFirstTask, indexOfLastTask) : [];
  const totalPages = Math.ceil((Array.isArray(tasks) ? tasks.length : 0) / TasksPerPage);

  return (
    <div>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div className='flex justify-between'>
        <Sidebar />
        <div>
          <div className='flex justify-end p-10'>
            <input type="search" placeholder="search" className="border-b-2 border-black p-4" />
            <div className="flex justify-evenly items-start w-1/2 pt-4">
              <div className="flex bg-green-600 rounded-2xl p-2 justify-between">
                <IoMdDownload className="text-white h-6 w-6" />
                <button className="text-white font-semibold" onClick={() => navigate("/")}>
                  Export to excel
                </button>
              </div>
              <div className="flex justify-between bg-black rounded-2xl p-2">
                <FaPlus className="text-white h-5 w-5 mr-1 mt-1" />
                <button className="text-white font-semibold" onClick={() => navigate("/task-Create")}>
                  Create Task
                </button>
              </div>
            </div>
          </div>
          <table>
            <div className="pt-3 p-5">
              <table data-aos='fade-left' className="mr-2 table-auto border-2 border-black">
                <thead className="bg-black rounded-t-lg">
                  <tr>
                    <th className="text-white px-10">Task ID</th>
                    <th className="text-white w-20 px-4">Title</th>
                    <th className="text-white px-4">Status</th>
                    <th className="text-white px-4">Created Date</th>
                    <th className="text-white px-4">Project</th>
                    <th className="text-white px-4">Created By</th>
                    <th className="text-white px-4">Assigned By</th>
                    <th className="text-white px-4">Assigned To</th>
                    <th className="text-white px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="content-center bg-slate-100">
                  {currentTasks.map((task) => (
                    <tr key={task.id} className="p-5 hover:bg-slate-100">
                      <td className="text-center font-extralight p-2">{task.taskId}</td>
                      <td className="text-center font-extralight p-5">{task.title}</td>
                      <td className="text-center font-extralight">{task.status}</td>
                      <td className="text-center font-extralight p-5">
                        {new Date(task.createdDate).toLocaleDateString()}
                      </td>
                      <td className="text-center font-extralight p-5">{task.project}</td>
                      <td className="text-center font-extralight p-5">{task.createdBy}</td>
                      <td className="text-center font-extralight p-5">{task.assignedBy}</td>
                      <td className="text-center font-extralight p-5">{task.assignedTo}</td>
                      <td className="items-center">
                        <Link className="items-center" to={`/tasks/${task.taskId}`}><FaEye /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </table>
          <div className='mt-2 justify-center flex'>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => {
                  setCurrentPage(index);
                  setLocalCurrentPage(index);
                }}
                className={`px-3 py-1 mx-1 ${currentPage === index ? 'bg-black text-white' : 'bg-white text-black'} border border-black rounded-sm`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
