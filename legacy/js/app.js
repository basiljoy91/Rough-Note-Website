import { Preloader } from './preloader.js';

// Global JavaScript entry point
document.addEventListener("DOMContentLoaded", () => {
    console.log("RoughNote v2 Architecture initialized");

    const preloader = new Preloader();
    preloader.playIntro();
});
