import axios from "axios";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { any, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ContactInfo } from "../../context/clients/ClientState";
import { formatDate } from "date-fns";

const ContactSchema = z.object({
  contactName: z.string().min(1, "Contact name is required"),
  contactPh: z.string().min(10, "Enter a valid mobile no"),
  contactEmail: z.string().email("Enter a valid Email"),
  contactDesignation: z.string().min(1, "Enter a valid designation"),
  isPrimary: z.boolean().optional(), 
});


const ClientSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientGstNo: z.string().min(15, "Enter valid GST No"),
  clientPanNo: z.string().min(10, "Enter a valid PAN No"),
  clientPh: z.string().min(10, "Enter a valid Mobile No"),
  clientAlt: z.string().min(10, "Enter a valid Mobile No"),
  clientEmail: z.string().email("Enter a valid Email"),
  clientAltEmail: z.string().email("Enter a valid email"),
  clientWebsite: z.string().url("Enter a valid url").optional(),
  clientAddress: z.string().min(5, "Enter address"),
  clientCountry: z.string(),
  clientState: z.string(),
  clientDistrict: z.string(),
  clientCity: z.string(),
  clientPincode: z.string().min(6, "Enter a valid pincode"),
  contactInfo: z.array(ContactSchema).optional(),
  clientImage: z.instanceof(FileList).nullable(), // For handling file uploads
});

function ClientCreate() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(ClientSchema)
    
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contactInfo",
  });

  // Watch for file input change to handle image preview
  const clientImage = watch("clientImage");
  if (clientImage && clientImage.length > 0) {
    const file = clientImage[0];
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  const orgId = localStorage.getItem('orgId');
  const username = localStorage.getItem('loggedUser');

  const onSubmit = async (data) => {
    try {
      const accessToken = localStorage.getItem("token");
        const clientCreateData= {};
        clientCreateData.clientName = data.clientName;
        clientCreateData.clientGstNo =  data.clientGstNo;
        clientCreateData.clientPANNo = data.clientPanNo;
        clientCreateData.status = "New";
        clientCreateData.address = data.clientAddress;
        clientCreateData.city = data.clientCity;
        clientCreateData.district = data.clientDistrict;
        clientCreateData.state = data.clientState;
        clientCreateData.country = data.clientCountry;
        clientCreateData.pincode = data.clientPincode;
        clientCreateData.phoneNumber = data.clientPh
        clientCreateData.altPhoneNumber = data.clientAlt;
        clientCreateData.email = data.clientEmail;
        clientCreateData.altEmail = data.clientAltEmail;
        clientCreateData.website =  data.clientWebsite;
        clientCreateData.registrationDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        clientCreateData.orgId = orgId;

        const contactInfos = (data.contactInfo || []).map(contact => {
          const contactInfo = new ContactInfo();
          contactInfo.contactName = contact.contactName;
          contactInfo.contactPhone = contact.contactPh;
          contactInfo.contactEmail = contact.contactEmail;
          contactInfo.contactDesignation = contact.contactDesignation;
          contactInfo.isPrimary = contact.isPrimary;
          contactInfo.orgId = orgId;
          return contactInfo;
        });
    
     
       
        clientCreateData.contactInfos = contactInfos;
        clientCreateData.userName = username;
    
        const formData = new FormData();
        formData.append('clientCreateData', JSON.stringify(clientCreateData));
        
        if (data.clientImage && data.clientImage.length > 0) {
          formData.append('clientImage', data.clientImage[0]);
        }

    
      console.log(formData);
      console.log(clientCreateData);
      console.log(contactInfos);
      const response = await axios.post(
        `http://157.245.110.240:8080/ProBuServices/client/create?access_token=${accessToken}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      navigate("/client");
    } catch (error) {
      console.error("Error updating client:", error);
    }
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
            <h1 className="text-white font-semibold">Client-Create</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4 mt-8 bg-neutral-300 p-5 rounded-md">
              {/* Client Name, GST, PAN */}
              <div className="flex justify-between m-1">
                <div className="w-1/3 pr-5">
                  <label className="text-black pl-1">Client Name</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientName")}
                  />
                  {errors.clientName && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientName.message}
                    </p>
                  )}
                </div>
                <div className="w-1/3 pr-5">
                  <label className="text-black pl-1">Client GST No</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientGstNo")}
                  />
                  {errors.clientGstNo && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientGstNo.message}
                    </p>
                  )}
                </div>
                <div className="w-1/3">
                  <label className="text-black pl-1">Client PAN No</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientPanNo")}
                  />
                  {errors.clientPanNo && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientPanNo.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone, Alt Phone, Email, Alt Email */}
              <div className="flex justify-between m-1">
                <div className="w-1/4 pr-5">
                  <label className="text-black pl-1">Phone</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientPh")}
                  />
                  {errors.clientPh && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientPh.message}
                    </p>
                  )}
                </div>
                <div className="w-1/4 pr-5">
                  <label className="text-black pl-1">Alt Phone</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientAlt")}
                  />
                  {errors.clientAlt && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientAlt.message}
                    </p>
                  )}
                </div>
                <div className="w-1/4 pr-5">
                  <label className="text-black pl-1">Email</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientEmail")}
                  />
                  {errors.clientEmail && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientEmail.message}
                    </p>
                  )}
                </div>
                <div className="w-1/4">
                  <label className="text-black pl-1">Alt Email</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientAltEmail")}
                  />
                  {errors.clientAltEmail && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientAltEmail.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Website, Address */}
              <div className="flex justify-between m-1">
                <div className="w-1/2 pr-5">
                  <label className="text-black pl-1">Website</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientWebsite")}
                  />
                  {errors.clientWebsite && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientWebsite.message}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="text-black pl-1">Address</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientAddress")}
                  />
                  {errors.clientAddress && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientAddress.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Country, State, District, City */}
              <div className="flex justify-between m-1">
                <div className="w-1/4 pr-5">
                  <label className="text-black pl-1">Country</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientCountry")}
                  />
                  {errors.clientCountry && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientCountry.message}
                    </p>
                  )}
                </div>
                <div className="w-1/4 pr-5">
                  <label className="text-black pl-1">State</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientState")}
                  />
                  {errors.clientState && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientState.message}
                    </p>
                  )}
                </div>
                <div className="w-1/4 pr-5">
                  <label className="text-black pl-1">District</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientDistrict")}
                  />
                  {errors.clientDistrict && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientDistrict.message}
                    </p>
                  )}
                </div>
                <div className="w-1/4">
                  <label className="text-black pl-1">City</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientCity")}
                  />
                  {errors.clientCity && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientCity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Pincode */}
              <div className="flex m-1">
                <div className="w-full">
                  <label className="text-black pl-1">Pincode</label>
                  <input
                    className="w-full p-3 rounded-md"
                    {...register("clientPincode")}
                  />
                  {errors.clientPincode && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientPincode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-neutral-400 p-3 rounded-md">
                <h2 className="text-lg font-semibold text-black">Contact Information</h2>
                {fields.map((field, index) => (
                  <div key={field.id} className="mb-4 p-4 rounded-md bg-neutral-200">
                    <div className="flex justify-between mb-2">
                      <div className="w-1/4 pr-2">
                        <label className="text-black">Name</label>
                        <input
                          className="w-full p-2 rounded-md"
                          {...register(`contactInfo.${index}.contactName`)}
                        />
                        {errors.contactInfo?.[index]?.contactName && (
                          <p className="text-red-600 text-sm">
                            {errors.contactInfo[index].contactName?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-1/4 pr-2">
                        <label className="text-black">Phone</label>
                        <input
                          className="w-full p-2 rounded-md"
                          {...register(`contactInfo.${index}.contactPh`)}
                        />
                        {errors.contactInfo?.[index]?.contactPh && (
                          <p className="text-red-600 text-sm">
                            {errors.contactInfo[index].contactPh?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-1/4 pr-2">
                        <label className="text-black">Email</label>
                        <input
                          className="w-full p-2 rounded-md"
                          {...register(`contactInfo.${index}.contactEmail`)}
                        />
                        {errors.contactInfo?.[index]?.contactEmail && (
                          <p className="text-red-600 text-sm">
                            {errors.contactInfo[index].contactEmail?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-1/4">
                        <label className="text-black">Designation</label>
                        <input
                          className="w-full p-2 rounded-md"
                          {...register(`contactInfo.${index}.contactDesignation`)}
                        />
                        {errors.contactInfo?.[index]?.contactDesignation && (
                          <p className="text-red-600 text-sm">
                            {errors.contactInfo[index].contactDesignation?.message}
                          </p>
                        )}
                      </div>
                      <div className="30">
                        <label className="text-black">Is Primary Contact</label>
                        <input
                          className="w-full p-2 rounded-md" type="checkbox"
                          {...register(`contactInfo.${index}.isPrimary`)}
                        />
                        {errors.contactInfo?.[index]?.contactDesignation && (
                          <p className="text-red-600 text-sm">
                            {errors.contactInfo[index].isPrimary?.message}
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
                      contactPh: "",
                      contactEmail: "",
                      contactDesignation: "",
                    })
                  }
                  className="bg-blue-600 text-white p-2 rounded-md"
                >
                  Add Contact
                </button>
              </div>

              {/* File Upload */}
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

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-black text-white p-3 rounded-md"
                >
                  Create Client
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientCreate;
