import { checkLogin } from './utils/authentication.js';
import { loader } from './components/loader.js';
import { app } from './components/app.js';

(async () => {
    const root = document.querySelector('body');

    const loaderElement = loader();
    root.appendChild(loaderElement);

    await checkLogin();

    loaderElement.remove();

    root.appendChild(app());
})();
