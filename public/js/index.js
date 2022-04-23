import { checkLogin } from './utils/authentication.js';
import { app } from './components/app.js';

(() => {
    const root = document.querySelector('body');

    root.appendChild(app());
    checkLogin();
})();
