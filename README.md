# Archive UI

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Start the development server: `npm start`

## Environment Variables

Create a `.env` file in the root directory and add the following:

For production, set `REACT_APP_API_URL` to your production API URL.

Eg. REACT_APP_API_URL=<your_api_url>

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## ESLint and Prettier

This project uses ESLint and Prettier for code linting and formatting. Make sure to install the following VS Code extensions:

- ESLint by Dirk Baeumer
- Prettier - Code formatter by Prettier

## API Configuration

The application uses Axios for API calls. The base URL is set in `src/services/API.js`:

```javascript
export const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';