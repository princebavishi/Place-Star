import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom'

const ViewQuiz = () => {
  const [AttemptedExams, setAttemptedExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalQuizzes, setTotalQuizzes] = useState(0);

  useEffect(() => {

    const fetchAttemptedExams = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://`+ import.meta.env.VITE_DB_HOST +`/api/student/quizzes/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response.data);
        setAttemptedExams(response.data);
        setTotalQuizzes(response.data.length);

      } catch (error) {
        // console.error('Error fetching exams:', error);
        toast.error("Something Went Wrong ! Please try again Later ");
      }
    };
    fetchAttemptedExams();
  }, []);
  const formateDate = (examdate) => {
    const isoString = examdate;
    const date = new Date(isoString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
  }
  const filteredQuizzes = AttemptedExams.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())

  );
  return (
    <>

      <div className="bg-white py-3">
        <h2 className="text-xl font-semibold mb-2 ml-2">Search Quiz</h2>
        <label className="flex flex-col">
          <input
            type="text"
            placeholder="Search Quiz"
            className="px-4 py-3  border-2 sm:w-1/4 w-full  border-slate-300 rounded-full focus:border-primary focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>

      <br/>
      <hr />
      <br/>

      <div className="bg-white w-full rounded-md ">
    
        <p className='text-secondary text-xl my-3'>Total Quizzes : {totalQuizzes}</p>
        <div className="overflow-x-auto flex flex-wrap">
          <div className="w-full w-10/20 rounded-md mb-4">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-primary text-light border">
                <tr className="divide-x divide-light">
                  <th className="text-left py-3 px-4 uppercase text-sm">No</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Subject</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Quiz</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Date</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Total Questions</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Total Marks</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Obtained Marks</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map((exam, index) => (
                  <tr key={index} className="divide-x hover:bg-slate-100 divide-light">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                    <Link to={`../view-given-quiz/${window.btoa(exam.quizID)}`}
                        className="text-primary">{exam.title}</Link>
                    </td>
                    <td className="py-3 px-4">{exam.subject}</td>
                    <td className="py-3 px-4">{formateDate(exam.date)}</td>
                    <td className="py-3 px-4">{exam.totalQuestions}</td>
                    <td className="py-3 px-4">{exam.totalMarks}</td>
                    <td className="py-3 px-4">{exam.obtainMarks}</td>
                    <td className="text-left py-3 px-4 ">
                      <Link to={`../view-given-quiz/${window.btoa(exam.quizID)}`}
                        className="text-light bg-primary text-lg  py-1 px-3 rounded-full mr-2">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filteredQuizzes.length == 0 ? (<p className='py-4 text-center w-full'>No any Attempted Quiz</p>) : ("")}
      </div>
    </>

  )
}

export default ViewQuiz