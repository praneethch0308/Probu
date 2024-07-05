import { useEffect, useState } from "react";
import TaskContext from "./TaskContext";
import axios from "axios";


const TaskState = (props) => {
  const host = "http://157.245.110.240:8080/ProBuServices";
  const TasksInitial = [];

  const [tasks, setTasks] = useState(TasksInitial);
  const [currentPage, setCurrentPage] = useState(0);
  const [TasksPerPage] = useState(0);

  const getTasks = async (page, size) => {
    try {
      const accessToken = localStorage.getItem("token");
      const orgId = localStorage.getItem("orgId");
      const page= currentPage;
      const size = TasksPerPage
      const response = await axios.get(
        `${host}/task/org/${orgId}/${page}/${size}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks data:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getTasks(currentPage, TasksPerPage);
    }
  }, [currentPage, TasksPerPage]); // Adding dependencies to useEffect

  return (
    <TaskContext.Provider value={{ tasks, getTasks, setCurrentPage }}>
      {props.children}
    </TaskContext.Provider>
  );
};

export default TaskState;
