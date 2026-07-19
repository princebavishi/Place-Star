-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2024 at 07:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `charusat_internship_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `ClassID` int(11) NOT NULL,
  `ClassName` varchar(255) NOT NULL,
  `TeacherID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classexams`
--

CREATE TABLE `classexams` (
  `ClassID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classstudents`
--

CREATE TABLE `classstudents` (
  `ClassID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `examassignments`
--

CREATE TABLE `examassignments` (
  `AssignmentID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `AssignedDate` date NOT NULL,
  `DueDate` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `ExamID` int(11) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Subject` varchar(100) DEFAULT NULL,
  `Number_of_Questions` int(11) DEFAULT NULL,
  `Exam_Total_Marks` int(11) DEFAULT NULL,
  `Status` enum('Not Started','Started','Completed') NOT NULL DEFAULT 'Not Started',
  `ExamDate` date DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Feedback` text DEFAULT NULL,
  `CreatorID` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sem` enum('all','SEM 1','SEM 2','SEM 3','SEM 4','SEM 5','SEM 6','SEM 7','SEM 8') NOT NULL DEFAULT 'all',
  `className` enum('all','1CE','2CE','3CE','4CE','5CE','6CE','7CE','8CE','1IT','2IT','3IT','4IT','5IT','6IT','7IT','8IT','1CSE','2CSE','3CSE','4CSE','5CSE','6CSE','7CSE','8CSE') DEFAULT NULL,
  `batch` enum('all','A','B','C','D') NOT NULL DEFAULT 'all'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_logs`
--

CREATE TABLE `exam_logs` (
  `LogID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Status` enum('Attempted','Not Attempted') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questionanswers`
--

CREATE TABLE `questionanswers` (
  `AnswerID` int(11) NOT NULL,
  `SubmissionID` int(11) NOT NULL,
  `QuestionID` int(11) NOT NULL,
  `AnswerText` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questionoptions`
--

CREATE TABLE `questionoptions` (
  `OptionID` int(11) NOT NULL,
  `QuestionID` int(11) NOT NULL,
  `OptionA` varchar(255) DEFAULT NULL,
  `OptionB` varchar(255) DEFAULT NULL,
  `OptionC` varchar(255) DEFAULT NULL,
  `OptionD` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `QuestionID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL,
  `QuestionText` text NOT NULL,
  `Mark` int(11) DEFAULT NULL,
  `QuestionType` enum('Multiple Choice','True/False','Short Answer') NOT NULL,
  `Correct_Option` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quizsubmissions`
--

CREATE TABLE `quizsubmissions` (
  `SubmissionID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `SubmissionDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_feedback`
--

CREATE TABLE `quiz_feedback` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `studentname` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_quiz_details`
--

CREATE TABLE `student_quiz_details` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `total_questions` int(11) DEFAULT NULL,
  `total_marks` int(11) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `systemlogs`
--

CREATE TABLE `systemlogs` (
  `LogID` int(11) NOT NULL,
  `LogDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `UserID` int(11) DEFAULT NULL,
  `ActionTaken` text DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `systemsettings`
--

CREATE TABLE `systemsettings` (
  `SettingID` int(11) NOT NULL,
  `SettingName` varchar(100) NOT NULL,
  `SettingValue` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('Admin','Faculty','Student') NOT NULL,
  `sem` enum('all','SEM 1','SEM 2','SEM 3','SEM 4','SEM 5','SEM 6','SEM 7','SEM 8') NOT NULL DEFAULT 'all',
  `class` enum('all','1CE','2CE','3CE','4CE','5CE','6CE','7CE','8CE','1IT','2IT','3IT','4IT','5IT','6IT','7IT','8IT','1CSE','2CSE','3CSE','4CSE','5CSE','6CSE','7CSE','8CSE') NOT NULL DEFAULT 'all',
  `batch` enum('all','A','B','C','D') NOT NULL DEFAULT 'all',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `OTP` varchar(6) DEFAULT NULL,
  `Status` enum('Active','Inactive','Suspended') NOT NULL DEFAULT 'Active',
  `AccountStatus` enum('Verified','Not Verified') NOT NULL DEFAULT 'Not Verified'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FirstName`, `MiddleName`, `LastName`, `Email`, `Username`, `Password`, `Role`, `sem`, `class`, `batch`, `created_at`, `updated_at`, `OTP`, `Status`, `AccountStatus`) VALUES
(1, '', NULL, '', '', 'admin', 'admin', 'Admin', 'all', 'all', 'all', '2024-05-22 06:08:02', '2024-05-22 06:08:02', NULL, 'Active', 'Not Verified'),
(2, '', NULL, '', '', 'faculty', 'faculty', 'Faculty', 'all', 'all', 'all', '2024-05-22 07:24:19', '2024-05-22 07:24:19', NULL, 'Active', 'Not Verified'),
(3, '', NULL, '', '', 'student', 'student', 'Student', 'SEM 4', '4CE', 'A', '2024-05-22 07:24:35', '2024-06-08 06:28:09', NULL, 'Active', 'Not Verified'),
(5, '', NULL, '', '', '23DIT002', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(6, '', NULL, '', '', '23DIT003', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(7, '', NULL, '', '', '23DIT004', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(8, '', NULL, '', '', '23DIT005', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(9, '', NULL, '', '', '23DIT006', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(10, '', NULL, '', '', '23DIT007', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(11, '', NULL, '', '', '23DIT008', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(12, '', NULL, '', '', '23DIT009', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(13, '', NULL, '', '', '23DIT010', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(14, '', NULL, '', '', '23DIT011', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(15, '', NULL, '', '', '23DIT012', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(16, '', NULL, '', '', '23DIT013', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(17, '', NULL, '', '', '23DIT014', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(18, '', NULL, '', '', '23DIT015', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(19, '', NULL, '', '', '23DIT016', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(20, '', NULL, '', '', '23DIT017', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(21, '', NULL, '', '', '23DIT019', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(22, '', NULL, '', '', '23DIT020', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(23, '', NULL, '', '', '23DIT021', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(24, '', NULL, '', '', '23DIT022', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(25, '', NULL, '', '', '23DIT023', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(26, '', NULL, '', '', '23DIT024', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(27, '', NULL, '', '', '23DIT025', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(28, '', NULL, '', '', '23DIT026', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(29, '', NULL, '', '', '23DIT027', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(30, '', NULL, '', '', '23DIT028', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(31, '', NULL, '', '', '23DIT030', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(32, '', NULL, '', '', '23DIT031', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(33, '', NULL, '', '', '23DIT032', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(34, '', NULL, '', '', '23DIT033', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(35, '', NULL, '', '', '23DIT034', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(36, '', NULL, '', '', '23DIT035', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(37, '', NULL, '', '', '23DIT036', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(38, '', NULL, '', '', '23DIT037', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(39, '', NULL, '', '', '23DIT038', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(40, '', NULL, '', '', '23DIT039', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(41, '', NULL, '', '', '23DIT040', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(42, '', NULL, '', '', '23DIT041', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(43, '', NULL, '', '', '23DIT042', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(44, '', NULL, '', '', '23DIT043', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(45, '', NULL, '', '', '23DIT044', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(46, '', NULL, '', '', '23DIT045', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(47, '', NULL, '', '', '23DIT046', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(48, '', NULL, '', '', '23DIT047', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(49, '', NULL, '', '', '23DIT048', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(50, '', NULL, '', '', '23DIT049', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(51, '', NULL, '', '', '23DIT050', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(52, '', NULL, '', '', '23DIT051', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(53, '', NULL, '', '', '23DIT052', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(54, '', NULL, '', '', '23DIT053', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(55, '', NULL, '', '', '23DIT054', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(56, '', NULL, '', '', '23DIT055', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(57, '', NULL, '', '', '23DIT056', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(58, '', NULL, '', '', '23DIT057', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(59, '', NULL, '', '', '23DIT058', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(60, '', NULL, '', '', '23DIT059', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(61, '', NULL, '', '', '23DIT060', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(62, '', NULL, '', '', '23DIT061', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(63, '', NULL, '', '', '23DIT062', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(64, '', NULL, '', '', '23DIT063', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(65, '', NULL, '', '', '23DIT064', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(66, '', NULL, '', '', '23DIT065', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(67, '', NULL, '', '', '23DIT066', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(68, '', NULL, '', '', '23DIT067', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(69, '', NULL, '', '', '23DIT068', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(70, '', NULL, '', '', '23DIT069', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(71, '', NULL, '', '', '23DIT070', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(72, '', NULL, '', '', '23DIT071', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(73, '', NULL, '', '', '23DIT072', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(74, '', NULL, '', '', '23DIT073', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(75, '', NULL, '', '', '23DIT074', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(76, '', NULL, '', '', '23DIT075', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(77, '', NULL, '', '', '23DIT078', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(78, '', NULL, '', '', 'D24DIT079', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(79, '', NULL, '', '', 'D24DIT080', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(80, '', NULL, '', '', 'D24DIT081', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(81, '', NULL, '', '', 'D24DIT082', 'student', 'Student', 'SEM 3', '3IT', 'all', '2024-07-11 15:54:49', '2024-07-11 15:54:49', NULL, 'Active', 'Not Verified'),
(83, '', NULL, '', '', '23DCE045', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(84, '', NULL, '', '', '23DCE046', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(85, '', NULL, '', '', '23DCE047', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(86, '', NULL, '', '', '23DCE048', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(87, '', NULL, '', '', '23DCE049', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(88, '', NULL, '', '', '23DCE050', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(89, '', NULL, '', '', '23DCE051', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(90, '', NULL, '', '', '23DCE052', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(91, '', NULL, '', '', '23DCE053', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(92, '', NULL, '', '', '23DCE054', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(93, '', NULL, '', '', '23DCE055', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(94, '', NULL, '', '', '23DCE056', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(95, '', NULL, '', '', '23DCE057', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(96, '', NULL, '', '', '23DCE058', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(97, '', NULL, '', '', '23DCE059', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(98, '', NULL, '', '', '23DCE060', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(99, '', NULL, '', '', '23DCE061', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(100, '', NULL, '', '', '23DCE062', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(101, '', NULL, '', '', '23DCE063', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(102, '', NULL, '', '', '23DCE064', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(103, '', NULL, '', '', '23DCE065', 'student', 'Student', 'SEM 3', '3CE', 'C', '2024-07-11 15:56:57', '2024-07-11 15:56:57', NULL, 'Active', 'Not Verified'),
(104, 'John', 'Doe', 'Smith', 'john.smith@example.com', 'john.smith', 'securepassword123', 'Student', '', '', '', '2024-08-04 20:24:19', '2024-08-07 07:07:20', '344056', 'Active', 'Verified');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`ClassID`),
  ADD KEY `TeacherID` (`TeacherID`);

--
-- Indexes for table `classexams`
--
ALTER TABLE `classexams`
  ADD PRIMARY KEY (`ClassID`,`ExamID`),
  ADD KEY `ExamID` (`ExamID`);

--
-- Indexes for table `classstudents`
--
ALTER TABLE `classstudents`
  ADD PRIMARY KEY (`ClassID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `examassignments`
--
ALTER TABLE `examassignments`
  ADD PRIMARY KEY (`AssignmentID`),
  ADD KEY `ExamID` (`ExamID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`ExamID`),
  ADD KEY `CreatorID` (`CreatorID`);

--
-- Indexes for table `exam_logs`
--
ALTER TABLE `exam_logs`
  ADD PRIMARY KEY (`LogID`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questionanswers`
--
ALTER TABLE `questionanswers`
  ADD PRIMARY KEY (`AnswerID`),
  ADD KEY `SubmissionID` (`SubmissionID`),
  ADD KEY `QuestionID` (`QuestionID`);

--
-- Indexes for table `questionoptions`
--
ALTER TABLE `questionoptions`
  ADD PRIMARY KEY (`OptionID`),
  ADD KEY `QuestionID` (`QuestionID`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`QuestionID`),
  ADD KEY `ExamID` (`ExamID`);

--
-- Indexes for table `quizsubmissions`
--
ALTER TABLE `quizsubmissions`
  ADD PRIMARY KEY (`SubmissionID`),
  ADD KEY `ExamID` (`ExamID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `quiz_feedback`
--
ALTER TABLE `quiz_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student_quiz_details`
--
ALTER TABLE `student_quiz_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `systemlogs`
--
ALTER TABLE `systemlogs`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `systemsettings`
--
ALTER TABLE `systemsettings`
  ADD PRIMARY KEY (`SettingID`),
  ADD UNIQUE KEY `SettingName` (`SettingName`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `ClassID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `examassignments`
--
ALTER TABLE `examassignments`
  MODIFY `AssignmentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `ExamID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam_logs`
--
ALTER TABLE `exam_logs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questionanswers`
--
ALTER TABLE `questionanswers`
  MODIFY `AnswerID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questionoptions`
--
ALTER TABLE `questionoptions`
  MODIFY `OptionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `QuestionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quizsubmissions`
--
ALTER TABLE `quizsubmissions`
  MODIFY `SubmissionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_feedback`
--
ALTER TABLE `quiz_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_quiz_details`
--
ALTER TABLE `student_quiz_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `systemlogs`
--
ALTER TABLE `systemlogs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `systemsettings`
--
ALTER TABLE `systemsettings`
  MODIFY `SettingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `classexams`
--
ALTER TABLE `classexams`
  ADD CONSTRAINT `classexams_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `classes` (`ClassID`),
  ADD CONSTRAINT `classexams_ibfk_2` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`);

--
-- Constraints for table `classstudents`
--
ALTER TABLE `classstudents`
  ADD CONSTRAINT `classstudents_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `classes` (`ClassID`),
  ADD CONSTRAINT `classstudents_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `examassignments`
--
ALTER TABLE `examassignments`
  ADD CONSTRAINT `examassignments_ibfk_1` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`),
  ADD CONSTRAINT `examassignments_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `fk_examassignments_exam` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_examassignments_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`CreatorID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `fk_exams_user` FOREIGN KEY (`CreatorID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `questionanswers`
--
ALTER TABLE `questionanswers`
  ADD CONSTRAINT `fk_questionanswers_question` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_questionanswers_submission` FOREIGN KEY (`SubmissionID`) REFERENCES `quizsubmissions` (`SubmissionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `questionanswers_ibfk_1` FOREIGN KEY (`SubmissionID`) REFERENCES `quizsubmissions` (`SubmissionID`),
  ADD CONSTRAINT `questionanswers_ibfk_2` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`);

--
-- Constraints for table `questionoptions`
--
ALTER TABLE `questionoptions`
  ADD CONSTRAINT `fk_questionoptions_question` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `questionoptions_ibfk_1` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_questions_exam` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`) ON DELETE CASCADE,
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`);

--
-- Constraints for table `quizsubmissions`
--
ALTER TABLE `quizsubmissions`
  ADD CONSTRAINT `fk_quizsubmissions_exam` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_quizsubmissions_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `quizsubmissions_ibfk_1` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`),
  ADD CONSTRAINT `quizsubmissions_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `quiz_feedback`
--
ALTER TABLE `quiz_feedback`
  ADD CONSTRAINT `quiz_feedback_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `exams` (`ExamID`),
  ADD CONSTRAINT `quiz_feedback_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `student_quiz_details`
--
ALTER TABLE `student_quiz_details`
  ADD CONSTRAINT `student_quiz_details_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `student_quiz_details_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`ExamID`);

--
-- Constraints for table `systemlogs`
--
ALTER TABLE `systemlogs`
  ADD CONSTRAINT `fk_systemlogs_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `systemlogs_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
