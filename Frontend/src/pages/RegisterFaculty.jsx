import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaRegCircleUser } from "react-icons/fa6";
import { FaBuildingUser } from "react-icons/fa6";
// import { MdOutlineFormatListNumbered } from "react-icons/md";
// import { RiAccountBoxLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { toast } from 'react-toastify';


const RegisterFaculty = () => {
  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  // const [semester, setSemester] = useState('');
  // const [batch, setBatch] = useState('');
  const [password, setPassword] = useState('');
  const [Confirmpassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState();
  const [otpShow, setOtpShow] = useState(false);
  const [OTP, setOTP] = useState("");
  const [submitting, setsubmitting] = useState(false);
  // const navigate = useNavigate();
  const domain = '@charusat.ac.in';

  const handleEmailChange = (e) => {
    const inputValue = e.target.value;
    const [localPart] = inputValue.split('@');
    setEmail(localPart);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password == Confirmpassword && password.length > 7) {
      try {
        setsubmitting(true);
        const jsonData = getFormData();
        console.log(jsonData);

        const response = await axios.post('http://' + import.meta.env.VITE_DB_HOST + '/api/register/register_faculty', jsonData);
        if (response.status == 200) {

          toast.success("Register Successfully !");
          handleToggle();
          // toast.success("Verify Your OTP !");
          setsubmitting(false)
        }

      } catch (error) {
        if (error.response.status == 400) {
          toast.warn("Password Length must be Greater than 7 Letters")
        }
        else {
          toast.error("Registration Failed!")
        }
        setsubmitting(false)
        // console.error(error);

      }
    } else if (password.length < 7) {
      toast.error("Password Length must be Greater than 7 Letters");
    }
    else {
      toast.error("Password is not match with Confirm password");
    }
  };
  const handleToggle = () => {
    setOtpShow(!otpShow);
  };
  const getFormData = () => {
    const formData = {
      firstname,
      middlename,
      lastname,
      email,
      department,
      username,
      password
    };

    for (const [key, value] of Object.entries(formData)) {
      if (value === undefined) {
        console.log("undefine");
        throw new Error(Error, `${key} is undefined`);
      }
    }

    return JSON.stringify(formData);
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    const OTPVerifyData = { email: `${email}${domain}`, OTP }
    if (OTP != "" && OTP.length == 6) {

      try {

        const response = await axios.post('http://' + import.meta.env.VITE_DB_HOST + '/api/register/verifyOTP', OTPVerifyData);
        if (response.status == 200) {
          toast.success("Verified Successfully !")
          navigate("/")

        }
        else {
          toast.error("Something Went Wrong !");
        }


      } catch (error) {
        if (error.response.status == 401) {
          toast.error("Invalid OTP");
        }
        // console.log(error);

      }

    }
    else {
      toast.error("Invalid OTP");
    }

  }

  return (
    <>
      <div className="overflow-hidden flex h-screen md:flex-row flex-col items-center justify-center">
        {(otpShow) && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold">Enter OTP</h2>
              <input
                type="text"
                placeholder='OTP'
                value={OTP}
                onChange={(e) => { setOTP(e.target.value) }}
                className='p-4 outline-none border-slate-400 rounded-lg w-full border'
              />
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={handleOTPVerify}
                  className="bg-primary text-white font-semibold py-2 px-4 rounded"
                >
                  Verify
                </button>
                {/* <button
                  className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
                  onClick={handleToggle}
                >
                  Cancel
                </button> */}
              </div>
            </div>
          </div>
        )}
        <div className="overflow-y-scroll bg-white text-secondary h-full w-screen">
          <div className="md:flex-row flex-col items-center hidden lg:flex md:flex justify-between">
            <img src='./images/image_charusat.png' alt="charusat" className="h-20 m-5" />
            <img src='./images/image_depstar.png' alt="depstar" className="h-20 m-5" />
          </div>
          <div className='flex w-full justify-center items-center'>
            <img src="./images/PlaceStar.png" width={300} alt="" />
          </div>

          <div className='sm:px-20 px-0 mt-4'>
            <h1 className="font-bold text-3xl md:text-4xl mb-6 py-1 my-1 border-b-2 text-center">
              Register
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
              <div className="flex md:flex-row flex-col mb-4  w-full gap-4">
                <div className="flex flex-col md:w-1/2 w-2/3 self-center">
                  <label htmlFor="firstname" className="mb-2 ml-2 flex md:flex-row flex-col place-items-center">
                    <FaRegCircleUser className='mr-2 size-6' />First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="First name"
                    className="px-4 py-4 border-2 border-slate-300 rounded-full w-full focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col md:w-1/2 w-2/3 self-center">
                  <label htmlFor="middlename" className="mb-2 ml-2 flex md:flex-row flex-col place-items-center">
                    <FaRegCircleUser className='mr-2 size-6' />Middle Name
                  </label>
                  <input
                    type="text"
                    id="middlename"
                    value={middlename}
                    onChange={(e) => setMiddlename(e.target.value)}
                    placeholder="Middle name"
                    className="px-4 py-4 border-2 border-slate-300 rounded-full w-full focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col md:w-1/2 w-2/3 self-center">
                  <label htmlFor="lastname" className="mb-2 ml-2 flex md:flex-row flex-col place-items-center">
                    <FaRegCircleUser className='mr-2 size-6' />Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Last name"
                    className="px-4 py-4 border-2 border-slate-300 rounded-full w-full focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div className="md:w-1/4 w-2/3 self-center">
                  <label className="flex flex-col">
                    <span className="mb-2 ml-2 flex md:flex-row flex-col place-items-center">
                      <FaBuildingUser className='mr-2 size-6' />Department
                    </span>
                    <select
                      name="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className="px-4 py-4 border-2 border-slate-300 rounded-full focus:border-primary focus:outline-none"
                    >
                      <option disabled selected value="">Select Department</option>

                      <option value="CE">CE</option>
                      <option value="IT">IT</option>
                      <option value="CSE">CSE</option>
                    </select>
                  </label>
                </div>
              </div>


              <div className='flex md:flex-row flex-col md:gap-4 gap-2 w-full'>

                <div className="flex flex-col  md:w-1/3 w-2/3 self-center">
                  <label htmlFor="email" className="mb-2 ml-2 flex md:flex-row flex-col place-items-center">
                    <MdEmail className='size-6' />Email
                  </label>
                  <div className="flex pr-4">
                    <input
                      type="text"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      className="w-1/2 px-4 py-4 border-2 border-slate-300 rounded-l-full focus:border-primary focus:outline-none md:text-base text-xs"
                      required
                    />
                    <span className="lg:w-1/2 w-1/2 px-4 py-4 bg-slate-100 border-2 border-l-0 border-slate-300 rounded-r-full md:text-base text-xs self-center">
                      {domain}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:w-1/2 w-2/3 self-center">
                  <label htmlFor="username" className="mb-2 ml-2 flex md:flex-row flex-col place-items-center">
                    <FaRegCircleUser className='mr-2 size-6' />Username /Faculty ID
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Last name"
                    className="px-4 py-4 border-2 border-slate-300 rounded-full w-full focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col  md:w-1/3 w-2/3 self-center">
                  <label htmlFor="password" className="mb-2 ml-2 flex md:flex-row flex-col place-items-center">
                    <RiLockPasswordLine className='mr-2 size-6' />Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="px-4 py-4 border-2 border-slate-300 rounded-full max-w-full focus:border-primary focus:outline-none"
                    required
                  />
                </div>


                <div className="flex flex-col  md:w-1/3 w-2/3 self-center">
                  <label htmlFor="password" className="mb-2 ml-2 flex md:flex-row flex-col place-items-center">
                    <RiLockPasswordLine className='mr-2 size-6' />Confirm Password
                  </label>
                  <input
                    type="password"
                    id="Confirmpassword"
                    value={Confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Your Confirm password"
                    className="px-4 py-4 border-2 border-slate-300 rounded-full max-w-full focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center w-full mt-6">
                <button

                  type="submit"
                  className="w-full m-4 sm:w-1/3 md:w-1/2 lg:w-1/6 bg-primary text-light font-medium text-lg px-6 py-3 rounded-full shadow-xl hover:bg-primary-dark transition-colors"
                >
                  {submitting ? "Loading..." : "Register"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterFaculty;