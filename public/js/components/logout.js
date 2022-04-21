import { showLoggedOutState } from '../utils/authentication.js';
import { createElement } from '../utils/createElement.js';
import { sendRequest } from '../utils/sendRequest.js';
import { navigateTo } from './router.js';

export const logout = () => {
    return createElement('li', {
        children: [
            createElement('a', {
                href: '/logout',
                text: 'LOGOUT',
                events: {
                    click: async (event) => {
                        event.preventDefault();
                        await sendRequest('/api/auth/logout', {
                            method: 'POST',
                        });

                        navigateTo('');
                        showLoggedOutState();
                        window.accessToken = '';
                    },
                },
            }),
        ],
    });
};