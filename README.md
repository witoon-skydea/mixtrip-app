# MixTrip - Travel Route Planning Application

MixTrip is a web application that allows users to create, share, and explore travel routes. Users can create detailed trip itineraries, share them with friends, and remix routes created by other users to customize them for their own travels.

## Features

- User authentication (register, login, profile management)
- Create detailed travel itineraries with daily activities
- Share trips publicly or keep them private
- Remix/fork trips from other users
- Comment on trips
- Search and explore trips created by the community
- Follow other users
- Google Maps integration

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript, EJS templates
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Maps**: Google Maps API

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB account (or local installation)
- Google Maps API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mixtrip.git
   cd mixtrip
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
mixtrip/
├── public/               # Static files
│   ├── css/              # CSS files
│   ├── js/               # JavaScript files
│   ├── uploads/          # User uploads
│   └── ...
├── src/                  # Application source code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── middleware/       # Middleware functions
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
├── views/                # EJS templates
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
└── package.json          # Project metadata
```

## Development Phases

### Phase 1: Core Functionality
- Basic project setup
- User authentication system
- Simple trip creation and viewing
- Basic UI

### Phase 2: Enhanced Features
- Trip details enhancement
- Google Maps API integration
- Trip sharing
- Trip remixing/forking
- Comments system
- Search and filtering

### Phase 3: Advanced Features
- User following system
- Activity feed
- Recommendations
- Enhanced map visualization
- Mobile optimization
- Performance improvements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
