// ===============================
// Navbar
// ===============================

const header = document.querySelector(".header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const menuBackdrop = document.querySelector(".menu-backdrop");
const closeMenu = document.querySelector(".close-menu");

function setMenu(isOpen) {
    menuToggle.classList.toggle("active", isOpen);
    mobileMenu.classList.toggle("active", isOpen);
    menuBackdrop.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
}

// ===============================
// Mobile Menu Toggle
// ===============================

menuToggle.addEventListener("click", () => setMenu(!menuToggle.classList.contains("active")));

// ===============================
// Close menu after clicking link
// ===============================

document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

        setMenu(false);

    });

});

// ===============================
// Sticky Navbar Scroll Effect
// ===============================

window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

closeMenu.addEventListener("click", () => setMenu(false));
menuBackdrop.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
});
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    // Remove active class from all links
    navLinks.forEach((item) => item.classList.remove("active"));

    // Add active class to clicked link
    this.classList.add("active");
  });
});
