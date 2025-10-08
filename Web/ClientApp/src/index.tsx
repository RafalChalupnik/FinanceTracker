import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const style = document.createElement("style");
style.innerHTML = `
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  body {
    background-color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
`;
document.head.appendChild(style);

const rootElement = document.getElementById('root');

// Ensure the root element exists before trying to render the app
if (rootElement) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
} else {
    console.error('Failed to find the root element');
}