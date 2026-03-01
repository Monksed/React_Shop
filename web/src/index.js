import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';
import App from './App';
import { init, backButton, miniApp, closingBehavior, viewport, swipeBehavior, mountMainButton, mainButton} from '@telegram-apps/sdk-react';

init();

backButton.mount();
backButton.show();
mountMainButton();
mainButton.mount();
miniApp.mount();
closingBehavior.mount();
viewport.mount();
miniApp.ready();
miniApp.setBackgroundColor('#FFFFFF');
miniApp.setHeaderColor('#FFFFFF');
closingBehavior.enableConfirmation();
viewport.expand();
swipeBehavior.mount();
swipeBehavior.disableVertical();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
