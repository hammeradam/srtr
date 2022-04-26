import { checkLogin } from './utils/authentication.js';
import { app } from './components/app.js';

(async () => {
    const root = document.querySelector('body');

    await checkLogin();
    root.appendChild(app());
})();
