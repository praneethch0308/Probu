import { useState, useEffect } from "react";
import { TfiMenu } from "react-icons/tfi";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdFeaturedPlayList, MdTask } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaPeopleLine } from "react-icons/fa6";
import { GrDocumentUser } from "react-icons/gr";
import { GoOrganization } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authentication/AuthContext";

const menuItems = {
    HEAD: [
        { path: '/leaddashboard', icon: LuLayoutDashboard, label: 'Lead Dashboard' },
        { path: '/projects', icon: MdFeaturedPlayList, label: 'Projects' },
        { path: '/tasks', icon: MdTask, label: 'Tasks' },
        { path: '/clients', icon: IoPeople, label: 'Clients' },
        { path: '/employees', icon: FaUsers, label: 'Employees' },
        { path: '/teams', icon: FaPeopleLine, label: 'Teams' },
        { path: '/users', icon: FaPeopleLine, label: 'Users' },
        { path: '/vendors', icon: GrDocumentUser, label: 'Vendors' },
    ],
    MANAGER: [
        { path: '/manager-dashboard', icon: LuLayoutDashboard, label: 'Manager Dashboard' },
        { path: '/projects', icon: MdFeaturedPlayList, label: 'Projects' },
        { path: '/tasks', icon: MdTask, label: 'Tasks' },
        { path: '/clients', icon: IoPeople, label: 'Clients' },
        { path: '/employees', icon: FaUsers, label: 'Employees' },
        { path: '/teams', icon: FaPeopleLine, label: 'Teams' },
        { path: '/vendors', icon: GrDocumentUser, label: 'Vendors' },
    ],
    SYS_ADMIN: [
        { path: '/admin-dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
        { path: '/organizations', icon: GoOrganization, label: 'Organizations' },
    ],
    ADMIN: [
        { path: '/admin-dashboard', icon: LuLayoutDashboard, label: 'Admin Dashboard' },
        { path: '/projects', icon: MdFeaturedPlayList, label: 'Projects' },
        { path: '/clients', icon: IoPeople, label: 'Clients' },
        { path: '/employees', icon: FaUsers, label: 'Employees' },
        { path: '/teams', icon: FaPeopleLine, label: 'Teams' },
        { path: '/users', icon: FaPeopleLine, label: 'Users' },
        { path: '/vendors', icon: GrDocumentUser, label: 'Vendors' },
    ],
    ACCOUNT: [
        { path: '/projects', icon: MdFeaturedPlayList, label: 'Projects' },
        { path: '/tasks', icon: MdTask, label: 'Tasks' },
        { path: '/clients', icon: IoPeople, label: 'Clients' },
        { path: '/employees', icon: FaUsers, label: 'Employees' },
        { path: '/teams', icon: FaPeopleLine, label: 'Teams' },
        { path: '/users', icon: FaPeopleLine, label: 'Users' },
        { path: '/vendors', icon: GrDocumentUser, label: 'Vendors' },
    ],
};

const Sidebar = () => {
    const [opened, setOpened] = useState(true);
    const [selectedItem, setSelectedItem] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();
    const role = localStorage.getItem('role');

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarOpened');
        if (savedState !== null) {
            setOpened(JSON.parse(savedState));
        }
    }, []);

    const handleItemClick = (item) => {
        setSelectedItem(item.path);
        navigate(item.path);
    };

    const handleToggle = () => {
        const newState = !opened;
        setOpened(newState);
        localStorage.setItem('sidebarOpened', JSON.stringify(newState));
    };

    if (!menuItems[role]) {
        console.error(`Role ${role} not found in menuItems.`);
        return null;
    }

    return (
        <div>
            <div className="fixed mt-6 overflow-y-scroll flex">
                <div>
                    <div className={`bg-gradient-to-b from-black to-neutral-600 p-1 relative h-screen ${opened ? 'w-55' : 'w-16 md:w-55'}`}>
                        <TfiMenu className={`text-white cursor-pointer text-2xl rounded-md absolute top-3`} onClick={handleToggle} />
                        <ul className="mt-10">
                            {menuItems[role].map((item) => (
                                <li
                                    key={item.path}
                                    className={`mt-4 p-2   gap-x-2 flex items-center hover:cursor-pointer hover:bg-gradient-to-r from-black to-neutral-300 ${selectedItem === item.path ? 'bg-gradient from-black to-white' : ''}`}
                                    onClick={() => handleItemClick(item)}
                                >
                                    <span className="text-white text-2xl">{<item.icon />}</span>
                                    <span className={`text-xl text-white font-semibold ${!opened ? 'hidden' : ''}`}>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default Sidebar;
