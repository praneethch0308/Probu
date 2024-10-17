import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const vendorSchema = z.object({
  vendName: z.string().min(1, "*Vendor name is required"),
  vendorCode: z.string().optional(),
  gstNo: z.string().min(1, "*GST number is required"),
  panNo: z.string().min(1, "*PAN number is required"),
  address: z.string().min(1, "*Address is required"),
  city: z.string().min(1, "*City is required"),
  district: z.string().min(1, "*District is required"),
  state: z.string().min(1, "*State is required"),
  country: z.string().min(1, "*Country is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "*Pincode must be 6 digits"),
  type: z.string().min(1, "*Type is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "*Phone number must be 10 digits"),
  email: z.string().email("*Invalid email address"),
  vendImage: z.string().optional(),
  projects: z.string(z.string()).min(1, "*At least one project is required"),
  contacts: z.array(
    z.object({
      contactName: z.string().min(1, "*Contact name is required"),
      contactPhone: z.string().regex(/^[0-9]{10}$/, "*Phone number must be 10 digits"),
      contactEmail: z.string().email("*Invalid email address"),
      designation: z.string().min(1, "*Designation is required"),
    })
  ).min(1, "*At least one contact is required"),
});

const VendorCreate = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      contacts: [{ contactName: "", contactPhone: "", contactEmail: "", designation: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const host = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("token");
  const username = localStorage.getItem("loggedUser");
  const orgId = localStorage.getItem("orgId");

  const stateOptions = {
    India: ["Telangana", "Maharashtra", "Karnataka", "Tamil Nadu", "Kerala"],
  };

  const districtOptions = {
    Telangana: ["Hyderabad", "Rangareddy", "Warangal", "Nizamabad"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    try {
      const vendorData = {
        vendor: {
          vendorName: data.vendName,
          vendorCode: data.vendorCode || "",
          vendLogoUrl:  "",
          gstNo: data.gstNo,
          panNo: data.panNo,
          address: data.address,
          city: data.city,
          district: data.district,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          type: data.type,
          status: true,
          projectObjId: data.projects,
          orgId: orgId,
        },
        contacts: data.contacts,
        userName: username,
        orgId: orgId,
        projects: data.projects.map((id) => ({
          id,
        })),
      };

      const formData = new FormData();
      formData.append("vendorData", JSON.stringify(vendorData));
      if (selectedImage) {
        formData.append("logo", selectedImage);
      }

      const response = await axios.post(
        `${host}/vendor/create?access_token=${accessToken}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      navigate("/vendors");
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
      } else {
        console.error("Error creating vendor:", error);
      }
    }
  };

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  return (
    <div>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div className="flex justify-between">
        <Sidebar />
        <div className="mr-24 w-2/3">
          <div className="bg-gradient-to-r from-neutral-700 to-neutral-400 p-4 rounded-lg mt-10 w-full">
            <p className="text-center text-white text-2xl font-bold">
              VENDOR-CREATE
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-neutral-200 rounded-lg p-5 mt-4"
          >
            <div className="flex flex-wrap gap-4">
              <div className="w-full">
                <label>Vendor Name</label>
                <input
                  type="text"
                  {...register("vendName")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter Vendor Name"
                />
                {errors.vendName && <p className="text-red-600">{errors.vendName.message}</p>}
              </div>

              <div className="w-full">
                <label>GST No</label>
                <input
                  type="text"
                  {...register("gstNo")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter GST No"
                />
                {errors.gstNo && <p className="text-red-600">{errors.gstNo.message}</p>}
              </div>

              <div className="w-full">
                <label>PAN No</label>
                <input
                  type="text"
                  {...register("panNo")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter PAN No"
                />
                {errors.panNo && <p className="text-red-600">{errors.panNo.message}</p>}
              </div>

              <div className="w-full">
                <label>Address</label>
                <input
                  type="text"
                  {...register("address")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter Address"
                />
                {errors.address && <p className="text-red-600">{errors.address.message}</p>}
              </div>

              <div className="w-full">
                <label>City</label>
                <input
                  type="text"
                  {...register("city")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter City"
                />
                {errors.city && <p className="text-red-600">{errors.city.message}</p>}
              </div>

              <div className="w-full">
                <label>State</label>
                <select {...register("state")} className="p-2 rounded-lg w-full">
                  {stateOptions[selectedCountry]?.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-600">{errors.state.message}</p>}
              </div>

              <div className="w-full">
                <label>District</label>
                <select {...register("district")} className="p-2 rounded-lg w-full">
                  {districtOptions[selectedState]?.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-red-600">{errors.district.message}</p>}
              </div>

              <div className="w-full">
                <label>Pincode</label>
                <input
                  type="text"
                  {...register("pincode")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter Pincode"
                />
                {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
              </div>

              <div className="w-full">
                <label>Country</label>
                <input
                  type="text"
                  {...register("country")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter Country"
                />
                {errors.country && <p className="text-red-600">{errors.country.message}</p>}
              </div>

              <div className="w-full">
                <label>Type</label>
                <input
                  type="text"
                  {...register("type")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter Type"
                />
                {errors.type && <p className="text-red-600">{errors.type.message}</p>}
              </div>

              <div className="w-full">
                <label>Phone</label>
                <input
                  type="text"
                  {...register("phone")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter Phone Number"
                />
                {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
              </div>

              <div className="w-full">
                <label>Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter Email"
                />
                {errors.email && <p className="text-red-600">{errors.email.message}</p>}
              </div>

              <div className="w-full">
                <label>Logo</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="p-2 rounded-lg w-full"
                />
              </div>

              <div className="w-full">
                <label>Projects</label>
                <input
                  type="text"
                  {...register("projects")}
                  className="p-2 rounded-lg w-full"
                  placeholder="Enter Project IDs (comma separated)"
                />
                {errors.projects && <p className="text-red-600">{errors.projects.message}</p>}
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="mt-6">
              <h2 className="text-lg font-bold">Contact Details</h2>
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-wrap gap-4 mb-4">
                  <div className="w-full">
                    <label>Contact Name</label>
                    <input
                      type="text"
                      {...register(`contacts.${index}.contactName`)}
                      className="p-2 rounded-lg w-full"
                      placeholder="Enter Contact Name"
                    />
                    {errors.contacts?.[index]?.contactName && (
                      <p className="text-red-600">{errors.contacts[index].contactName.message}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <label>Contact Phone</label>
                    <input
                      type="text"
                      {...register(`contacts.${index}.contactPhone`)}
                      className="p-2 rounded-lg w-full"
                      placeholder="Enter Contact Phone"
                    />
                    {errors.contacts?.[index]?.contactPhone && (
                      <p className="text-red-600">{errors.contacts[index].contactPhone.message}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      {...register(`contacts.${index}.contactEmail`)}
                      className="p-2 rounded-lg w-full"
                      placeholder="Enter Contact Email"
                    />
                    {errors.contacts?.[index]?.contactEmail && (
                      <p className="text-red-600">{errors.contacts[index].contactEmail.message}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <label>Designation</label>
                    <input
                      type="text"
                      {...register(`contacts.${index}.designation`)}
                      className="p-2 rounded-lg w-full"
                      placeholder="Enter Designation"
                    />
                    {errors.contacts?.[index]?.designation && (
                      <p className="text-red-600">{errors.contacts[index].designation.message}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
                  >
                    Remove Contact
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ contactName: "", contactPhone: "", contactEmail: "", designation: "" })}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Add Contact
              </button>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorCreate;
