import axios from "axios";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";

import { z } from 'zod';
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function ClientUpdate() {
    const [formData, setformData] = useState({
        clientName: "",
        clientGstNo: "",
        clientPanNo: "",
        clientPh: "",
        clientAlt: "",
        clientEmail: "",
        clientAltEmail: "",
        clientWebsite: "",
        clientAddress: "",
        clientCity: "",
        clientPincode: "",
        contactInfo: [{ contactName: "", contactPh: "", contactEmail: "", contactDesignation: "" }]
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validatedData = ClientSchema.parse(formData);
            const accessToken = localStorage.getItem("token");

            const response = await axios.post(
                `${process.env.REACT_API_URL}/ProBuServices/client/update`,
                validatedData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);
            navigate("/client");
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(
                    error.errors.reduce((acc, curr) => {
                        acc[curr.path[0]] = curr.message;
                        return acc;
                    }, {})
                );
            } else {
                console.error("Error updating client:", error);
            }
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
                <div className="mr-10 bg-gray-100 mt-10 items-center w-3/4">
                    <div className="text-center text-4xl w-full bg-gradient-to-r from-black to-neutral-400 py-4 rounded-md">
                        <h1 className="text-white font-semibold">Client-Update</h1>
                    </div>
                    <form onSubmit>
                        <div className="flex flex-col space-y-4 mt-8 bg-neutral-200 p-5 rounded-md">
                            <div className="flex justify-between m-1">
                                <div className="w-1/3 pr-5">
                                    <input className="w-full p-3 rounded-md" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Client Name" />
                                    {errors.clientName && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.clientName}
                                        </p>
                                    )}
                                </div>
                                <div className="w-1/3 pr-5">
                                    <input className="w-full p-3 rounded-md" name="clientGstNo" value={formData.clientGstNo} onChange={handleChange} placeholder="Client GST No" />
                                    {errors.clientGstNo && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.clientGstNo}
                                        </p>
                                    )}
                                </div>
                                <div className="w-1/3">
                                    <input className="w-full p-3 rounded-md" name="clientPanNo" value={formData.clientPanNo} onChange={handleChange} placeholder="Client PAN No" />
                                    {errors.clientPanNo && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.clientPanNo}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between m-1">
                                <div className="w-1/3 pr-5">
                                    <input className="w-full p-3 rounded-md" name="clientPh" value={formData.clientPh} onChange={handleChange} placeholder="Phone Number" />
                                    {errors.clientPh && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.clientPh}
                                        </p>
                                    )}
                                </div>
                                <div className="w-1/3 pr-5">
                                    <input className="w-full p-3 rounded-md" name="clientAlt" value={formData.clientAlt} onChange={handleChange} placeholder="Alternate Phone Number" />
                                    {errors.clientAlt && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.clientAlt}
                                        </p>
                                    )}
                                </div>
                                <div className="w-1/3">
                                    <input className="w-full p-3 rounded-md" name="clientEmail" value={formData.clientEmail} onChange={handleChange} placeholder="Email ID" />
                                    {errors.clientEmail && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.clientEmail}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-start m-1">
                                <div className="w-1/3 pr-5">
                                    <input className="w-full p-3 rounded-md" name="clientAltEmail" value={formData.clientAltEmail} onChange={handleChange} placeholder="Alternate Email ID" />
                                    {errors.clientAltEmail && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.clientAltEmail}
                                        </p>
                                    )}
                                </div>
                                <div className="w-1/3">
                                    <input className="w-full p-3 rounded-md" name="clientWebsite" value={formData.clientWebsite} onChange={handleChange} placeholder="Website" />
                                    {errors.clientWebsite && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.clientWebsite}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-start m-1">
                                <label className="bg-black w-36 text-white text-center hover:bg-neutral-700  h-8 rounded-lg">
                                    Choose Logo
                                    <input type="file" className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="m-4 ">
                            <div className="bg-gradient-to-r from-black to-neutral-400 font-semibold text-xl text-center rounded-md p-3 text-white">
                                <p>Address</p>
                            </div>
                            <div className="">
                                <div className="text-black mb-4 mt-4 ">
                                    <textarea placeholder="Address" className="w-full p-3 rounded-md" rows="4" />
                                </div>
                                <div className="">
                                    <div className="flex space-x-4">
                                        <select className="w-1/3 p-3 rounded-md">
                                            <option value="" disabled selected>Country</option>
                                            <option value="India">India</option>
                                        </select>
                                        <select className="w-1/3 p-3 rounded-md">
                                            <option value="" disabled selected>State</option>
                                            <option value="AP">AP</option>
                                        </select>
                                        <select className="w-1/3 p-3 rounded-md">
                                            <option value="" disabled selected>District</option>
                                            <option value="Krishna">Krishna</option>
                                        </select>
                                    </div>
                                    <div className="flex space-x-4 mt-4">
                                        <div className="w-1/2 pr-2">
                                            <input className="w-full p-3 rounded-md" name="clientCity" value={formData.clientCity} onChange={handleChange} placeholder="City" />
                                            {errors.clientCity && (
                                                <p className="text-red-600 text-sm pl-8">
                                                    {errors.clientCity}
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-1/2 pl-2">
                                            <input type="text" className="w-full p-3 rounded-md" name="clientPincode" value={formData.clientPincode} onChange={handleChange} placeholder="Pincode" />
                                            {errors.clientPincode && (
                                                <p className="text-red-600 text-sm pl-8">
                                                    {errors.clientPincode}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="m-4">
                            <div className="bg-gradient-to-r from-black to-neutral-400 font-semibold text-xl text-center rounded-md p-3 text-white" >
                                <p>Contact Details</p>
                            </div>
                            <div className="flex justify-between m-1 pt-4">
                                <div className="w-1/3 pr-5">
                                    <input className="w-full p-3 rounded-md" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Contact Name" />
                                    {errors.contactName && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.contactName}
                                        </p>
                                    )}
                                </div>
                                <div className="w-1/3 pr-5">
                                    <input className="w-full p-3 rounded-md" name="contactPh" value={formData.contactPh} onChange={handleChange} placeholder="Contact Phone" />
                                    {errors.contactPh && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.contactPh}
                                        </p>
                                    )}
                                </div>
                                <div className="w-1/3">
                                    <input className="w-full p-3 rounded-md" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="Contact Email" />
                                    {errors.contactEmail && (
                                        <p className="text-red-600 text-sm pl-8">
                                            {errors.contactEmail}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <input className="w-1/3 p-3 rounded-md" name="contactDesignation" value={formData.contactDesignation} onChange={handleChange} placeholder="Designation" />
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="form-checkbox" />
                                    <span>Is Primary Contact</span>
                                </label>
                                <button className="bg-black w-36 text-white hover:bg-neutral-700  h-8 rounded-lg">Add</button>
                            </div>
                        </div>
                        <div className="flex justify-evenly pt-5">
                            <button type="submit" className="bg-black w-36 text-white hover:bg-neutral-700  h-8 rounded-lg">Update</button>
                            <button className="bg-black w-36 text-white hover:bg-neutral-700  h-8 rounded-lg"
                                onClick={() => navigate("/clients")}
                            >Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ClientUpdate