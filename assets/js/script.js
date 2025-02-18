import { preloadImages } from "../libs/utils.js";
let lenis;
function intro() {
  lenis = new Lenis({
    lerp: 0.2, // Lower values create a smoother scroll effect
    smoothWheel: true, // Enables smooth scrolling for mouse wheel events
  });

  // Update ScrollTrigger each time the user scrolls
  lenis.on("scroll", () => ScrollTrigger.update());

  // Define a function to run at each animation frame
  const scrollFn = (time) => {
    lenis.raf(time); // Run Lenis' requestAnimationFrame method
    requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
  };
  // Start the animation frame loop
  requestAnimationFrame(scrollFn);

  const canvas = document.querySelector(".canvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const images = [];
  let ball = { frame: 0 };

  // Lấy tất cả ảnh từ HTML
  document.querySelectorAll(".image-container img").forEach((img) => {
    const image = new Image();
    image.src = img.src;
    images.push(image);
  });

  // Đợi tất cả ảnh load xong trước khi bắt đầu
  Promise.all(
    images.map((img) => {
      return new Promise((resolve) => {
        img.onload = resolve;
      });
    })
  ).then(() => {
    console.log("All images loaded");
    gsap.to(ball, {
      frame: images.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 1,
        pin: "canvas",
        end: "500%",
      },
      onUpdate: render,
    });

    render();
  });

  function render() {
    if (images.length > 0) {
      context.canvas.width = images[0].width;
      context.canvas.height = images[0].height;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[ball.frame], 0, 0);
    }
  }
}
const init = () => {
  intro(); // Apply scroll-triggered animations
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
