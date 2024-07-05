import axios from "axios";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { z } from 'zod';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContactSchema = z.object({
    contactName: z.string().min(1, "Contact name is required"),
    contactPh: z.string().min(10, "Enter a valid mobile no"),
    contactEmail: z.string().email("Enter a valid Email"),
    contactDesignation: z.string().min(1, "Enter a valid designation")
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
    contactInfo: z.array(ContactSchema).optional()
});

const initialFormData = {
    clientName: "",
    clientGstNo: "",
    clientPanNo: "",
    clientPh: "",
    clientAlt: "",
    clientEmail: "",
    clientAltEmail: "",
    clientWebsite: "",
    clientAddress: "",
    clientCountry: "",
    clientState: "",
    clientDistrict: "",
    clientCity: "",
    clientPincode: "",
    contactInfo: [{ contactName: "", contactPh: "", contactEmail: "", contactDesignation: "" }]
};

function ClientCreate() {
    const [formData, setFormData] = useState({ ...initialFormData });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("contactInfo")) {
            // Handle nested fields in contactInfo array
            const [, index, subField] = name.split(".");
            setFormData(prevState => ({
                ...prevState,
                contactInfo: prevState.contactInfo.map((item, idx) =>
                    idx == index ? { ...item, [subField]: value } : item
                )
            }));
        } else {
            // Handle top-level fields
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validatedData = ClientSchema.parse(formData);
            const accessToken = localStorage.getItem("token");

            const response = await axios.post(
                "http://157.245.110.240:8080/ProBuServices/client/update",
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
                <div className="mr-10 mt-10 items-center w-3/4">
                    <div className="text-center text-4xl w-full bg-gradient-to-r from-black to-neutral-400 py-4 rounded-md">
                        <h1 className="text-white font-semibold">Client-Create</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-4 mt-8 bg-neutral-300 p-5 rounded-md">
                            <div className="flex justify-between m-1">
                                <div className="w-1/3 pr-5">
                                    <label className="text-black pl-1">Client Name</label>
                                    <input className="w-full p-3 rounded-md" name="clientName" value={formData.clientName} onChange={handleChange} />
                                    {errors.clientName && (
                                        <p className="text-red-600 text-sm pl-8">{errors.clientName}</p>
                                    )}
                                </div>
                                <div className="w-1/3 pr-5">
                                    <label className="text-black pl-1">Client GST No</label>
                                    <input className="w-full p-3 rounded-md" name="clientGstNo" value={formData.clientGstNo} onChange={handleChange} />
                                    {errors.clientGstNo && (
                                        <p className="text-red-600 text-sm pl-8">{errors.clientGstNo}</p>
                                    )}
                                </div>
                                <div className="w-1/3">
                                    <label className="text-black pl-1">Client PAN No</label>
                                    <input className="w-full p-3 rounded-md" name="clientPanNo" value={formData.clientPanNo} onChange={handleChange} />
                                    {errors.clientPanNo && (
                                        <p className="text-red-600 text-sm pl-8">{errors.clientPanNo}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between m-1">
                                <div className="w-1/3 pr-5">
                                    <label className="text-black pl-1">Phone Number</label>
                                    <input className="w-full p-3 rounded-md" name="clientPh" value={formData.clientPh} onChange={handleChange} />
                                    {errors.clientPh && (
                                        <p className="text-red-600 text-sm pl-8">{errors.clientPh}</p>
                                    )}
                                </div>
                                <div className="w-1/3 pr-5">
                                    <label className="text-black pl-1">Alternate Phone Number</label>
                                    <input className="w-full p-3 rounded-md" name="clientAlt" value={formData.clientAlt} onChange={handleChange} />
                                    {errors.clientAlt && (
                                        <p className="text-red-600 text-sm pl-8">{errors.clientAlt}</p>
                                    )}
                                </div>
                                <div className="w-1/3">
                                    <label className="text-black pl-1">Email ID</label>
                                    <input className="w-full p-3 rounded-md" name="clientEmail" value={formData.clientEmail} onChange={handleChange} />
                                    {errors.clientEmail && (
                                        <p className="text-red-600 text-sm pl-8">{errors.clientEmail}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-start m-1">
                                <div className="w-1/3 pr-5">
                                    <label className="text-black pl-1">Alternate Email ID</label>
                                    <input className="w-full p-3 rounded-md" name="clientAltEmail" value={formData.clientAltEmail} onChange={handleChange} />
                                    {errors.clientAltEmail && (
                                        <p className="text-red-600 text-sm pl-8">{errors.clientAltEmail}</p>
                                    )}
                                </div>
                                <div className="w-1/3">
                                    <label className="text-black pl-1">Website</label>
                                    <input className="w-full p-3 rounded-md" name="clientWebsite" value={formData.clientWebsite} onChange={handleChange} />
                                    {errors.clientWebsite && (
                                        <p className="text-red-600 text-sm pl-8">{errors.clientWebsite}</p>
                                    )}
                                </div>
                            </div>
                            <div className="m-4">
                                <div className="bg-gradient-to-r from-black to-neutral-400 font-semibold text-xl text-center rounded-md p-3 text-white">
                                    <p>Address</p>
                                </div>
                                <div className="">
                                    <div className="text-black pl-1 mb-4 mt-4">
                                        <textarea placeholder="Address" className="w-full p-3 rounded-md" name="clientAddress" value={formData.clientAddress} onChange={handleChange} rows="4"></textarea>
                                    </div>
                                    <div className="">
                                        <div className="flex space-x-4">
                                            <select className="w-1/3 p-3 rounded-md" name="clientCountry" value={formData.clientCountry} onChange={handleChange}>
                                                <option value="" disabled>Select Country</option>
                                                <option value="India">India</option>
                                                {/* Add more options as needed */}
                                            </select>
                                            <select className="w-1/3 p-3 rounded-md" name="clientState" value={formData.clientState} onChange={handleChange}>
                                                <option value="" disabled>Select State</option>
                                                <option value="AP">AP</option>
                                                {/* Add more options as needed */}
                                            </select>
                                            <select className="w-1/3 p-3 rounded-md" name="clientDistrict" value={formData.clientDistrict} onChange={handleChange}>
                                                <option value="" disabled>Select District</option>
                                                <option value="Krishna">Krishna</option>
                                                {/* Add more options as needed */}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 mt-4">
                                        <div className="w-1/2 pr-2">
                                            <label className="text-black pl-1">City</label>
                                            <input className="w-full p-3 rounded-md" name="clientCity" value={formData.clientCity} onChange={handleChange} />
                                            {errors.clientCity && (
                                                <p className="text-red-600 text-sm pl-8">{errors.clientCity}</p>
                                            )}
                                        </div>
                                        <div className="w-1/2 pl-2">
                                            <label className="text-black pl-1">Pincode</label>
                                            <input type="text" className="w-full p-3 rounded-md" name="clientPincode" value={formData.clientPincode} onChange={handleChange} />
                                            {errors.clientPincode && (
                                                <p className="text-red-600 text-sm pl-8">{errors.clientPincode}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="m-4">
                                <div className="bg-gradient-to-r from-black to-neutral-400 font-semibold text-xl text-center rounded-md p-3 text-white">
                                    <p>Contact Details</p>
                                </div>
                                {formData.contactInfo.map((contact, index) => (
                                    <div key={index} className="flex justify-between m-1 pt-4">
                                        <div className="w-1/3 pr-5">
                                            <label className="text-black pl-1">Contact Name</label>
                                            <input className="w-full p-3 rounded-md" name={`contactInfo.${index}.contactName`} value={contact.contactName} onChange={handleChange} />
                                            {errors.contactInfo && errors.contactInfo[index] && errors.contactInfo[index].contactName && (
                                                <p className="text-red-600 text-sm pl-8">{errors.contactInfo[index].contactName}</p>
                                            )}
                                        </div>
                                        <div className="w-1/3 pr-5">
                                            <label className="text-black pl-1">Contact Phone</label>
                                            <input className="w-full p-3 rounded-md" name={`contactInfo.${index}.contactPh`} value={contact.contactPh} onChange={handleChange} />
                                            {errors.contactInfo && errors.contactInfo[index] && errors.contactInfo[index].contactPh && (
                                                <p className="text-red-600 text-sm pl-8">{errors.contactInfo[index].contactPh}</p>
                                            )}
                                        </div>
                                        <div className="w-1/3">
                                            <label className="text-black pl-1">Contact Email</label>
                                            <input className="w-full p-3 rounded-md" name={`contactInfo.${index}.contactEmail`} value={contact.contactEmail} onChange={handleChange} />
                                            {errors.contactInfo && errors.contactInfo[index] && errors.contactInfo[index].contactEmail && (
                                                <p className="text-red-600 text-sm pl-8">{errors.contactInfo[index].contactEmail}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-4">
                                    <input className="w-1/3 p-3 rounded-md text-black" name="contactDesignation" value={formData.contactDesignation} onChange={handleChange} placeholder="Designation" />
                                    {errors.contactDesignation && (
                                        <p className="text-red-600 text-sm pl-8">{errors.contactDesignation}</p>
                                    )}
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" className="form-checkbox" />
                                        <span className="text-black pl-1">Is Primary Contact</span>
                                    </label>
                                    <button type="button" className="bg-black w-36 text-white hover:bg-neutral-700 h-8 rounded-lg">Add</button>
                                </div>
                            </div>
                            <div className="flex justify-evenly pt-5">
                                <button type="submit" className="bg-black w-36 text-white hover:bg-neutral-700 h-8 rounded-lg">Save</button>
                                <button className="bg-black w-36 text-white hover:bg-neutral-700 h-8 rounded-lg" onClick={() => navigate("/clients")}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ClientCreate;
