import React, { useState, useEffect } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import StudentSidebar from './StudentSidebar'
import Dashboard from '../pages/student/Dashboard';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ViewQuiz from '../pages/student/ViewQuiz';
import GivenFeedback from '../pages/student/GivenFeedback';
import SystemFeedback from '../pages/student/SystemFeedback';
import ViewGivenQuiz from '../pages/student/ViewGivenQuiz';
import StartQuiz from '../pages/student/StartQuiz';
import Error404 from '../pages/Error404';
import { parseJwt } from '../model/JwtDecode';
import { PiStudent } from "react-icons/pi";



function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [UserName, setUserName] = useState();
    const navigate = useNavigate();




    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const handleAuthUser = async () => {
        ``
        if (localStorage.getItem("token")) {
            const token = localStorage.getItem("token");
            const parse = parseJwt(token);
            setUserName(parse.username.toString().toUpperCase())
            if (parse.role == "Student") {
                navigate("/student");
            }
            else if (parse.role == "Faculty") {
                navigate("/faculty");
            }
            else {
                navigate("/");
            }
        }
        else {
            navigate("/");
        }
    }

    useEffect(() => {
        handleAuthUser();
        if (screen.width < 960) {
            setSidebarOpen(false)
        }
    }, [navigate])

    return (
        <>
            <div className='grid grid-cols-5'>

                <div className={`sm:col-span-1 col-span-3 ${sidebarOpen ? 'block' : 'hidden'}`}>
                    <StudentSidebar />
                </div>

                <div className={`${sidebarOpen ? 'sm:col-span-4 col-span-2 ' : ' sm:col-span-5 col-span-5'}  h-screen bg-gray-100 overflow-y-auto px-3 overflow-x-hidden`}>

                    <div className='z-10 mt-2 rounded-xl bg-light text-secondary  flex justify-between items-center sticky top-2 w-full p-4 '>
                        <div className='flex justify-center items-center sm:gap-5 gap-5'>
                            <GiHamburgerMenu className='text-2xl  cursor-pointer ' onClick={toggleSidebar} />
                            <h2 className='font-semibold sm:text-2xl text-lg'>
                                <Routes>
                                    <Route path='/' element={'Dashboard'}></Route>
                                    <Route path='/view-quiz' element={'View Quiz'}></Route>
                                    <Route exact path='/view-given-quiz/:id' element={'View Quiz'}></Route>
                                    <Route path='/given-feedback' element={'Given Feedback'}></Route>
                                    <Route path='/system-feedback' element={'System Feedback'}></Route>
                                    <Route path='/start-quiz/:id' element={'Start Quiz'}></Route>
                                </Routes>

                            </h2>
                        </div>
                        <div className='flex justify-center items-center gap-4'>
                            <p className='font-medium text-xl'>{UserName}</p>
                            {/* <img src="../vite.svg" alt="Image" className='rounded-full' /> */}
                            <div className='p-2 sm:text-2xl text-lg bg-white text-primary rounded-full'><PiStudent /></div>
                        </div>
                    </div>

                    <br />

                    <div>
                        <div className='text-secondary p-4 bg-white rounded-xl'>
                            <Routes>
                                <Route path='/' element={<Dashboard />}></Route>
                                <Route path='/view-quiz' element={<ViewQuiz />}></Route>
                                <Route exact path='/view-given-quiz/:id' element={<ViewGivenQuiz />}></Route>
                                <Route path='/given-feedback' element={<GivenFeedback />}></Route>
                                <Route path='/system-feedback' element={<SystemFeedback />}></Route>
                                <Route path='/start-quiz/:id' element={<StartQuiz />}></Route>
                                <Route path='*' element={<Error404 />}></Route>
                            </Routes>
                        </div>

                    </div>

                </div>
            </ div>

        </>
    );
}

export default StudentDashboard;
