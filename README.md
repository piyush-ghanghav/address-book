# Address Book Application

A full-stack MERN application for managing contacts with multiple addresses.

## Features

- Create, read, update, and delete contacts
- Support for multiple addresses per contact
- Field validations (email, phone, PIN code)
- Responsive design
- RESTful API backend
- MongoDB database

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Express.js
- **Database**: MongoDB
- **Styling**: CSS

## Project Structure

```
address_book_app/
├── frontend/              # React frontend
│   ├── src/
│   ├── package.json
│   └── .env
├── backend/              # Express backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Account
- Git

## 🚀 Quick Start

```bash
# Install dependencies for all
npm run install:all

# Start both frontend and backend
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env    # Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env    # Configure your environment variables
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

## Field Validations

- Email: Valid email format
- Phone: 10 digits
- PIN Code: 6 digits starting with non-zero

## Scripts

### Backend
- `npm run dev`: Start development server
- `npm start`: Start production server

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build



## Author

Piyush Ghanghav