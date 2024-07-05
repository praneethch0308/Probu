import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Signin from './components/auth/Signin'
import Home from './pages/Home'
import Organizations from './pages/organizations/Organizations'
import OrganizationState from './context/organizations/OrganizationState'
import OrganizationCreate from './pages/organizations/organizationCreate'
import Projects from './pages/projectss/Projects'
import { ProjectProvider } from './context/projects/ProjectState'
import ProjectForm from './pages/projectss/ProjectCreate'
import Client from './pages/clients/Clients'
import ClientState from './context/clients/ClientState'
import CreateClient from './pages/clients/ClientCreate'
import Tasks from './pages/tasks/Tasks'
import TaskState from './context/tasks/TaskState'

import User from './pages/users/Users'
import UserUpdate from './pages/users/UserUpdate'
import Vendors from './pages/vendors/Vendors'
import VendorCreate from './pages/vendors/VendorCreate'
import VendorState from './context/vendors/VendorState'
import EmployeeState from './context/employees/EmployeeState'
import Employees from './pages/employees/Employees'
import EmployeeCreate from './pages/employees/EmployeeCreate'
import { AuthProvider } from './context/authentication/AuthState'

import Teams from './pages/teams/Teams'
import TeamState from './context/teams/TeamState'
import ProjectCreate2 from './pages/projectss/ProjectCreate2'
import ProjectUpdate from './pages/projectss/ProjectUpdate'
import VendorUpdate from './pages/vendors/VendorUpdate'
import ClientUpdate from './pages/clients/ClientUpdate'
import TeamCreate from './pages/teams/TeamCreate'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VendorState>
          <ProjectProvider>
            <OrganizationState>
              <ClientState>
                <TaskState>
                  <EmployeeState>
                    <TeamState>
                      <Routes>
                        <Route path='/' element={<Landing />} />
                        <Route path='/signin' element={<Signin />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/organizations' element={<Organizations />} />
                        <Route path='/organization-create' element={<OrganizationCreate />} />
                        <Route path='/projects' element={<Projects />} />
                        <Route path='/project-create' element={<ProjectForm />} />
                        <Route path='/project-create2' element={<ProjectCreate2 />} />
                        <Route path='/project-update' element={<ProjectUpdate />} />
                        <Route path='/clients' element={<Client />} />
                        <Route path='/client-create' element={<CreateClient />} />
                        <Route path='/client-update' element={<ClientUpdate />} />
                        <Route path='/tasks' element={<Tasks />} />
                        {/* <Route path='/task-create' element={<TaskCreate />} /> */}
                        <Route path='/users' element={<User />} />
                        <Route path='/user-update' element={<UserUpdate />} />
                        <Route path='/vendors' element={<Vendors />} />
                        <Route path='/vendor-create' element={<VendorCreate />} />
                        <Route path='/vendor-update' element={<VendorUpdate />} />
                        <Route path='/employees' element={<Employees />} />
                        <Route path='/employee-create' element={<EmployeeCreate />} />
                        <Route path='/teams' element={<Teams />} />
                        <Route path='/team-create' element={<TeamCreate />} />
                      </Routes>
                    </TeamState>
                  </EmployeeState>
                </TaskState>
              </ClientState>
            </OrganizationState>
          </ProjectProvider>
        </VendorState>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
