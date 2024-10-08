import { useEffect, useState } from "react";
import TaskContext from "./TaskContext";
import axios from "axios";
import { CustListItem } from "../projects/ProjectState";

export class Task {
  id = '';
  taskId = '';
  title = '';
  description = '';
  status = '';
  createdDate=Date;
  estimatedWorkTime = 0;
  completedWork = 0;
  remainingWork = 0;
  createdBy = '';
  assignedBy = '';
  assignedTo = '';
  project = '';
  priority = '';
  completedDate= Date;
  assignedEmpObjId = '';
  createdEmpObjId = '';
  assignedByEmpObjId = '';
  projectObjId = '';
  mgrObjId = '';
  orgId = '';
}
export class TaskData {
  constructor() {
    this.task = new Task;
    this.statuses = [];
    this.notes =[new Note()];
    this.attachments = [];
    this.actionTime = new Date();
    this.userName = '';
    this.orgId = '';
  }
}



export class Attachment {
  constructor() {
    this.id = '';
    this.name = '';
    this.url = '';
    this.workObjId = '';
    this.taskObjId = '';
    this.projectObjId = '';
    this.expensesObjId = '';
  }
}

export class Note {
  constructor() {
    this.id = '';
    this.comments = '';
    this.loggedTime = new Date();
    this.loggedBy = '';
    this.projectObjId = '';
    this.taskObjId = '';
    this.empObjId = '';
    this.resourceObjId = '';
    this.clientObjId = '';
    this.vendorObjId = '';
    this.orgId = '';
  }
}

// Usage:


const TaskState = (props) => {
  const host = process.env.REACT_API_URL;
  const TasksInitial = [];

  const [tasks, setTasks] = useState(TasksInitial);
  const [currentPage, setCurrentPage] = useState(0);
  const [TasksPerPage] = useState(0);
  const [taskInitData,setTaskInitData]=useState(new CustListItem([]));
  const accessToken = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  const getAllTasks = async (pageIndex, pageSize) => {
    try {
 
      const response = await axios.get(
        `${host}/task/org/${orgId}/${pageIndex}/${pageSize}?access_token=${accessToken}`
      );
      setTasks(response.data.Task);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getTaskInitData= async()=>{
    try{
      const response = await axios.get(`${host}/task/init/${orgId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
        setTaskInitData(response.data);
      console.log(response.data);
    } catch(error){
console.error(error);
    }
  }

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     getALLTasks(currentPage, TasksPerPage);
  //   }
  // }, [currentPage, TasksPerPage]); // Adding dependencies to useEffect

  return (
    <TaskContext.Provider value={{ tasks, getAllTasks, setCurrentPage,getTaskInitData,taskInitData }}>
      {props.children}
    </TaskContext.Provider>
  );
};

export default TaskState;
