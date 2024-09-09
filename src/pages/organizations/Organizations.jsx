import React, { useContext, useEffect, useState } from 'react'
import OrganizationContext from '../../context/organizations/OrganizationContext'
import Mainnav from '../../components/Mainnav';
import Sidebar from '../../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaRegPlusSquare } from 'react-icons/fa';
import { MdOutlineFileDownload } from 'react-icons/md';
import Aos from 'aos'
import 'aos/dist/aos.css'
import ExportToExcelButton from '../../components/ExcelButton';


const Organizations = () => {


    const context= useContext(OrganizationContext);
    const {organizations, getOrganizations}= context;
    const navigate = useNavigate();
    const [currentPage,setCurrentPage]= useState(1);
    const [organizationsPerPage]=useState(5);

    useEffect(() => {
        if (localStorage.getItem('token')) {
          getOrganizations();
        } else {
          navigate("/");
        }
      }, []);

      useEffect(()=>{
        Aos.init({duration:1000});
    })

      const indexOfLastOrganization = currentPage*organizationsPerPage;
      const indexOfFirstOrganization = indexOfLastOrganization-organizationsPerPage;
      const currentOrganizations = organizations.slice(indexOfFirstOrganization,indexOfLastOrganization);
      const paginate=(pageNumber)=> setCurrentPage(pageNumber);
      const totalPages = Math.ceil(organizations.length/organizationsPerPage);
    
  return (
    <div>
      <div>
      <div className="pb-10">
            <Mainnav/>
        </div>
        <div className='flex justify-between'>
            <Sidebar/>
            <div>
            <div className='flex justify-end p-10 pb-2'>   
      <div className="flex justify-evenly items-start w-1/2">
       <ExportToExcelButton tableId='organizations'/>
        <div className='flex justify-between bg-black rounded-2xl p-2 hover:bg-neutral-600'>
          <FaRegPlusSquare className='text-white h-5 w-5 mr-1 mt-1'/>
          <button className='text-white font-semibold' onClick={()=> navigate('/organization-create')}>Create Organization</button>
        </div>      
      </div>     
      </div>
                <table id='organiazations' className='overflow-x-scroll rounded-b-lg'>
                    <div className="pt-10 p-5">
      <table data-aos='fade-left'  className="mr-2 lg:mr-5 table-auto shadow-md">
        <thead className="bg-black rounded-t-lg">
          <tr>
            <th className="text-white px-6">Organization ID</th>
            <th className="text-white w-20 px-4">Organization Name</th>
            <th className="text-white px-4 ">Registration Date</th>
            <th className="text-white px-4">Status</th>
            <th className="text-white px-4">Last Payment Date</th>
            <th className="text-white px-4">Renewal Date</th>
            <th className="text-white px-4">Action</th>
          </tr>
        </thead>
        <tbody className="hover:bg-slate-100 content-center">
          {currentOrganizations.map((organization) => (
            <tr key={organization.id} className="p-5 border-2">
              <td className="text-center font-normal p-2">{organization.orgId}</td>
              <td className="text-center font-normal p-2 ">{organization.name}</td>
              <td className="text-center font-normal p-2">
                {new Date(organization.dateOfRegistration).toLocaleDateString()}
              </td>
              <td className="text-center font-normal">{organization.status}</td>
              <td className="text-center font-normal">
                {new Date(organization.lastPaymentDate).toLocaleDateString()}
              </td>
              <td className="text-center font-normal p-2">
                {new Date(organization.renewalDate).toLocaleDateString()}
              </td>
              <td className="items-center">
                <Link className="items-center" to={`/organizations/${organization.orgId}`}><FaEye/></Link>
              </td>
            </tr>
          ))}
        </tbody>

        
      </table>
      <div className ='mt-2 justify-center flex'>
        {Array.from({length:totalPages},(_,index)=>(
          <button
          key={index+1}
          onClick={()=> paginate(index+1)} 
          className={`px-3 py-1 mx-1 ${currentPage===index+1? 'bg-black text-white': 'bg-white text-black'} border border-black rounded-sm`}
          >
            {index+1}
          </button>
        ))}
      </div>
        </div> 
                </table>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Organizations
