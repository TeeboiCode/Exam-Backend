-- Create database
CREATE DATABASE IF NOT EXISTS exam_db;
USE exam_db;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL, -- Added firstName column
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    maritalStatus VARCHAR(20),
    dob DATE,
    state VARCHAR(100),
    localGovt VARCHAR(100),
    address TEXT,
    nationality VARCHAR(100),
    nin VARCHAR(50),
    department VARCHAR(100),
    gender VARCHAR(20),
    privacyPolicy BOOLEAN,
    role VARCHAR(50),
    isActive BOOLEAN,
    paymentStatus VARCHAR(50),
    paymentAmount DECIMAL(10, 2),
    paymentDate DATE,
    created_by INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(id)
);




-- Programs table (JAMB, WAEC, etc.)
CREATE TABLE IF NOT EXISTS Programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    isActive BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE IF NOT EXISTS Subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    isActive BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Program_Subjects (junction table)
CREATE TABLE IF NOT EXISTS Program_Subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    programId INT NOT NULL,
    subjectId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (programId) REFERENCES Programs(id),
    FOREIGN KEY (subjectId) REFERENCES Subjects(id),
    UNIQUE KEY (programId, subjectId)
);

-- Tutor_Subjects (junction table)
CREATE TABLE IF NOT EXISTS Tutor_Subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tutorId INT NOT NULL,
    subjectId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tutorId) REFERENCES Users(id),
    FOREIGN KEY (subjectId) REFERENCES Subjects(id),
    UNIQUE KEY (tutorId, subjectId)
);

-- Parent_Student (junction table)
CREATE TABLE IF NOT EXISTS Parent_Student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parentId INT NOT NULL,
    studentId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parentId) REFERENCES Users(id),
    FOREIGN KEY (studentId) REFERENCES Users(id),
    UNIQUE KEY (parentId, studentId)
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS Enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT NOT NULL,
    programId INT NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    startDate DATE NOT NULL,
    endDate DATE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES Users(id),
    FOREIGN KEY (programId) REFERENCES Programs(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS Payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    paymentType ENUM('registration', 'program', 'subscription') NOT NULL,
    referenceId VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    paymentMethod ENUM('paypal', 'card', 'bank_transfer') NOT NULL,
    paymentDetails JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Topics table
CREATE TABLE IF NOT EXISTS Topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subjectId INT NOT NULL,
    isActive BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subjectId) REFERENCES Subjects(id)
);

-- Questions table
CREATE TABLE IF NOT EXISTS Questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    questionText TEXT NOT NULL,
    options JSON NOT NULL,
    correctAnswer VARCHAR(255) NOT NULL,
    explanation TEXT,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    topicId INT NOT NULL,
    createdBy INT NOT NULL,
    isActive BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (topicId) REFERENCES Topics(id),
    FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- Exams table
CREATE TABLE IF NOT EXISTS Exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    totalMarks INT NOT NULL,
    passingMarks INT NOT NULL,
    subjectId INT NOT NULL,
    createdBy INT NOT NULL,
    isActive BOOLEAN DEFAULT true,
    startTime DATETIME,
    endTime DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subjectId) REFERENCES Subjects(id),
    FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- ExamQuestions table (junction table)
CREATE TABLE IF NOT EXISTS ExamQuestions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    examId INT NOT NULL,
    questionId INT NOT NULL,
    marks INT NOT NULL DEFAULT 1,
    `order` INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (examId) REFERENCES Exams(id),
    FOREIGN KEY (questionId) REFERENCES Questions(id)
);

-- StudentExams table
CREATE TABLE IF NOT EXISTS StudentExams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT NOT NULL,
    examId INT NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME,
    score INT,
    status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
    answers JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES Users(id),
    FOREIGN KEY (examId) REFERENCES Exams(id)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS Attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT NOT NULL,
    subjectId INT NOT NULL,
    tutorId INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late') NOT NULL,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES Users(id),
    FOREIGN KEY (subjectId) REFERENCES Subjects(id),
    FOREIGN KEY (tutorId) REFERENCES Users(id)
);

-- Grades table
CREATE TABLE IF NOT EXISTS Grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT NOT NULL,
    subjectId INT NOT NULL,
    tutorId INT NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    maxScore DECIMAL(5, 2) NOT NULL,
    gradeType ENUM('assignment', 'quiz', 'exam', 'mock') NOT NULL,
    date DATE NOT NULL,
    comments TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES Users(id),
    FOREIGN KEY (subjectId) REFERENCES Subjects(id),
    FOREIGN KEY (tutorId) REFERENCES Users(id)
);

-- Announcements table
CREATE TABLE IF NOT EXISTS Announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    createdBy INT NOT NULL,
    targetRole ENUM('all', 'student', 'tutor', 'parent', 'admin') DEFAULT 'all',
    isActive BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- Events table
CREATE TABLE IF NOT EXISTS Events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    location VARCHAR(255),
    createdBy INT NOT NULL,
    targetRole ENUM('all', 'student', 'tutor', 'parent', 'admin') DEFAULT 'all',
    isActive BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS Notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    isRead BOOLEAN DEFAULT false,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Insert default admin user
INSERT INTO Users (username, email, password, role, isActive, status)
VALUES ('admin', 'admin@example.com', '$2a$10$X7UrE2J5J5J5J5J5J5J5J.5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'superadmin', true, 'approved')
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample programs
INSERT INTO Programs (name, description, price) VALUES
('JAMB', 'Joint Admissions and Matriculation Board Examination', 2000.00),
('WAEC', 'West African Examinations Council', 2500.00),
('NECO', 'National Examinations Council', 2300.00),
('GCE', 'General Certificate of Education', 2200.00),
('POST-UTME', 'Post Unified Tertiary Matriculation Examination', 1800.00)
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample subjects
INSERT INTO Subjects (name, description) VALUES
('Mathematics', 'Basic mathematics including algebra, calculus, and statistics'),
('Physics', 'Classical mechanics, thermodynamics, and modern physics'),
('Chemistry', 'Organic and inorganic chemistry, chemical reactions'),
('Biology', 'Cell biology, genetics, and human physiology'),
('English Language', 'Grammar, comprehension, and essay writing'),
('Literature in English', 'Prose, poetry, and drama analysis'),
('Government', 'Political systems, governance, and citizenship'),
('Economics', 'Microeconomics, macroeconomics, and economic systems'),
('Geography', 'Physical geography, human geography, and map reading'),
('History', 'World history, Nigerian history, and historical events')
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample topics for Mathematics
INSERT INTO Topics (name, description, subjectId) VALUES
('Algebra', 'Basic algebraic concepts and equations', 1),
('Calculus', 'Differential and integral calculus', 1),
('Statistics', 'Probability and statistical analysis', 1),
('Geometry', 'Plane and solid geometry', 1),
('Trigonometry', 'Trigonometric functions and identities', 1)
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample questions
INSERT INTO Questions (questionText, options, correctAnswer, explanation, difficulty, topicId, createdBy) VALUES
('What is 2 + 2?', '["3", "4", "5", "6"]', '4', 'Basic addition', 'easy', 1, 1),
('What is the derivative of x^2?', '["x", "2x", "x^2", "2x^2"]', '2x', 'Power rule of differentiation', 'medium', 2, 1),
('What is the square root of 16?', '["2", "4", "8", "16"]', '4', 'Square root calculation', 'easy', 1, 1),
('What is the area of a circle with radius 5?', '["15.7", "25", "31.4", "78.5"]', '78.5', 'Area of circle = πr²', 'medium', 4, 1)
ON DUPLICATE KEY UPDATE id=id; 

ALTER TABLE Users
ADD COLUMN firstName VARCHAR(255) NOT NULL AFTER username;