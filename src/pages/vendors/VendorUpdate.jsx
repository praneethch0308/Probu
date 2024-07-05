import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";

const ContactInfoSchema = z.object({
    contactName: z.string().min(1, "*Contact name is required"),
    contactPhone: z
        .string()
        .min(10, "*Contact mobile number must be 10 digits")
        .max(10, "*Contact mobile number must be 10 digits"),
    contactEmail: z.string().email("Invalid contact email"),
    designation: z.string().min(3, "*Designation is required")
});

const VendorSchema = z.object({
    vendorName: z
        .string()
        .min(2, '*Vendor Name is required')
        .max(50, 'Vendor Name is too long!'),
    companyName: z
        .string()
        .min(2, '*Company Name is required')
        .max(50, 'Company Name is too long!'),
    gstNo: z.string().min(1, "*GST Number is required"),
    panNo: z.string().min(1, "*PAN Number is required"),
    phoneNumber: z
        .string()
        .min(10, "*Contact mobile number must be 10 digits")
        .max(10, "*Contact mobile number must be 10 digits"),
    Email: z.string().email("Invalid contact email"),
    address: z.string().min(5, '*Address is required'),
    city: z.string().min(3, '*Address is required'),
    country: z.string().nonempty('Country is required'),
    state: z.string().nonempty('Country is required'),
    district: z.string().nonempty('Country is required'),
    pinCode: z.string().min(6, "*GST Number is required"),
    vendorType: z.string().nonempty('Country is required'),
    contactInfo: z.array(ContactInfoSchema).optional()
})

const VendorUpdate = () => {
    const [formData, setFormData] = useState({
        vendorName: "",
        companyName: "",
        gstNo: "",
        panNo: "",
        phoneNumber: "",
        Email: "",
        address: "",
        city: "",
        country: "",
        state: "",
        district: "",
        pinCode: "",
        vendorType: "",
        contactInfo: [{ contactName: "", contactPhone: "", contactEmail: "", designation: "" }],
    })
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const stateOptions = {
        "USA": ["California", "Texas", "New York", "Florida", "Illinois"],
        "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
        "India": ["Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Karnataka", "Gujarat", "Telangana", "Andhra Pradesh"],
        // Add more countries and their respective states as needed
    };
    const districtOptions = {
        "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Amravati", "Nanded", "Kolhapur"],
        "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak", "Medchal–Malkajgiri", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"]
        // Add more states and their districts as needed
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        const { name, value } = e.target;

        // Allow only digits and restrict to 10 digits
        const phoneNumberPattern = /^\d{0,10}$/;

        if (name === 'phoneNumber') {
            if (phoneNumberPattern.test(value)) {
                setFormData({
                    ...formData,
                    [name]: value
                });

                // Clear any previous error message
                setErrors({
                    ...errors,
                    [name]: ''
                });
            } else {
                setErrors({
                    ...errors,
                    [name]: 'Phone number must be 10 digits'
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const validatedData = OrganizationCreateDataSchema.parse(formData);
            const accessToken = localStorage.getItem("token");

            const response = await axios.post(
                "http://157.245.110.240:8080/ProBuServices/vendor",
                validatedData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);
            navigate("/vendors");
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
                    <div className="bg-gradient-to-r from-neutral-700 to-neutral-400 p-4 rounded-lg mt-10 w-full">
                        <p className="text-center text-white stroke-black text-2xl font-bold">
                            VENDOR-UPDATE
                        </p>
                    </div>
                    <form className="bg-neutral-200 rounded-lg p-5 mt-4">
                        <div className="flex justify-between">
                            <div className="w-1/3">
                                <label >Vendor Name</label> <br />
                                <input
                                    type="text"
                                    name="vendorName"
                                    value={formData.vendorName}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Enter Vendor Name"
                                ></input>
                                {errors.vendorName && (
                                    <p className="text-red-600 text-sm pl-1">{errors.vendorName}</p>
                                )}
                            </div>

                            <div className="w-1/3">
                                <label >Company Name</label> <br />
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Enter Company Name"
                                />
                                {errors.companyName && (
                                    <p className="text-red-600 text-sm pl-1">{errors.companyName}</p>
                                )}
                            </div>
                            <div className="w-1/3">
                                <label >GST Number</label> <br />
                                <input
                                    type="text"
                                    name="gstNo"
                                    value={formData.gstNo}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Enter GST number"
                                />
                                {errors.gstNo && (
                                    <p className="text-red-600 text-sm pl-1">{errors.gstNo}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <div className="w-1/3">
                                <label >PAN Number</label> <br />
                                <input
                                    type="text"
                                    name="panNo"
                                    value={formData.panNo}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Enter PAN number"
                                    maxLength={10}

                                />
                                {errors.panNo && (
                                    <p className="text-red-600 text-sm pl-1">{errors.panNo}</p>
                                )}
                            </div>

                            <div className="w-1/3">
                                <label >Phone number</label> <br />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Enter phone number"
                                    maxLength={10}
                                    pattern="\d*"
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.phoneNumber}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/3">
                                <label >Email</label> <br />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Enter Email id"
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm pl-1">{errors.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="pt-4">
                            <label htmlFor="logoInput" className="bg-black p-2 hover:bg-white text-white hover:text-black w-36 h-8 rounded-lg cursor-pointer">
                                Select Logo
                            </label>
                            <input
                                id="logoInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="bg-gradient-to-r from-neutral-700 to-neutral-400 p-2 rounded-lg mt-10 w-full">
                            <p className="text-center text-white stroke-black text-2xl font-bold">
                                ADDRESS
                            </p>
                        </div>
                        <div className="p-4">
                            <label>Address</label> <br />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="p-2 rounded-lg w-full justify-center"
                                placeholder="Enter address"
                            >
                            </textarea>
                            {errors.address && (
                                <p className="text-red-600 text-sm pl-1">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <label >City</label> <br />
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg"
                                    placeholder="Enter City Name"
                                />
                                {errors.city && (
                                    <p className="text-red-600 text-sm pl-1">{errors.city}</p>
                                )}
                            </div>
                            <div className=" mr-20">
                                <label>Country</label> <br />
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-44"
                                >
                                    <option value="">Select Country</option>
                                    <option value="USA">USA</option>
                                    <option value="Canada">Canada</option>
                                    <option value="India">India</option>
                                </select>
                                {errors.country && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.country}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label>State</label> <br />
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-44"
                                >
                                    <option value="">Select State</option>
                                    {formData.country && stateOptions[formData.country] && stateOptions[formData.country].map((state, index) => (
                                        <option key={index} value={state}>{state}</option>
                                    ))}
                                </select>
                                {errors.state && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.state}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between pt-4">
                            <div>
                                <label>District</label> <br />
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-44"
                                >
                                    <option value="">Select District</option>
                                    {formData.state && districtOptions[formData.state] && districtOptions[formData.state].map((district, index) => (
                                        <option key={index} value={district}>{district}</option>
                                    ))}
                                </select>
                                {errors.district && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.district}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label >PIN Code</label> <br />
                                <input
                                    type="text"
                                    name="pinCode"
                                    value={formData.pinCode}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg"
                                    placeholder="Enter PIN Code"
                                ></input>
                                {errors.pinCode && (
                                    <p className="text-red-600 text-sm pl-1">{errors.pinCode}</p>
                                )}
                            </div>
                            <div>
                                <label>Vendor Type</label> <br />
                                <select
                                    name="vendorType"
                                    value={formData.vendorType}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg w-auto"
                                >
                                    <option value="">Select Vendor</option>
                                    <option value="DISTRIBUTOR">DISTRIBUTOR</option>
                                    <option value="SUPPLIER">SUPPLIER</option>
                                    <option value="SERVICE PROVIDER">SERVICE PROVIDER</option>
                                </select>
                                {errors.vendorType && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.vendorType}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className=" p-2">
                            <button className="bg-black  hover:bg-white text-white hover:text-black w-36 p-1  rounded-lg cursor-pointer">
                                +  Assign Project
                            </button>
                        </div>
                        <div className="bg-gradient-to-r from-neutral-700 to-neutral-400 p-2 rounded-lg mt-10 w-full">
                            <p className="text-center text-white stroke-black text-2xl font-bold">
                                CONTACT DETAILS
                            </p>
                        </div>
                        <div className="p-2">
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
                                    <label >Contact Phone</label> <br />
                                    <input
                                        type="text"
                                        name="contactPhone"
                                        // value={formData.contactInfo}
                                        // onChange={handleChange}
                                        className="p-2 rounded-lg"
                                        placeholder="Enter Contact Phone Number"
                                        maxLength={10}
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
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="p-2 rounded-lg"
                                        placeholder="Enter Designation"
                                    />
                                    {errors.designation && (
                                        <p className="text-red-600 text-sm pl-1">{errors.designation}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div>
                                <input type="checkbox" />
                                <label>Is Primary Contact</label>
                            </div>
                            <div className=" ml-6">
                                <button className="bg-black  hover:bg-white text-white hover:text-black w-36  rounded-lg cursor-pointer"
                                    type="submit" onClick={handleSubmit}
                                >Add</button>
                            </div>
                        </div>
                        <div className="flex justify-evenly mt-3">
                            <button
                                className="bg-black hover:bg-white hover:text-black text-white w-36 h-8 rounded-lg"
                                type="submit" onClick={handleSubmit}
                            >
                                Update
                            </button>
                            <button
                                className="bg-black hover:bg-white hover:text-black text-white w-36 h-8 rounded-lg"
                                onClick={() => navigate("/vendors")}
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
export default VendorUpdate