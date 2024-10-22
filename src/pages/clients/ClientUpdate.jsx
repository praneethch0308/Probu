import axios from "axios";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CountryContext from "../../context/countries/CountryContext";
import { useFieldArray, useForm } from "react-hook-form";
import ClientContext from "../../context/clients/ClientContext";
import { ContactInfo } from "../../context/clients/ClientState";

function ClientUpdate() {
  const navigate = useNavigate();
  const { countries, states, districts, getAllCountries, getAllStates, getAllDistricts } = useContext(CountryContext);
  const location = useLocation();
  const { clientObj, GetClientbyCode } = useContext(ClientContext);
  const { state: { client } } = location;

  useEffect(() => {
    GetClientbyCode(client.clientCode, client.orgId);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      clientName: clientObj?.client?.clientName || "",
      clientGstNo: clientObj?.client?.gstNo || "",
      clientPanNo: clientObj?.client?.panNo || "",
      clientPh: clientObj?.client?.phoneNumber || "",
      clientAlt: clientObj?.client?.altPhoneNumber || "",
      clientEmail: clientObj?.client?.email || "",
      clientAltEmail: clientObj?.client?.altEmail || "",
      clientWebsite: clientObj?.client?.website || "",
      clientAddress: clientObj?.client?.address || "",
      clientCountry: clientObj?.client?.country || "",
      clientState: clientObj?.client?.state || "",
      clientDistrict: clientObj?.client?.district || "",
      clientCity: clientObj?.client?.city || "",
      clientPincode: clientObj?.client?.pincode || "",
      contactInfo: clientObj?.contactInfo || [],
    },
  });

  useEffect(() => {
    reset({
      clientName: clientObj?.client?.clientName || "",
      clientGstNo: clientObj?.client?.gstNo || "",
      clientPanNo: clientObj?.client?.panNo || "",
      clientPh: clientObj?.client?.phoneNumber || "",
      clientAlt: clientObj?.client?.altPhoneNumber || "",
      clientEmail: clientObj?.client?.email || "",
      clientAltEmail: clientObj?.client?.altEmail || "",
      clientWebsite: clientObj?.client?.website || "",
      clientAddress: clientObj?.client?.address || "",
      clientCountry: clientObj?.client?.country || "",
      clientState: clientObj?.client?.state || "",
      clientDistrict: clientObj?.client?.district || "",
      clientCity: clientObj?.client?.city || "",
      clientPincode: clientObj?.client?.pincode || "",
      contactInfo: clientObj?.contactInfo || [],
    });
  }, [clientObj, reset]);

  useEffect(() => {
    getAllCountries();
  }, []);

  useEffect(() => {
    if (watch("clientCountry")) {
      getAllStates(watch("clientCountry"));
    }
  }, [watch("clientCountry")]);

  useEffect(() => {
    if (watch("clientCountry") && watch("clientState")) {
      getAllDistricts(watch("clientCountry"), watch("clientState"));
    }
  }, [watch("clientCountry"), watch("clientState")]);

  const { fields, append } = useFieldArray({
    control,
    name: "contactInfo",
  });
const orgId= localStorage.getItem("orgId");
const accessToken = localStorage.getItem("token");
  const onSubmit = async (data) => {
    try {
      const clientUpdateData = {
        id: clientObj.client.id,
        clientName: data.clientName,
        clientGstNo: data.clientGstNo,
        clientPANNo: data.clientPanNo,
        status: "New",
        address: data.clientAddress,
        city: data.clientCity,
        district: data.clientDistrict,
        state: data.clientState,
        country: data.clientCountry,
        pincode: data.clientPincode,
        phoneNumber: data.clientPh,
        altPhoneNumber: data.clientAlt,
        email: data.clientEmail,
        altEmail: data.clientAltEmail,
        website: data.clientWebsite,
        registrationDate: "2024-02-02",
        orgId:orgId,
        clientCode: clientObj?.client.clientCode,
        userName: localStorage.getItem("logged User "),
        contactInfos: data.contactInfo.map((contact) => ({
          id: contact.id || "",
          contactName: contact.contactName,
          contactPhone: contact.contactPh,
          contactEmail: contact.contactEmail,
          contactDesignation: contact.contactDesignation,
          isPrimary: contact.isPrimary,
          orgId: orgId,
        })),
      };

     

      const response = await axios.post(
        `${process.env.REACT_API_URL}/client/update`,
        clientUpdateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data);
      navigate("/clients");
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const [contactName, setContactName] = useState("");
  const [contactPh, setContactPh] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactDesignation, setContactDesignation] = useState("");
  const [contactIsPrimary, SetIsPrimary] = useState(false);

  const handleAddContact = async() => {
    append({
      contactName,
      contactPh,
      contactEmail,
      contactDesignation,
      contactIsPrimary
    });
    setContactName("");
    setContactPh("");
    setContactEmail("");
    setContactDesignation("");
    SetIsPrimary(false);

    const contact = new ContactInfo();
    contact.contactName = contactName;
    contact.contactPhone = contactPh;
    contact.contactEmail = contactEmail;
    contact.contactDesignation = contactDesignation;
    contact.isPrimary = contactIsPrimary|| false;
    contact.orgId = orgId;

    contact.clientObjId = clientObj.client.id;
    contact.vendorObjId = "";
    contact.orgObjId = "";
    console.log(contact);
    const response =  await axios.post(`${process.env.REACT_API_URL}/contact/create`, contact,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    console.log("contact info",response.data)
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
            <h1 className="text-white font-semibold">Client Update</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4 mt-8 bg-neutral-300 p-5 rounded-md">
              <div className="flex justify-between m-1">
                <div className="w-1/3 pr-2">
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
                <div className="w-1/3 pr-2">
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

              <div className="flex justify-between m-1">
                <div className="w-1/4 pr-2">
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
                <div className="w-1/4 pr-2">
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
                <div className="w-1/4 pr-2">
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
                  < label className="text-black pl-1">Alt Email</label>
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

              <div className="flex justify-between m-1">
                <div className="w-1/2 pr-2">
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
                <div className="w-1/2">
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

              <div className="flex justify-between m-1">
                <div className="w-1/3 pr-2">
                  <label className="text-black pl-1">Country</label>
                  <select
                    className="w-full p-3 rounded-md"
                    {...register("clientCountry")}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.countries}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                  {errors.clientCountry && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientCountry.message}
                    </p>
                  )}
                </div>
                <div className="w-1/3 pr-2">
                  <label className="text-black pl-1">State</label>
                  <select
                    className="w-full p-3 rounded-md"
                    {...register("clientState")}
                  >
                    {states.map((state) => (
                      <option key={state.code} value={state.state}>
                        {state.state}
                      </option>
                    ))}
                  </select>
                  {errors.clientState && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientState.message}
                    </p>
                  )}
                </div>
                <div className="w-1/3">
                  <label className="text-black pl-1">District</label>
                  <select
                    className="w-full p-3 rounded-md"
                    {...register("clientDistrict")}
                  >
                    {districts.map((district) => (
                      <option key={district.code} value={district.district}>
                        {district.district}
                      </option>
                    ))}
                  </select>
                  {errors.clientDistrict && (
                    <p className="text-red-600 text-sm pl-8">
                      {errors.clientDistrict.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between m-1">
                <div className="w-1/2 pr-2">
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
            <div className="bg-neutral-400 p-4 rounded-lg ">
              <p className="font-bold text-black text-center text-xl">Contact Information</p>
              <div className="flex justify-between m-1">
                <div className="w-1/2 pr-2">
                  <label className="text-black pl-1">Contact Name</label>
                  <input
                    className="w-full p-3 rounded-md"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-black pl-1">Contact Phone</label>
                  <input
                    className="w-full p-3 rounded-md"
                    value={contactPh}
                    onChange={(e) => setContactPh(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between m-1">
                <div className="w-1/3 pr-2">
                  <label className="text-black pl-1">Contact Email</label>
                  <input
                    className="w-full p-3 rounded-md"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-black pl-1">Designation</label>
                  <input
                    className="w-full p-3 rounded-md"
                    value={contactDesignation}
                    onChange={(e) => setContactDesignation(e.target.value)}
                  />
                </div>
                <div className="w-1/3 items-center">
                  <label className="text-black pl-1 ">Is Primary</label>
                  <input
                    className="w-full p-3 rounded-md" type="checkbox"
                    value={contactIsPrimary}
                    onChange={(e) => SetIsPrimary(e.target.value)}
                  />
                </div>

              </div>
                  <div className="flex justify-center mt-3 ">
              <button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white rounded-md p-1 w-32 "
                onClick={handleAddContact}
              >
                Add Contact
              </button>
              </div>
              </div>
              <table className="w-full mt-4">
                <thead className="bg-black">
                  <tr className="text-white">
                    <th className="px-4 py-2">Contact Name</th>
                    <th className="px-4 py-2">Contact Phone</th>
                    <th className="px-4 py-2">Contact Email</th>
                    <th className="px-4 py-2">Designation</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {fields.map((field, index) => (
                    <tr key={field.id}>
                      <td className="px-4 py-2">{field.contactName}</td>
                      <td className="px-4 py-2">{field.contactPh}</td>
                      <td className="px-4 py-2">{field.contactEmail}</td>
                      <td className="px-4 py-2">{field.contactDesignation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-3 rounded-md"
                >
                  Update Client
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientUpdate;