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
import { MdCancel } from "react-icons/md";

const Vendors = () => {
  const context = useContext(VendorContext);
  const { vendors, getVendors } = context;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorsPerPage] = useState(5);
  const { isOpened } = useSidebar();
  const [open, setOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getVendors();
    } else {
      navigate("/vendors");
    }
  }, [getVendors, navigate]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(vendors.length / vendorsPerPage);

  const onOpenModal = (vendor) => {
    setSelectedVendor(vendor);
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
    setSelectedVendor(null);
  };

  return (
    <>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div>
        <Sidebar />
        <div
          className={`content-transition ${
            isOpened ? "sidebar-opened mr-5" : "sidebar-closed mr-5"
          }`}
        >
          <div className="flex justify-end pt-14 pb-2">
            <div className="flex space-x-4 items-center mr-2">
              <input
                type="text"
                placeholder="Search..."
                className="p-3 rounded-2xl border-2 border-black"
              />
              <button
                className="flex items-center bg-green-600 rounded-2xl p-3 text-white font-semibold hover:bg-green-700 transition duration-300"
                onClick={() => navigate('/')}
              >
                <MdOutlineFileDownload className='h-6 w-6 mr-2' />
                Export to Excel
              </button>
              <button className="flex items-center bg-black text-white rounded-2xl p-3 font-semibold hover:bg-neutral-600" onClick={() => navigate('/vendor-create')}>
                <FaRegPlusSquare className="h-6 w-6 mr-2" />
                Create Vendor
              </button>
            </div>
          </div>
          <div className="pt-10">
            <table className={`w-full shadow-md`}>
              <thead className="bg-black rounded-t-lg">
                <tr>
                  <th className={`text-white px-4 py-4`}>Image</th>
                  <th className={`text-white px-4 py-4`}>Vendor Name</th>
                  <th className={`text-white px-4 py-4`}>Vendor Code</th>
                  <th className={`text-white px-4 py-4`}>GST Number</th>
                  <th className={`text-white px-4 py-4`}>Pan Number</th>
                  <th className={`text-white px-4 py-4`}>Status</th>
                  <th className={`text-white px-4 py-4`}>City</th>
                  <th className={`text-white px-4 py-4`}>District</th>
                  <th className={`text-white px-4 py-4`}>State</th>
                  <th className={`text-white px-4 py-4`}>Action</th>
                </tr>
              </thead>
              <tbody className="bg-white content-center">
                {currentVendors.map((vendor) => (
                  <tr key={vendor.id} className="p-5 border-b hover:bg-slate-100">
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
                      <button className="text-black hover:text-gray-800 p-2" onClick={() => onOpenModal(vendor)}>
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

        {open && selectedVendor && (
          <div
            onClick={onCloseModal}
            className={`fixed inset-0 flex justify-center items-center transition-colors ${
              open ? "visible bg-black/20" : "invisible"
            }`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`bg-white w-2/3 rounded-xl shadow-sm shadow-black p-6 transition-all ${
                open ? "scale-100 opacity-100" : "scale-125 opacity-0"
              }`}
            >
              <div className="flex items-center">
                <div className="px-8 w-1/3">
                  <img
                    src={selectedVendor.vendLogoUrl}
                    alt="Vendor"
                    className="h-36 w-36 rounded-full object-cover"
                  />
                  <h1 className="text-center">{selectedVendor.vendorName}</h1>
                </div>
                <div className="w-2/3">
                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">Status</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.status}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">Vendor Code</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.vendorCode}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">Company Name</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.companyName}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">Phone</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.phone}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">Email</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.email}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">GST Number</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.gstNo}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">Pan Number</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.panNo}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">Address</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.address}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">City</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.city}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">District</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.district}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">State</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.state}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">Country</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.country}</div>
                  </div>

                  <div className="flex pb-3">
                    <div className="w-1/3 font-semibold">PinCode</div>
                    <div className="">:</div>
                    <div className="pl-4">{selectedVendor.pincode}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={onCloseModal}
                className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
              >
                <MdCancel />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Vendors;