import axios from "axios";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";

import { z } from 'zod';
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CountryContext from "../../context/countries/CountryContext";
import { useFieldArray, useForm } from "react-hook-form";
import { ContactInfo } from "../../context/clients/ClientState";
import ClientContext from "../../context/clients/ClientContext";



function ClientUpdate() {
  
    const navigate = useNavigate();
    const { countries, states, districts, getAllCountries, getAllStates, getAllDistricts } = useContext(CountryContext);
    const location= useLocation();
    const context= useContext(ClientContext);
    const {clientObj,GetClientbyCode}= context
    const {
        state: { client },
      } = location;
     
      useEffect(()=>{
        GetClientbyCode(client.clientCode,client.orgId);
        
      },[])
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
        clientGstNo:clientObj?.client?.gstNo || "", 
        clientPanNo:clientObj?.client?.panNo||"",
        clientPh:clientObj?.client?.phoneNumber|| "",
        clientAlt: clientObj?.client?.altPhoneNumber || "", 
        clientEmail: clientObj?.client?.email || "", 
        clientAltEmail: clientObj?.client?.altEmail|| "", 
        clientWebsite: clientObj?.client?.website || "", 
        clientAddress: clientObj?.client?.address || " ", 
        clientCountry: clientObj?.client?.country ||"", 
        clientState: clientObj?.client?.state || "", 
        clientDistrict:clientObj?.client?.district||""  ,        
        clientCity:clientObj?.client?.city||"" ,         
        clientPincode:clientObj?.client?.pincode ||"" ,
        contactInfo : clientObj?.contactInfo || []
      },
    });
    
    console.log(clientObj?.contactInfo || []);
    useEffect(() => {
        reset({
            clientName: clientObj?.client?.clientName || "", 
            clientGstNo:clientObj?.client?.gstNo || "", 
            clientPanNo:clientObj?.client?.panNo||"",
            clientPh:clientObj?.client?.phoneNumber|| "",
            clientAlt: clientObj?.client?.altPhoneNumber || "", 
            clientEmail: clientObj?.client?.email || "", 
            clientAltEmail: clientObj?.client?.altEmail|| "", 
            clientWebsite: clientObj?.client?.website || "", 
            clientAddress: clientObj?.client?.address || "", 
            clientCountry: clientObj?.client?.country ||"", 
            clientState: clientObj?.client?.state || "", 
            clientDistrict:clientObj?.client?.district|""  ,        
            clientCity:clientObj?.client?.city ,         
            clientPincode:clientObj?.client?.pincode,
            contactInfo : clientObj?.contactInfo || []
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
  
    const orgId = localStorage.getItem("orgId");
    const username = localStorage.getItem("loggedUser");
  
    const { fields, append, remove } = useFieldArray({
        control,
        name: "contactInfo",
      });
    const onSubmit = async (data) => {
        try {
            const clientUpdateData={};
            clientUpdateData.id = clientObj.client.id;
            clientUpdateData.clientName = data.clientName;
            clientUpdateData.clientGstNo = data.clientGstNo;
            clientUpdateData.clientPANNo = data.clientPanNo;
            clientUpdateData.status = "New"
            clientUpdateData.address =  data.clientAddress;
            clientUpdateData.city = data.clientCity;
            clientUpdateData.district = data.clientDistrict;
            clientUpdateData.state = data.clientState;
            clientUpdateData.country = data.clientCountry;
            clientUpdateData.pincode =  data.clientPincode;
            clientUpdateData.phoneNumber =  data.clientPh;
            clientUpdateData.altPhoneNumber = data.clientAlt;
            clientUpdateData.email =  data.clientEmail;
            clientUpdateData.altEmail = data.clientAltEmail;
            clientUpdateData.website = data.clientWebsite;
            clientUpdateData.registrationDate = '2024-02-02';
            clientUpdateData.orgId = orgId;
            clientUpdateData.clientCode = clientObj?.client.clientCode
            const contactInfos = (data.contactInfo || []).map(contact => {
              const contactInfo = new ContactInfo()
              if (contact.id !== undefined && contact.id !== null) {
                contactInfo.id = contact.id;
              } else { 
                contactInfo.id = "";
              }
              contactInfo.contactName = contact.contactName;
              contactInfo.contactPhone = contact.contactPhone;
              contactInfo.contactEmail = contact.contactEmail;
              contactInfo.contactDesignation = contact.contactDesignation;
              contactInfo.isPrimary = contact.isPrimary;
              contactInfo.orgId = orgId;
              return contactInfo;
            });
            clientUpdateData.contactInfos = contactInfos;
            clientUpdateData.userName = username;
        console.log("contactinfo",contactInfos);
            const accessToken = localStorage.getItem("token");
            console.log("client update data",clientUpdateData);
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
  
                  <div className="flex justify-between m-1">
                  <div className="w-1/4 pr-2">
                <label className="block text-gray-700">Country</label>
                <select {...register("clientCountry")}  className="w-full p-3 border rounded-md">
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.country}>{country.country}</option>
                  ))}
                </select>
                {errors.clientCountry && <p className="text-red-600 text-sm">{errors.clientCountry.message}</p>}
              </div>
              <div className="w-1/4 pr-2">
                <label className="block text-gray-700">State</label>
                <select {...register("clientState")} className="w-full p-3 border rounded-md">
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.state}>{state.state}</option>
                  ))}
                </select>
                {errors.clientState && <p className="text-red-600 text-sm">{errors.clientState.message}</p>}
              </div>
              <div className="w-1/4 pr-2">
                <label className="block text-gray-700">District</label>
                <select {...register("clientDistrict")} className="w-full p-3 border rounded-md">
                  <option value="" >Select District</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.district}>{district.district}</option>
                  ))}
                </select>
                {errors.clientDistrict && <p className="text-red-600 text-sm">{errors.clientDistrict.message}</p>}
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
  
                  <div className="flex m-1">
                    <div className="w-1/4">
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

export default ClientUpdate