import { FaRegPlusSquare, FaEye, FaPencilAlt } from "react-icons/fa";
import { MdCancel, MdOutlineFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Mainnav from "../../components/Mainnav";
import ClientContext from "../../context/clients/ClientContext";
import Aos from "aos";
import "aos/dist/aos.css";

function Client() {
  const navigate = useNavigate();
  const context = useContext(ClientContext);
  const { clients, getClients } = context;

  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);

  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    setSelectedClient(null);
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    onOpenModal();
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getClients();
    } else {
      navigate("/clients");
    }
  }, [getClients, navigate]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(clients.length / clientsPerPage);

  return (
    <>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div className="flex justify-between">
        <Sidebar />
        <div className="ml-20">
          <div className="flex justify-end pt-14 pb-2">
            <div className="flex space-x-4 items-center mr-20">
            <input
                type="text"
                placeholder="Search..."
                className="p-3 rounded-2xl border-2 border-black"
              />
              <button
                className="flex items-center bg-green-600 rounded-2xl p-3 text-white font-semibold hover:bg-green-700 transition duration-300"
                onClick={() => navigate("/")}
              >
                <MdOutlineFileDownload className="h-6 w-6 mr-2" />
                Export to Excel
              </button>
              <button
                className="flex items-center bg-black text-white rounded-2xl p-3 font-semibold hover:bg-neutral-600"
                onClick={() => navigate("/client-create")}
              >
                <FaRegPlusSquare className="h-5 w-5 mr-2" />
                Create Client
              </button>
            </div>
          </div>
          <div className="pt-10 p-5">
            <table className="w-2/3 table-auto shadow-md">
              <thead className="bg-black rounded-t-lg">
                <tr>
                  <th className="text-white px-5 ">Image</th>
                  <th className="text-white px-5 ">Status</th>
                  <th className="text-white px-5 ">Phone Number</th>
                  <th className="text-white px-5 ">Client Name</th>
                  <th className="text-white px-5 ">Email</th>
                  <th className="text-white px-5 ">City</th>
                  <th className="text-white px-5 ">District</th>
                  <th className="text-white px-5 ">State</th>
                  <th className="text-white px-5 ">Action</th>
                </tr>
              </thead>
              <tbody className="bg-slate-50 content-center">
                {currentClients.map((client) => (
                  <tr
                    key={client.image}
                    className="p-5 border-b hover:bg-slate-100 "
                  >
                    <td className="text-center font-normal p-4">
                      <img
                        src={client.logoUrl}
                        alt="Client"
                        className="h-10 w-10 rounded-full"
                      />
                    </td>
                    <td className="text-center font-normal p-2">{client.status}</td>
                    <td className="text-center font-normal p-2">
                      {client.phoneNumber}
                    </td>
                    <td className="text-center font-normal p-2">
                      {client.clientName}
                    </td>
                    <td className="text-center font-normal p-2">{client.email}</td>
                    <td className="text-center font-normal p-2">{client.city}</td>
                    <td className="text-center font-normal p-2">
                      {client.district}
                    </td>
                    <td className="text-center font-normal p-2">{client.state}</td>
                    <td className="text-center items-center">
                      <button
                        onClick={() => handleViewClient(client)}
                        className="text-black hover:underline"
                      >
                        <FaEye />
                      </button>
                      <button className="text-black hover:text-gray-800 p-2">
                                                    <FaPencilAlt onClick={() => { navigate('/client-update') }} />
                                                </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 mx-1 border border-black rounded-sm ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
            {open && selectedClient && (
            <div 
              onClick={onCloseModal}
              className={`fixed inset-0 ml-28 mt-5 flex justify-center items-center transition-colors ${
                open ? "visible bg-black/20" : "invisible"
              }`}
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-2/3 rounded-xl shadow p-6 transition-all ${
                  open ? "scale-100 opacity-100" : "scale-125 opacity-0"
                }`}
              >
                <div className="flex items-center ">
                <div className="px-8 w-1/3">
                <img
                        src={selectedClient.logoUrl}
                        alt="Client"
                        className="h-36 w-36 rounded-full"
                      />
                       <h1 className="text-center mt-2">{selectedClient.clientName}</h1>
                      </div>
                  <div className="w-2/3">
                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Status</div>
                  <div className=" ">:</div>
                  <div className=" pl-4">{selectedClient.status}</div>
                  </div>
                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">GST NO</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.gstNo}</div>
                  </div>

                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">PAN NO</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.panNo}</div>
                  </div>

                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Phone Number</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.phoneNumber}</div>
                  </div>

                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Email</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.email}</div>
                  </div>
                  
                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Website</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.website}</div>
                  </div>
                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Address</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.address}</div>
                  </div>

                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">City</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.city}</div>
                  </div>
                 <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">District</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.district}</div>
                  </div>

                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">State</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.state}</div>
                  </div>

                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Country</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.country}</div>
                  </div>

                  <div className="flex pb-3">
                  <div className="w-1/3 font-semibold">Pincode</div>
                  <div className="">:</div>
                  <div className="pl-4">{selectedClient.pincode}</div>
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
      </div>
    </>
  );
}

export default Client;
