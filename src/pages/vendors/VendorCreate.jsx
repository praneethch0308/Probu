import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CountryContext from "../../context/countries/CountryContext";
import { ContactInfo, Vendor } from "../../context/vendors/VendorState";
import ProjectContext from "../../context/projects/ProjectsContext"; // Import ProjectContext
import ProjectsTable from "../../components/projects/ProjectsTable";


// Validation schema
const vendorSchema = z.object({
  vendName: z.string().min(1, "*Vendor name is required"),
  CompanyName: z.string().min(1, "*Company name is required"),
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
  contacts: z.array(
    z.object({
      contactName: z.string().min(1, "*Contact name is required"),
      contactPhone: z.string().regex(/^[0-9]{10}$/, "*Phone number must be 10 digits"),
      contactEmail: z.string().email("*Invalid email address"),
      designation: z.string().min(1, "*Designation is required"),
      isPrimary: z.boolean().optional(), // Optional field for primary contact
    })
  ).min(1, "*At least one contact is required"),
});

const VendorCreate = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { countries, states, districts, getAllCountries, getAllStates, getAllDistricts } = useContext(CountryContext);
  const { projects, getAllProjects } = useContext(ProjectContext); 

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(vendorSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const clientImage = watch("clientImage");
  useEffect(() => {
    if (clientImage && clientImage.length > 0) {
      const file = clientImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [clientImage]);

  useEffect(() => {
    getAllCountries();
    getAllProjects(); 
  }, [getAllCountries, getAllProjects]);

  useEffect(() => {
    if (watch("country")) {
      getAllStates(watch("country"));
    }
  }, [watch("country")]);

  useEffect(() => {
    if (watch("country") && watch("state")) {
      getAllDistricts(watch("country"), watch("state"));
    }
  }, [watch("country"), watch("state")]);

  const onSubmit = async (data) => {
    const vendorData = {
      vendor: new Vendor(),
      contacts: [],
    };

    vendorData.vendor.id = "";
    vendorData.vendor.vendorName = data.vendName;
    vendorData.vendor.companyName = data.CompanyName;
    vendorData.vendor.vendorCode = "";
    vendorData.vendor.vendLogoUrl = "";
    vendorData.vendor.phone = data.phone;
    vendorData.vendor.email = data.email;
 vendorData.vendor.gstNo = data.gstNo;
    vendorData.vendor.panNo = data.panNo;
    vendorData.vendor.address = data.address;
    vendorData.vendor.city = data.city;
    vendorData.vendor.district = data.district;
    vendorData.vendor.state = data.state;
    vendorData.vendor.country = data.country;
    vendorData.vendor.pincode = data.pincode;
    vendorData.vendor.type = data.type;
    vendorData.vendor.status = true;

    vendorData.contacts = (data.contacts || []).map((contact) => {
      const contactInfo = new ContactInfo();
      contactInfo.contactName = contact.contactName;
      contactInfo.contactPhone = contact.contactPhone;
      contactInfo.contactEmail = contact.contactEmail;
      contactInfo.contactDesignation = contact.designation;
      contactInfo.isPrimary = contact.isPrimary;
      contactInfo.orgId = orgId;
      return contactInfo;
    });

    vendorData.projects = selectedProjects.map((project) => project.id);

    const formData = new FormData();
    formData.append("vendorData", JSON.stringify(vendorData));

    if (this.selectedFile) {
      formData.append("logo");
    } else {
      this.toastr.error("Please Upload Image");
    }

    console.log("vendData", vendorData);
    console.log("stringify", JSON.stringify(vendorData));
    console.log("logo", this.selectedFile);
  };

  const handleSelectProject = (project) => {
    if (selectedProjects.includes(project)) {
      setSelectedProjects(selectedProjects.filter((p) => p !== project));
    } else {
      setSelectedProjects([...selectedProjects, project]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <div className="pb-10">
        <Mainnav />
      </div>
      <div className="flex justify-between">
        <div className="">
          <Sidebar />
        </div>
        <div className="mr-10 mt-10 items-center w-3/4">
          <div className="text-center text-4xl w-full bg-gradient-to-r from-black to-neutral-400 py-4 rounded-md">
            <h1 className="text-white font-semibold">Vendor-Create</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4 mt-8 bg-neutral-300 p-5 rounded-md">
              <div className="flex justify-between m-1">
                <div className="w-1/3 pr-2">
                  <label className="text-black pl-1">Vendor Name</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("vendName")}
                  />
                  {errors.vendName && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.vendName.message}
                    </p>
                  )}
                </div>

                <div className="w-1/3 pr-2">
                  <label className="text-black pl-1">Company Name</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("CompanyName")}
                  />
                  {errors.CompanyName && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.CompanyName.message}
                    </p>
                  )}
                </div>

                <div className="w-1/3 pr-2">
                  <label className="text-black pl-1">Vendor GST No</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("gstNo")}
                  />
                  {errors.gstNo && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.gstNo.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between m-1">
                <div className="w-1/3 pr-2">
                  <label className="text-black pl-1">Vendor PAN No</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("panNo")}
                  />
                  {errors.panNo && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.panNo.message}
                    </p>
                  )}
                </div>

                <div className="w-1/3 pr-2">
                  <label className="text-black pl-1">Phone</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="w-1/3 pr-2">
                  <label className ="text-black pl-1">Email</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between m-1">
                <div className="w-full">
                  <label className="text-black pl-1">Address</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between m-1">
                <div className="w-1/4 pr-2">
                  <label className="block text-gray-700">Country</label>
                  <select
                    {...register("country")}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.country}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-600 text-sm">{errors.country.message}</p>
                  )}
                </div>

                <div className="w-1/4 pr-2">
                  <label className="block text-gray-700">State</label>
                  <select
                    {...register("state")}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.state}>
                        {state.state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-600 text-sm">{errors.state.message}</p>
                  )}
                </div>

                <div className="w-1/4 pr-2">
                  <label className="block text-gray-700">District</label>
                  <select
                    {...register("district")}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.district}>
                        {district.district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-600 text-sm">{errors.district.message}</p>
                  )}
                </div>

                <div className="w-1/4">
                  <label className="text-black pl-1">City</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex m-1">
                <div className="w-1/4">
                  <label className="text-black pl-1">Pincode</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("pincode")}
                  />
                  {errors.pincode && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-neutral-400 p-3 rounded-md">
                <h2 className="text-lg font-semibold text-black">Contact Information</h2>
                {fields.map((field, index) => (
                  <div key={field.id} className="mb-4 p-4 rounded-md bg-neutral-200">
                    <div className="flex justify-between mb-2">
                      <div className="w-1/4 pr-2">
                        <label className="text-black">Name</label>
                        <input
                          className="w-full p-2 rounded-md"
                          {...register(`contacts.${index}.contactName`)}
                        />
                        {errors.contacts?.[index]?.contactName && (
                          <p className="text-red-600 text-sm">
                            {errors.contacts[index].contactName?.message}
                          </p>
                        )}
                      </div>

                      <div className="w-1/4 pr-2">
                        <label className="text-black">Phone</label>
                        <input
                          className="w-full p-2 rounded-md"
                          {...register(`contacts.${index}.contactPhone`)}
                        />
                        {errors.contacts?.[index]?.contactPhone && (
                          < p className="text-red-600 text-sm">
                            {errors.contacts[index].contactPhone?.message}
                          </p>
                        )}
                      </div>

                      <div className="w-1/4 pr-2">
                        <label className="text-black">Email</label>
                        <input
                          className="w-full p-2 rounded-md"
                          {...register(`contacts.${index}.contactEmail`)}
                        />
                        {errors.contacts?.[index]?.contactEmail && (
                          <p className="text-red-600 text-sm">
                            {errors.contacts[index].contactEmail?.message}
                          </p>
                        )}
                      </div>

                      <div className="w-1/4">
                        <label className="text-black">Designation</label>
                        <input
                          className="w-full p-2 rounded-md"
                          {...register(`contacts.${index}.designation`)}
                        />
                        {errors.contacts?.[index]?.designation && (
                          <p className="text-red-600 text-sm">
                            {errors.contacts[index].designation?.message}
                          </p>
                        )}
                      </div>

                      <div className="w-30">
                        <label className="text-black">Is Primary Contact</label>
                        <input
                          className="w-full p-2 rounded-md"
                          type="checkbox"
                          {...register(`contacts.${index}.isPrimary`)}
                        />
                        {errors.contacts?.[index]?.isPrimary && (
                          <p className="text-red-600 text-sm">
                            {errors.contacts[index].isPrimary?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-red-600 text-white p-2 rounded-md"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    append({
                      contactName: "",
                      contactPhone: "",
                      contactEmail: "",
                      designation: "",
                    })
                  }
                  className="bg-blue-600 text-white p-2 rounded-md"
                >
                  Add Contact
                </button>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-black text-white p-3 rounded-md"
                >
                  Assign Project +
                </button>
              </div>

              {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50">
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full p-4 bg-white rounded-md">
                    <ProjectsTable
                      projects={projects}
                      onSelectProject={handleSelectProject}
                      selectedProjects={selectedProjects}
                    />
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="bg-red-600 text-white p-2 rounded-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center">
                <label className="text-black pl-1">Client Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("clientImage")}
                  className="p-3 rounded-md"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-black text-white p-3 rounded-md"
                >
                  Create Vendor
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorCreate;