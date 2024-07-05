import { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";


//define the Create Task Schema
const TaskCreateDataSchema = z.object({
    Title: z.string().min(1, "*Title is required"),
  WorkEstimation: z.string().min(1, "*Work Estimation is required"),
  AssignedTo: z.string().min(1, "*Assigned To is required"),
  Description: z.string().min(1, "*Description is Optional").optional(),
  Project: z.string().min(1, "*Project is required"),
  Priority: z.string().min(1, "*Priority is required"),
  Note: z.string().min(1, "*Note is Optional").optional(),

})

const TaskCreate = () => {
    const [formData, setFormData] = useState({
      Title: "",
      WorkEstimation: "",
      AssignedTo: "",
      Description: "",
      Project: "",
      Priority: "",
      Note: "",
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const validatedData = TaskCreateDataSchema.parse(formData);
        const accessToken = localStorage.getItem("token");
  
        const response = await axios.post(
          `http://157.245.110.240:8080/ProBuServices/?${accessToken}`,
          validatedData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        console.log(response.data);
        navigate("/tasks");
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(
            error.errors.reduce((acc, curr) => {
              acc[curr.path[0]] = curr.message;
              return acc;
            }, {})
          );
        } else {
          console.error("Error creating organization:", error);
        }
      }
    }

return(
    <div>
         <div className="pb-10">
        <Mainnav />
      </div>
      <div className="flex justify-between">
      <div className="">
          <Sidebar />
    </div>
    <div className="mr-24 w-2/3 items-center">
    <div className="bg-gradient-to-r from-black to-neutral-400 p-4 rounded-lg mt-10 w-full">
            <p className="text-center text-white stroke-black text-2xl font-bold">
              TASK-CREATE
            </p>
          </div>
          <form  className="bg-neutral-200 rounded-lg p-5 mt-4">
          <div className="flex justify-between">
              <div className="w-1/3">
                <label className="" >Title</label> <br />
                <input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter Title"
                ></input>
                {errors.name && (
                  <p className="text-red-600 text-sm pl-1">{errors.name}</p>
                )}
              </div>

              <div className="w-1/3 ">
                <label >Work Estimation</label> <br />
                <input
                  type="text"
                  name="wrkEstimate"
                  value={formData.wrkEstimate}
                  onChange={handleChange}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter Work Estimation"
                />
                {errors.wrkEstimate && (
                  <p className="text-red-600 text-sm pl-1">{errors.wrkEstimate}</p>
                )}
              </div>
              <div className="w-1/3">
                <label >Assigned To</label> <br />
                <input
                  type="text"
                  name="assignTo"
                  value={formData.assignTo}
                  onChange={handleChange}
                  className="p-2 rounded-lg w-64"
                  placeholder="Assign the Task"
                />
                {errors.assignTo && (
                  <p className="text-red-600 text-sm pl-1">{errors.assignTo}</p>
                )}
              </div>
            </div>
            <div className=" w-full">
                <div className=" pt-5  ">
                <label className="flex justify-center" >Description</label> <br />
                <input
                  type="text"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter about the project details"
                />
                {errors.desc && (
                  <p className="text-red-600 text-sm pl-1">{errors.desc}</p>
                )}
                </div>
            </div>

            <div className="flex justify-between">
            <div className="mt-6 w-1/3 justify-center">
                <div>
                <label className="text-center" >Project</label> 
                </div>
                 
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="p-2 rounded-lg  w-64"
                >
                  <option value="">Select</option>
                  <option value="Probu">Probu</option>
                  <option value="Itmin">ITMIN</option>
                </select>
                {errors.project && (
                  <p className="text-red-600 text-sm pl-8">
                    {errors.project}
                  </p>
                )}
              </div>

              <div className="mt-6 w-1/3 justify-center ">
                <div>
                <label className="" >Priority</label> 
                </div>
                 
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="p-2 rounded-lg w-64"
                >
                  <option value="select" selected disabled>Select</option>
                  <option value="select">IT</option>
                </select>
                {errors.priority && (
                  <p className="text-red-600 text-sm pl-8">
                    {errors.priority}
                  </p>
                )}
              </div>
      
                <div className=" mt-6 w-1/3 ">
                <label className="" >Note</label> <br />
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="p-2 rounded-lg w-64"
                  placeholder=""
                />
                {errors.desc && (
                  <p className="text-red-600 text-sm pl-1">{errors.desc}</p>
                )}
                </div>
            </div>

 

            <div className="flex justify-evenly mt-3">
              <button
                className="bg-black hover:bg-white hover:text-black text-white w-36 h-8 rounded-lg"
                type="submit" onClick={handleSubmit}
              >
                Save
              </button>
              <button
                className="bg-black hover:bg-white hover:text-black text-white w-36 h-8 rounded-lg"
                onClick={() => navigate("/tasks")}
              >
                Cancel
              </button>
            </div>
          </form>
    </div>
      </div>
    </div>
)



}
export default TaskCreate