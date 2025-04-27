# Exam Backend API

This is the backend API for the Exam Management System, built with Node.js and Express. It provides endpoints for managing exams, questions, users, and other related functionalities.

## Features

- User authentication and authorization
- Exam management (create, read, update, delete)
- Question bank management
- Result tracking and analytics
- Secure API endpoints
- Role-based access control

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd exam-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/exam-db
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the development server:

```bash
npm run dev
```

## Project Structure

```
exam-backend/
├── config/           # Configuration files
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── .env             # Environment variables
├── package.json     # Project dependencies
└── server.js        # Main application file
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Exams

- `GET /api/exams` - Get all exams
- `POST /api/exams` - Create a new exam
- `GET /api/exams/:id` - Get exam by ID
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam

### Questions

- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create a new question
- `GET /api/questions/:id` - Get question by ID
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Results

- `GET /api/results` - Get all results
- `POST /api/results` - Submit exam results
- `GET /api/results/:id` - Get result by ID

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Environment Variables

| Variable    | Description                          | Default                           |
| ----------- | ------------------------------------ | --------------------------------- |
| PORT        | Server port                          | 3000                              |
| MONGODB_URI | MongoDB connection string            | mongodb://localhost:27017/exam-db |
| JWT_SECRET  | JWT secret key                       | -                                 |
| NODE_ENV    | Environment (development/production) | development                       |

## Security

- All API endpoints are protected with JWT authentication
- Password hashing using bcrypt
- CORS enabled for specific origins
- Input validation and sanitization
- Rate limiting implemented

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the repository.
