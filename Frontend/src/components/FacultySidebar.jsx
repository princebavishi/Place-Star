import React from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import { HiHome, HiPlusCircle, HiBookOpen, HiChatAlt, HiLogout } from 'react-icons/hi';
import { IoMdSettings } from "react-icons/io";

const FacultySidebar = () => {
    const location = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();
    
    // alert(path)

    const handleLogout = async()=>{
        localStorage.removeItem("token");
        localStorage.clear();
        navigate("/")
    }


    return (
        <div className=" flex flex-col  bg-white text-gray-700 h-screen overflow-hidden">
            <div className="flex items-center justify-center p-4">
                <img src="../images/PlaceStar.png" width={200} alt="" />
            </div>
            <hr/>
            <nav className="flex-grow  py-4 px-6">
                <ul className='flex flex-col gap-2'>
                    <li className={`p-4 rounded-lg ${path == "/faculty" || path=="/faculty/" ? "bg-primary text-white":"" }  `}>
                        <Link
                            to="/faculty"
                        >
                            <div className="flex items-center space-x-2">
                                <HiHome className="w-5 h-5" />
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/faculty/add-quiz" ? "bg-primary text-white":"" }  `}>
                        <Link
                            to="./add-quiz"
                           
                        >
                            <div className="flex items-center space-x-2">
                                <HiPlusCircle className="w-5 h-5" />
                                <span>Add New Quiz</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/faculty/manage-quiz" || path=="/faculty/view-quiz/" ||path=="/faculty/view-quiz/:id"|| path=="/faculty/view-data" ? "bg-primary text-white":"" }  `}>
                        <Link
                            to="./manage-quiz"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <HiBookOpen className="w-5 h-5" />
                                <span>Manage Quiz</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/faculty/manage-feedbacks" ? "bg-primary text-white":"" }  `}>
                        <Link
                            to="./manage-feedbacks"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <HiChatAlt className="w-5 h-5" />
                                <span>Manage Feedbacks</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/faculty/system-feedbacks" ? "bg-white text-secondary":"" }  `}>
                        <Link
                            to="./system-feedbacks"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <IoMdSettings className="w-5 h-5" />
                                <span>System Feedbacks</span>
                            </div>
                        </Link>
                    </li>
                   
                   
                </ul>
            </nav>
            <div className="py-4 px-6 bg-blue-950">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2  text-white"
                >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};
export default FacultySidebar;
