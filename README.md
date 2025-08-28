# 📊 Professional Error Dashboard (React + Google Sheets + AI Integration)

## 🚀 Overview
This is a **Professional Error Dashboard** built using **React** that pulls live data from **Google Spreadsheets via Google API** and visualizes it using **Bar Charts** and **Pie Charts**.  

The dashboard not only provides clear data visualization but also leverages **AI integration** to intelligently **categorize and analyze data**.  

A **mini backend server** is included to handle secure API calls to [OpenRouter.ai](https://openrouter.ai/), where advanced AI models process and classify the spreadsheet data.

---

## ✨ Features
- 📥 **Google Sheets Integration** – Fetch live spreadsheet data using Google Sheets API.  
- 📊 **Data Visualization** – Dynamic Bar and Pie charts for error analysis.  
- 🤖 **AI Integration** – Categorizes and analyzes spreadsheet data using OpenRouter AI API.  
- 🛠 **Mini Backend Server** – Securely calls AI API and serves categorized results to the React frontend.  
- 🧵 **Advanced Data Processing**  
  - String manipulation techniques  
  - Array manipulation for dynamic datasets  
  - Object manipulation for structured data transformation  

---

## 🏗️ Tech Stack
**Frontend**
- React.js (with Hooks & Components)  
- Chart.js / Recharts (for Bar & Pie charts)  
- Bootstrap / Tailwind (for responsive UI)  

**Backend**
- Node.js + Express (mini backend server)  
- Google Sheets API  
- OpenRouter.ai API  

**Other**
- Axios / Fetch (for API calls)  

## 🔑 Environment Variables
Create a `.env` file in your project root and add:

```bash
# Google API
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_API_KEY=your_google_api_key

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
