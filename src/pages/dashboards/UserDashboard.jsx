import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import Mainnav from '../../components/Mainnav';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/sidebar/SidebarContext';
Chart.register(...registerables);

const UserDashboard = () => {
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const chartRef = useRef(null); 
  const {isOpened}= useSidebar(); 

  const user = {
    username: localStorage.getItem('loggedUser'),
    orgId: localStorage.getItem('orgId')
  };

  useEffect(() => {
    loadData(0, pageSize);
    getUserTaskStatusNameAndCount();
  }, [pageSize]);

  useEffect(() => {
    if (taskStatuses.length) {
      const taskStatusNames = taskStatuses.map(ts => ts.statusName);
      const taskStatusCount = taskStatuses.map(ts => ts.count);
      renderChart(taskStatusNames, taskStatusCount);
    }
  }, [taskStatuses]);

  const accessToken = localStorage.getItem('token');

  const loadData = (pageIndex, pageSize) => {
    axios.get(`${process.env.REACT_API_URL}/task/mgr/employees/${user.username}/${user.orgId}/${pageIndex}/${pageSize}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      const data = response.data;
      setDataSource(data.Task);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    });
  };

  const getUserTaskStatusNameAndCount = () => {
    axios.get(`${process.env.REACT_API_URL}/dashboard/mgr/${user.username}/${user.orgId}`, {
      params: { username: user.username, orgId: user.orgId },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      setTaskStatuses(response.data.taskStatusCount);
    });
  };

  const renderChart = (statusName, taskCount) => {
    const ctx = document.getElementById('barChart').getContext('2d');

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: statusName,
        datasets: [{
          label: '# of Tasks',
          data: taskCount,
          backgroundColor: 'skyblue',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        maintainAspectRatio: false
      }
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadData(newPage, pageSize);
    };

  const navigateToTaskDetails = (taskName) => {
    console.log('taskName', taskName);
    
  };

  return (
    <div className="container mx-auto">
        <div className="pb-10">
        <Mainnav />
      </div>
      <div>
        <Sidebar className="" />
        <div className={`content-transition  ${isOpened ? "sidebar-opened mr-5" : "sidebar-closed mr-5"}`}>
          <div className='flex justify-center w-full'>
          <div className="w-1/2 ml-10 mt-8">
          <div style={{ width: '70%', height: '300px' }}>
            <canvas id="barChart"></canvas>
          </div>
        </div>
        <div className="w-1/2 ">
          <div className="card">
          <ul className="list-group mt-24 grid grid-cols-1 justify-center md:grid-cols-2  gap-4">
                {taskStatuses.map(task => (
                <li
                  key={task.statusName}
                  className="list-group-item flex font-semibold shadow-sm shadow-black justify-between items-center cursor-pointer border mr-10 rounded-md  p-3"
                  onClick={() => navigateToTaskDetails(task.statusName)}>
                  <span>{task.statusName}</span>
                  <span className="badge bg-black text-white rounded-full px-2">{task.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div> 
        </div>
      </div>
      <div className={`content-transition  ${isOpened ? "sidebar-opened mr-5" : "sidebar-closed mr-5"}`}>
        <div className="overflow-x-auto">
          <table className="w-full  bg-white">
            <thead>
              <tr className='bg-black text-white'>
                <th className="py-2 px-1 border-b">Task ID</th>
                <th className="py-2 px-1 border-b">Title</th>
                <th className="py-2 px-1 border-b">Project</th>
                <th className="py-2 px-1 border-b">Assigned To</th>
                <th className="py-2 px-1 border-b">Created Date</th>
                <th className="py-2 px-1 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataSource.map(row => (
                <tr key={row.taskId}>
                  <td className="py-2 px-1 border-b">{row.taskId}</td>
                  <td className="py-2 px-1 border-b">{row.title}</td>
                  <td className="py-2 px-1 border-b">{row.project}</td>
                  <td className="py-2 px-1 border-b">{row.assignedTo}</td>
                  <td className="py-2 px-1 border-b">{new Date(row.createdDate).toLocaleDateString()}</td>
                  <td className="py-2 px-1 border-b">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 ml-64">
          <div className="flex items-center">
            <span className="mr-2 border p-2 rounded-md">Items per page:</span>
            <select className="border px-2 py-2 rounded-md" value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value)); handlePageChange(0); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <div>{currentPage * pageSize + 1} - {(currentPage + 1) * pageSize <= totalItems ? (currentPage + 1) * pageSize : totalItems} of {totalItems}</div>
          <div className="flex items-center">
            <button  onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} className="mr-2 bg-black text-white p-2 rounded-md">Previous</button>
            <span>{currentPage + 1} / {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} className="ml-2 bg-black text-white p-2 rounded-md">Next</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserDashboard;
