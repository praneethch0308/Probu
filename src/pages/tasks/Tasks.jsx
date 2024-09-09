import React, { useContext, useEffect, useState } from 'react';
import { IoMdDownload } from "react-icons/io";
import { FaPlus, FaEye, FaPencilAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Mainnav from '../../components/Mainnav';
import Sidebar from '../../components/Sidebar';
import TaskContext from '../../context/tasks/TaskContext';
import { useSidebar } from '../../context/sidebar/SidebarContext';
import Aos from "aos";
import "aos/dist/aos.css";
import { MdCancel } from "react-icons/md";

const Tasks = () => {
  const navigate = useNavigate();
  const { isOpened } = useSidebar();
  const context = useContext(TaskContext);
  const { tasks, getAllTasks } = context;

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    Aos.init({ duration: 1000 });
    getAllTasks(0, 10);
  }, [getAllTasks]);

  const indexOfLastTasks = currentPage * tasksPerPage;
  const indexOfFirstTasks = indexOfLastTasks - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTasks, indexOfLastTasks);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const onOpenModal = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  const handleEditTask = (task) => {
    navigate(`/task-update`, { state: {task} });
  };

  return (
    <div>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div>
        <Sidebar />
        <div className={`content-transition ${isOpened ? "sidebar-opened mr-5" : "sidebar-closed mr-5"}`}>
          <div className="flex justify-end pt-14 pb-2">
            <div className="flex space-x-4 items-center mr-2">
              <input type="search" placeholder="search" className="p-3 rounded-2xl border-2 border-black" />
              <div className="flex justify-evenly items-start w-1/2 pt-4">
                <div className="flex justify-between bg-black rounded-2xl p-2">
                  <FaPlus className="text-white h-5 w-5 mr-1 mt-1" />
                  <button className="text-white font-semibold" onClick={() => navigate("/task-create")}>
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-10">
            <table id='tasks' data-aos='fade-left' className="w-full shadow-md cursor-pointer">
              <thead className="bg-black rounded-t-lg">
                <tr>
                  <th className="text-white px-4 py-4">Task ID</th>
                  <th className="text-white px-4 py-4">Title</th>
                  <th className="text-white px-4 py-4">Status</th>
                  <th className="text-white px-4 py-4">Created Date</th>
                  <th className="text-white px-4 py-4">Project</th>
                  <th className="text-white px-4 py-4">Created By</th>
                  <th className="text-white px-4 py-4">Assigned By</th>
                  <th className="text-white px-4 py-4">Assigned To</th>
                  <th className="text-white px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="content-center bg-white border-b">
                {currentTasks.map((task) => (
                  <tr key={task.id} className="p-5 hover:bg-slate-100">
                    <td className="text-center font-normal p-2">{task.taskId}</td>
                    <td className="text-center font-normal p-3">{task.title}</td>
                    <td className="text-center font-normal">{task.status}</td>
                    <td className="text-center font-normal p-3">
                      {new Date(task.createdDate).toLocaleDateString()}
                    </td>
                    <td className="text-center font-normal p-3">{task.project}</td>
                    <td className="text-center font-normal p-3">{task.createdBy}</td>
                    <td className="text-center font-normal p-3">{task.assignedBy}</td>
                    <td className="text-center font-normal p-3">{task.assignedTo}</td>
                    <td className="items-center">
                      <button className="text-black hover:text-gray-800 p-2" onClick={() => onOpenModal(task)}>
                        <FaEye />
                      </button>
                      <button className="text-black hover:text-gray-800 p-2">
                        <FaPencilAlt
                          onClick={() => {
                            handleEditTask(task);
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(tasks.length / tasksPerPage)}, (_,i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {open && selectedTask && (
          <div
            onClick={onCloseModal}
            className={`fixed inset-0 flex justify-center items-center transition-colors ${
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
                  {/* <h1 className="text-xl font-semibold">{selectedTask.title}</h1> */}
                  <div className="mt-4">

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Status</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedTask.status}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Title</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedTask.title}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Project</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedTask.project}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Description</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedTask.description}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Priority</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedTask.priority}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Created By</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedTask.createdBy}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Created Date</div>
                      <div className="">:</div>
                      <div className="pl-4">{new Date(selectedTask.createdDate).toLocaleDateString()}</div>
                    </div>


                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Assigned By</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedTask.assignedBy}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Assigned To</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedTask.assignedTo}</div>
                    </div>
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
      </div>
    </div>
  );
}

export default Tasks;