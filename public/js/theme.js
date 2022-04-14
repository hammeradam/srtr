const toggle = document.querySelector('#darkModeToggle');
const body = document.querySelector('body');

toggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('isDark', body.classList.contains('dark'));
});

if (localStorage.getItem('isDark') === 'true') {
    body.classList.add('dark');
}
