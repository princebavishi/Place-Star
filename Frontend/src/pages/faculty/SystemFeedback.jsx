import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const SystemFeedback = () => {
  const [feedback, setfeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email="hello@charusat.edu.in";
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://'+ import.meta.env.VITE_DB_HOST +'/api/faculty/feedback',{feedback, email} ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.status === 201){ //Created Code : 201
        setfeedback(''); 
        toast.success('Thank you for your feedback!');
      }
    }
  
   catch (error) {
      // Handle the error
      // console.error('Error submitting feedback:', error);
      toast.error('Error submitting feedback. Please try again.');
    }
  };
  return (
    <div className="py-4 text-secondary flex flex-col md:flex-row justify-between">
    <div className="bg-white rounded-lg  md:w-2/3">
      <label htmlFor="feedback" className="block text-lg font-bold mb-2">System Feedbacks</label>
      <form onSubmit={handleSubmit}>
      <textarea id="feedback" className="w-full p-4 border border-gray-300 rounded-lg mb-4" rows={10} placeholder="Write your Feedback Here"  required value={feedback}
            onChange={(e) => setfeedback(e.target.value)}/>
      <button className="bg-primary text-white py-2 px-8 rounded-full">Submit</button></form>
    </div>
    <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-1/3">
      <img src="../images/system.png" alt="Illustration" className="w-full h-auto"/>
    </div>

  </div>

  )
}

export default SystemFeedback