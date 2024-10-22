import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import 'tailwindcss/tailwind.css';
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import VendorContext from "../../context/vendors/VendorContext";
import CountryContext from "../../context/countries/CountryContext";

const ContactInfoSchema = z.object({
  contactName: z.string().min(1, "*Contact name is required"),
  contactPhone: z
    .string()
    .min(10, "*Contact mobile number must be 10 digits")
    .max(10, "*Contact mobile number must be 10 digits"),
  contactEmail: z.string().email("Invalid contact email"),
  designation: z.string().min(3, "*Designation is required"),
  isPrimary: z.boolean(),
});

const VendorSchema = z.object({
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
  contactInfo: z.array(ContactInfoSchema).optional(),
});

const VendorCreate = () => {
  const [selectedVendorImg, setSelectedImage] = useState(null);
  const orgId = localStorage.getItem('orgId');
  const username = localStorage.getItem('loggedUser');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(VendorSchema)
  });

  const navigate = useNavigate();
  const context = useContext(VendorContext);
  const { VendorCreate, vendInit, VendorInitData } = context;
  const { vendorTypes = [] } = vendInit || {};
  const countryCon = useContext(CountryContext);
  const { countries=[], getAllCountries } = countryCon;

  const handleImageChange = (event) => {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
    }
  };

  const onSubmit = async (data) => {
    try {
      const vendorData = {
        vendor: {
          vendorName: data.vendName,
          vendorCode: '',
          vendLogoUrl: '', 
          gstNo: data.gstNo,  
          panNo: data.panNo, 
          address: data.address,
          city: data.city,
          district: data.district,
          state: data.state,
          pincode: data.pincode,  
          type:'',                 
          status: true,
          
        },
        contactInfo: data.contactInfo || [],
      };
      const projectObjId=[];
      selectedProjects.forEach(element => {
       
        vendorData.vendor.projectObjId.push(element.projId);
    });
      console.log("Vendor Create Data:", vendorData);

      const formData = new FormData();
      formData.append("VendorCreateData", JSON.stringify(vendorData));

      if (selectedVendorImg) {
        formData.append('vendLogo', selectedVendorImg);
      }

      const response = await VendorCreate(formData);
      console.log('Response:', response);
      navigate('/vendors');

    } catch (error) {
      console.error('Error creating vendor:', error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate("/vendors");
    }
  }, [navigate]);

  useEffect(() => {
    VendorInitData();
    getAllCountries();
  }, []);

  return (
    <div>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div className="flex justify-between">
        <Sidebar />
        <div className="mr-8 md:mr-24 mt-10 w-2/3 items-center">
          <div className="bg-gradient-to-r from-black to-neutral-400 p-3 rounded-lg font-bold text-white text-center text-3xl">
            <p>VENDOR CREATE</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-300 p-4 rounded-lg mt-5 w-full">
       
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Vendor Name</label>
                <input 
                  type="text"
                  {...register('vendName')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.vendName && <p className="text-red-500 text-sm">{errors.vendName.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Company Name</label>
                <input
                  type="text"
                  {...register('companyName')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">GST No</label>
                <input
                  type="text"
                  {...register('gstNo')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.gstNo && <p className="text-red-500 text-sm">{errors.gstNo.message}</p>}
              </div>
            </div>
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">PAN No</label>
                <input
                  type="text"
                  {...register('panNo')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.panNo && <p className="text-red-500 text-sm">{errors.panNo.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
            </div>
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Address</label>
                <input
                  type="text"
                  {...register('address')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">City</label>
                <input
                  type="text"
                  {...register('city')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Country</label>
                <select
                  {...register('country')}
                  className="w-full px-3 py-2 border rounded"
                >
                {Array.isArray(countries) && countries.map(country => (
                    <option key={country.id} value={country.id}>
                    {country.name}
                        </option>
                        ))}
                </select>
                {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
              </div>
            </div>
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">State</label>
                <input
                  type="text"
                  {...register('state')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">District</label>
                <input
                  type="text"
                  {...register('district')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Pincode</label>
                <input
                  type="text"
                  {...register('pincode')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
              </div>
            </div>
            <div className="mb-4 md:w-64 rounded-lg">
              <label className="block text-black">Vendor Type</label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border rounded"
              >
                {vendorTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>
            {/* Contact Information */}
            {/* Add Contact Info Fields Here */}
            {/* File Upload */}
            <div className="mb-4 md:w-64 rounded-lg">
              <label className="block text-black">Upload Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-black to-neutral-600 text-white px-5 py-3 rounded-lg"
              >
                CREATE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorCreate;
