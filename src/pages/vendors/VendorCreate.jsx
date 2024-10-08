import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { useForm } from "react-hook-form";
import { Vendor } from "../../context/vendors/VendorState";
import { zodResolver } from "@hookform/resolvers/zod";

const ContactInfoSchema = z.object({
  contactName: z.string().min(1, "*Contact name is required"),
  contactPhone: z
    .string()
    .min(10, "*Contact mobile number must be 10 digits")
    .max(10, "*Contact mobile number must be 10 digits"),
  contactEmail: z.string().email("Invalid contact email"),
  designation: z.string().min(3, "*Designation is required"),
});

const vendorSchema = z.object({
  vendName: z.string().optional(),
  companyName: z.string().optional(),
  gstNo: z.string().optional(),
  panNo: z.string().optional(),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  email: z.string().email('Invalid email address'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  type: z.string().optional(),
  vendImage: z.string().min(1, 'Vendor image is required')
});

const contactSchema = z.object({
  contactName: z.string().optional(),
  contactPhone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  contactEmail: z.string().email('Invalid email address'),
  contactDesignation: z.string().optional(),
  isPrimary: z.boolean().optional()
});

const VendorCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(vendorSchema),
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const host = process.env.REACT_API_URL;
const accessToken=localStorage.getItem('token');
  const stateOptions = {
    USA: ["California", "Texas", "New York", "Florida", "Illinois"],
    Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
    India: [
      "Maharashtra",
      "Uttar Pradesh",
      "Tamil Nadu",
      "Karnataka",
      "Gujarat",
      "Telangana",
      "Andhra Pradesh",
    ],
  };

  const districtOptions = {
    "Andhra Pradesh": [
      "Anantapur",
      "Chittoor",
      "East Godavari",
      "Guntur",
      "Krishna",
      "Kurnool",
      "Nellore",
      "Prakasam",
      "Srikakulam",
      "Visakhapatnam",
      "Vizianagaram",
      "West Godavari",
      "YSR Kadapa",
    ],
    Maharashtra: [
      "Mumbai",
      "Pune",
      "Nagpur",
      "Nashik",
      "Thane",
      "Aurangabad",
      "Solapur",
      "Amravati",
      "Nanded",
      "Kolhapur",
    ],
    Telangana: [
      "Adilabad",
      "Bhadradri Kothagudem",
      "Hyderabad",
      "Jagtial",
      "Jangaon",
      "Jayashankar Bhupalpally",
      "Jogulamba Gadwal",
      "Kamareddy",
      "Karimnagar",
      "Khammam",
      "Komaram Bheem",
      "Mahabubabad",
      "Mahbubnagar",
      "Mancherial",
      "Medak",
      "Medchal–Malkajgiri",
      "Nagarkurnool",
      "Nalgonda",
      "Nirmal",
      "Nizamabad",
      "Peddapalli",
      "Rajanna Sircilla",
      "Ranga Reddy",
      "Sangareddy",
      "Siddipet",
      "Suryapet",
      "Vikarabad",
      "Wanaparthy",
      "Warangal Rural",
      "Warangal Urban",
      "Yadadri Bhuvanagiri",
    ],
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = async (data) => {
    try {
        const VendCreateData = {
            vendorname: data.vendName || '',
            companyName: data.companyName || '',
            gstNo: data.gstNo || '',
            panNo: data.panNo || '',
            phone: data.phone,
            email: data.email,
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            state: data.state || '',
            district: data.district || '',
            pincode: data.pincode,
            type: data.type || '',
            vendImage: fileName || '',
            contact: {
                contactName: data.contactName || '',
                contactPhone: data.contactPhone || '',
                contactEmail: data.contactEmail || '',
                contactDesignation: data.contactDesignation || '',
                isPrimary: data.isPrimary || false,
            }
        };

        const formData = new FormData();
        formData.append('VendCreateData', JSON.stringify(VendCreateData));


      console.log(VendorData);

      const response = await axios.post(
        `${host}/vendor/create?access_token=${accessToken}`,
        formData, {
          headers: {
            'Content-Type':'multi-part/form-data'
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
        <div>
          <Sidebar />
        </div>
        <div className="mr-24 w-2/3 items-center">
          <div className="bg-gradient-to-r from-neutral-700 to-neutral-400 p-4 rounded-lg mt-10 w-full">
            <p className="text-center text-white stroke-black text-2xl font-bold">
              VENDOR-CREATE
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-200 rounded-lg p-5 mt-4">
            <div className="flex justify-between">
              <div className="w-1/3">
                <label>Vendor Name</label> <br />
                <input
                  type="text"
                  name="vendorName"
                  {...register("vendorName")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter Vendor Name"
                ></input>
                {errors.vendorName && (
                  <p className="text-red-600 text-sm pl-1">{errors.vendorName.message}</p>
                )}
              </div>

              <div className="w-1/3">
                <label>Company Name</label> 
                <br />
                <input
                  type="text"
                  name="companyName"
                  {...register("companyName")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter Company Name"
                />
                {errors.companyName && (
                  <p className="text-red-600 text-sm pl-1">{errors.companyName.message}</p>
                )}
              </div>
              <div className="w-1/3">
                <label>GST Number</label> <br />
                <input
                  type="text"
                  name="gstNo"
                  {...register("gstNo")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter GST number"
                />
                {errors.gstNo && (
                  <p className="text-red-600 text-sm pl-1">{errors.gstNo.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <div className="w-1/3">
                <label>PAN Number</label> <br />
                <input
                  type="text"
                  name="panNo"
                  {...register("panNo")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter PAN number"
                  maxLength={10}
                />
                {errors.panNo && (
                  <p className="text-red-600 text-sm pl-1">{errors.panNo.message}</p>
                )}
              </div>

              <div className="w-1/3">
                <label>Phone number</label> <br />
                <input
                  type="text"
                  name="phoneNumber"
                  {...register("phoneNumber")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm pl-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="w-1/3">
                <label>Email</label> <br />
                <input
                  type="email"
                  name="email"
                  {...register("email")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm pl-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <div className="w-1/3">
                <label>Address</label> <br />
                <input
                  type="text"
                  name="address"
                  {...register("address")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter address"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm pl-1">{errors.address.message}</p>
                )}
              </div>

              <div className="w-1/3">
                <label>City</label> <br />
                <input
                  type="text"
                  name="city"
                  {...register("city")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter City"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm pl-1">{errors.city.message}</p>
                )}
              </div>

              <div className="w-1/3">
                <label>Country</label> <br />
                <select
                  name="country"
                  {...register("country")}
                  className="p-2 rounded-lg w-64"
                >
                  <option value="">Select a country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="Canada">Canada</option>
                </select>
                {errors.country && (
                  <p className="text-red-600 text-sm pl-1">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <div className="w-1/3">
                <label>State</label> <br />
                <select
                  name="state"
                  {...register("state")}
                  className="p-2 rounded-lg w-64"
                  disabled={!selectedCountry}
                >
                  <option value="">Select a state</option>
                  {selectedCountry &&
                    stateOptions[selectedCountry].map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                </select>
                {errors.state && (
                  <p className="text-red-600 text-sm pl-1">{errors.state.message}</p>
                )}
              </div>

              <div className="w-1/3">
                <label>District</label> <br/>
                <select
                  name="district"
                  {...register("district")}
                  className="p-2 rounded-lg w-64"
                  disabled={!selectedState}
                >
                  <option value="">Select a district</option>
                  {selectedState &&
                    districtOptions[selectedState]?.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                </select>
                {errors.district && (
                  <p className="text-red-600 text-sm pl-1">{errors.district.message}</p>
                )}
              </div>

              <div className="w-1/3">
                <label>Pin Code</label> <br />
                <input
                  type="text"
                  name="pinCode"
                  {...register("pinCode")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter pin code"
                />
                {errors.pinCode && (
                  <p className="text-red-600 text-sm pl-1">{errors.pinCode.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <div className="w-1/3">
                <label>Vendor Type</label> <br />
                <input
                  type="text"
                  name="vendorType"
                  {...register("vendorType")}
                  className="p-2 rounded-lg w-64"
                  placeholder="Enter vendor type"
                />
                {errors.vendorType && (
                  <p className="text-red-600 text-sm pl-1">{errors.vendorType.message}</p>
                )}
              </div>

              <div className="w-1/3">
                <label>Vendor Logo</label> <br />
                <input
                  type="file"
                  name="vendorLogo"
                  onChange={handleImageChange}
                  className="p-2 rounded-lg w-64"
                />
                {selectedImage && (
                  <img src={selectedImage} alt="Selected" className="mt-2 w-16 h-16" />
                )}
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Vendor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorCreate;
