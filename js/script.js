// H Core Global Solutions

console.log("Website Loaded Successfully");

window.addEventListener("load", function () {
    document.body.classList.add("loaded");
});

// Smooth animation for cards
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
    });
});
