import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorContext from "../../context/vendors/VendorContext";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaEye, FaPencilAlt, FaRegPlusSquare } from "react-icons/fa";
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useSidebar } from "../../context/sidebar/SidebarContext";

const Vendors = () => {
  const context = useContext(VendorContext);
  const { vendors, getVendors } = context;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorsPerPage] = useState(5);
  const {isOpened}= useSidebar();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getVendors();
    } else {
      navigate("/vendors");
    }
  }, []);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(vendors.length / vendorsPerPage);

  return (
    <div>
      <div className="pb-10">
        <Mainnav />
      </div>

      <div>
        <Sidebar />
        <div className={`content-transition  ${isOpened ? "sidebar-opened mr-5" : "sidebar-closed mr-5"}`}>
          <div className="flex justify-end pt-14 pb-2">
            <div className="flex space-x-4 items-center mr-2">
              <input
                type="text"
                placeholder="Search..."
                className="p-3 rounded-2xl border-2 border-black"
              />
              <button
                className="flex items-center bg-green-600 rounded-2xl p-3 text-white font-semibold hover:bg-green-700 transition duration-300"
                onClick={() => navigate('/')}>
                <MdOutlineFileDownload className='h-6 w-6 mr-2' />
                Export to Excel
              </button>
              <button className="flex items-center bg-black text-white rounded-2xl p-3 font-semibold hover:bg-neutral-600" onClick={() => navigate('/vendor-create')}>
                <FaRegPlusSquare className="h-6 w-6 mr-2" />
                Create Vendor
              </button>
            </div>
          </div>
          <div className="pt-10 p-5 flex justify-center">
            <table className="w-full table-auto shadow-md">
              <thead className="bg-black rounded-t-lg">
                <tr>
                  <th className="text-white py-2 px-5">Image</th>
                  <th className="text-white px-5">Vendor Name</th>
                  <th className="text-white px-5">Vendor Code</th>
                  <th className="text-white px-5">GST Number</th>
                  <th className="text-white px-5">Pan Number</th>
                  <th className="text-white px-5">Status</th>
                  <th className="text-white px-5">City</th>
                  <th className="text-white px-5">District</th>
                  <th className="text-white px-5">State</th>
                  <th className="text-white px-5">Action</th>
                </tr>
              </thead>
              <tbody className="bg-slate-50 content-center">
                {currentVendors.map((vendor) => (
                  <tr key={vendor.id} className="p-5 border-b">
                    <td className="text-center font-normal p-4">
                      <img
                        src={vendor.vendLogoUrl}
                        alt="Vendor"
                        className="h-10 w-10 object-cover rounded-full"
                      />
                    </td>
                    <td className="text-center font-normal p-2">{vendor.vendorName}</td>
                    <td className="text-center font-normal p-2">{vendor.vendorCode}</td>
                    <td className="text-center font-normal p-2">{vendor.gstNo}</td>
                    <td className="text-center font-normal p-2">{vendor.panNo}</td>
                    <td className="text-center font-normal p-2">{vendor.status}</td>
                    <td className="text-center font-normal p-2">{vendor.city}</td>
                    <td className="text-center font-normal p-2">{vendor.district}</td>
                    <td className="text-center font-normal p-2">{vendor.state}</td>
                    <td className="text-center items-center">
                      <button className="text-black hover:text-gray-800 p-2">
                        <FaEye />
                      </button>
                      <button className="text-black hover:text-gray-800 p-2" onClick={() => { navigate('/vendor-update') }}>
                        <FaPencilAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-9 flex justify-center'>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-white text-black'} border border-black rounded-sm`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendors;
