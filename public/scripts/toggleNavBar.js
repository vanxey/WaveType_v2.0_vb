const nav = document.querySelector('nav');
const navBar = document.querySelector('nav-bar');
const hiddenMenu = document.querySelector('.hidden-menu');

const expandNavMenu = () => {
    nav.style.width = '195px';
    nav.style.textAlign = 'start';
    hiddenMenu.style.display = 'flex';
};

const collapseNavMenu = () => {
    nav.style.width = '7.5vh'; 
    nav.style.textAlign = 'center';
    hiddenMenu.style.display = 'none';
};

navBar.addEventListener('mouseenter', expandNavMenu);
navBar.addEventListener('mouseleave', collapseNavMenu);
