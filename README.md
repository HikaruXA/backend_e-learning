<!DOCTYPE html>
<html lang="en">
<body>
  <h1>E-Learning Backend API</h1>

  <p style="color: #d9534f; font-weight: bold;">
    ⚠️ <em>Backend is currently a Work In Progress (WIP). Features and APIs are actively being developed and may change.</em>
  </p>

  <h2>Project Overview</h2>
  <p>
    This is a <strong>Node.js</strong> backend API built with <strong>Express.js</strong> and <strong>MySQL</strong> to power an E-learning platform aimed at providing accessible education for students from <strong>Grade 1 through Grade 12</strong>. The platform is designed to bridge the education gap for learners who lack access to traditional schooling, offering a comprehensive digital learning experience.
  </p>

  <h2>Purpose</h2>
  <p>
    The purpose of this project is to deliver a scalable and secure backend service that supports:
  </p>
  <ul>
    <li>User management (Students, Teachers, Admins)</li>
    <li>Creation and management of lesson content linked to specific <strong>grade levels</strong> and <strong>quarters (1st to 4th)</strong>, contributed by both <strong>Teachers and Students</strong> to foster knowledge sharing</li>
    <li>Enrollment and progress tracking</li>
    <li>Grade levels and subjects organization</li>
    <li>Authentication and authorization using JWT</li>
    <li>Secure and efficient database operations using MySQL</li>
  </ul>
  <p>
    This system aims to empower learners worldwide, especially in underserved communities, by providing free and easy access to quality educational resources.
  </p>

  <h2>Features</h2>
  <ul>
    <li><strong>Role-based access control</strong> for Admin, Teacher, and Student users</li>
    <li>User registration and login with secure password hashing</li>
    <li>JWT-based authentication middleware to protect routes</li>
    <li>Management of lesson content and multimedia attachments, linked to grade level and quarter, created by both Teachers and Students</li>
    <li>Error handling and input validation</li>
  </ul>

  <h2>Technology Stack</h2>
  <ul>
    <li><strong>Node.js</strong> runtime environment</li>
    <li><strong>Express.js</strong> web framework</li>
    <li><strong>MySQL</strong> relational database using the native <code>mysql</code> Node.js driver (no ORM)</li>
    <li><strong>bcrypt</strong> for password hashing</li>
    <li><strong>jsonwebtoken (JWT)</strong> for authentication</li>
    <li>Middleware for request validation and security (CORS, Helmet, rate limiting, etc.)</li>
  </ul>
</body>
</html>
