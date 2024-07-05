import { useState } from "react";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Define the schema for ContactInfo
const ContactInfoSchema = z.object({
  contactName: z.string().min(1, "*Contact name is required"),
  contactMobileNumber: z
    .number()
    .min(10, "*Contact mobile number must be 10 digits")
    .max(10, "*Contact mobile number must be 10 digits"),
  contactEmail: z.string().email("Invalid contact email"),
});

// Define the schema for OrganizationCreateData
const OrganizationCreateDataSchema = z.object({
  name: z.string().min(1, "*Name is required"),
  rocRegNo: z.string().min(1, "*ROC Reg Number is required"),
  gstNo: z.string().min(1, "*GST Number is required"),
  panNo: z.string().min(1, "*PAN Number is required"),
  industryType: z.string().min(1, "*Industry Type is required"),
  website: z.string().url("*Invalid URL").optional(),
  phoneNumber: z
    .string()
    .min(10, "*Phone Number must be 10 digits")
    .max(10, "*Phone Number must be 10 digits"),
  email: z.string().email("*Invalid email address"),
  contactInfo: z.array(ContactInfoSchema).optional(),
  orgType: z.string().min(1, "*Organization Type is required"),
});

const OrganizationCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    rocRegNo: "",
    gstNo: "",
    panNo: "",
    industryType: "",
    website: "",
    phoneNumber: "",
    email: "",
    contactInfo: [{ contactName: "", contactMobileNumber: "", contactEmail: "", designation: "" }],
    orgType: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validatedData = OrganizationCreateDataSchema.parse(formData);
      const accessToken = localStorage.getItem("token");

      const response = await axios.post(
        "http://157.245.110.240:8080/ProBuServices/org/createOrgImg",
        validatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data);
      navigate("/organizations");
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
  };

  return (
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
              ORGANIZATION-CREATE
            </p>
          </div>
          <form
            // onSubmit={handleSubmit}
            className="bg-neutral-200 rounded-lg p-5 mt-4"
          >
            <div className="flex justify-between">
              <div className="w-1/3">
                <label >Name</label> <br />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter org name"
                ></input>
                {errors.name && (
                  <p className="text-red-600 text-sm pl-1">{errors.name}</p>
                )}
              </div>
              <div className="w-1/3">
                <label >Roc Registration no</label> <br />
                <input
                  type="text"
                  name="rocRegNo"
                  value={formData.rocRegNo}
                  onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter Reg number"
                />
                {errors.rocRegNo && (
                  <p className="text-red-600 text-sm pl-1">{errors.rocRegNo}</p>
                )}
              </div>
              <div className="w-1/3">
                <label >GST No</label> <br />
                <input
                  type="text"
                  name="gstNo"
                  value={formData.gstNo}
                  onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter GST number"
                />
                {errors.gstNo && (
                  <p className="text-red-600 text-sm pl-1">{errors.gstNo}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-5">
              <div className="w-1/3">
                <label >PAN No</label> <br />
                <input
                  type="text"
                  name="panNo"
                  value={formData.panNo}
                  onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter PAN number"
                />
                {errors.panNo && (
                  <p className="text-red-600 text-sm pl-1">{errors.panNo}</p>
                )}
              </div>

              <div className="mt-6 w-1/3 ">
                {/* <label ></label> */}
                <select
                  name="industryType"
                  value={formData.industryType}
                  onChange={handleChange}
                  className="p-2 rounded-lg "
                >
                  <option value="" disabled>
                    Industry type
                  </option>
                  <option value="Construction">Construction</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Technology">Technology</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
                {errors.industryType && (
                  <p className="text-red-600 text-sm pl-8">
                    {errors.industryType}
                  </p>
                )}
              </div>


              <div className="w-1/3">
                <label >Website</label> <br />
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter website"
                />
                {errors.website && (
                  <p className="text-red-600 text-sm pl-1">{errors.website}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-5">
              <div>
                <label >Phone number</label> <br />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm pl-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label >Email</label> <br />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter email id"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm pl-1">{errors.email}</p>
                )}
              </div>

              <div className="mt-5">
                <select
                  name="orgType"
                  value={formData.orgType}
                  onChange={handleChange}
                  className="p-2 rounded-lg"
                >
                  <option value="" disabled>
                    Organization type
                  </option>
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Non-Profit">Non-Profit</option>
                </select>

                {errors.orgType && (
                  <p className="text-red-600">{errors.orgType}</p>
                )}
              </div>
            </div>

            <div>

            
              <div className="bg-gradient-to-r from-black to-neutral-400 p-2 rounded-lg mt-3 w-96">
                <p className="text-center text-xl text-white font-bold">
                  Contact Details
                </p>
              </div>

              <div className="flex justify-between">

              <div>
                <label >Contact Name</label> <br />
                <input
                  type="text"
                  name="contactname"
                  // value={formData.contactInfo[{contactName}]}
                  // onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter Contact name"
                />
                {/* {errors.email && (
                  <p className="text-red-600 text-sm pl-1">{errors.email}</p>
                )} */}
              </div>
              <div>
                <label >Contact mobile</label> <br />
                <input
                  type="text"
                  name="contactmobile"
                  // value={formData.contactInfo}
                  // onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter Contact mobile"
                />
                {/* {errors.email && (
                  <p className="text-red-600 text-sm pl-1">{errors.email}</p>
                )} */}
              </div>

              <div>
                <label >Contact Email</label> <br />
                <input
                  type="email"
                  name="contactemail"
                  // value={formData.contactInfo}
                  // onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter Contact email"
                />
                {/* {errors.email && (
                  <p className="text-red-600 text-sm pl-1">{errors.email}</p>
                )} */}
              </div>
              <div>
                <label >Designation</label> <br />
                <input
                  type="text"
                  name="designation"
                  // value={formData.contactInfo}
                  // onChange={handleChange}
                  className="p-2 rounded-lg"
                  placeholder="Enter Designation"
                />
                {/* {errors.email && (
                  <p className="text-red-600 text-sm pl-1">{errors.email}</p>
                )} */}
              </div>

              </div>


            </div>
            <div className="flex justify-evenly mt-3">
              <button
                className="bg-black hover:bg-white hover:text-black text-white w-36 h-8 rounded-lg"
                type="submit"
              >
                Save
              </button>
              <button
                className="bg-black hover:bg-white hover:text-black text-white w-36 h-8 rounded-lg"
                onClick={handleSubmit}
              >
                Cancel
              </button>
            </div>

            <div className="flex justify-between pt-5"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCreate;
