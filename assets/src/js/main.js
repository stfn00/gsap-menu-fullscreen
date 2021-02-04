/**
 * ==========================================================================
 * Main file
 * ==========================================================================
 */



// Images
import "../img/favicon.ico";
import "../img/logo.svg";

// Font Awesome
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

// App JS
import App from "./app";

// Styles
import "../sass/main.scss";



/**
 * Init
 * ==========================================================================
 */

window.addEventListener("load", () => {
  // App
  new App();
});
