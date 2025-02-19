import { preloadImages } from "../libs/utils.js";
let lenis;
Splitting();
function intro() {
  lenis = new Lenis({
    lerp: 0.2, // Lower values create a smoother scroll effect
    smoothWheel: true, // Enables smooth scrolling for mouse wheel events
  });

  // Update ScrollTrigger each time the user scrolls
  lenis.on("scroll", () => ScrollTrigger.update());

  // Define a function to run at each animation frame
  const scrollFn = (time) => {
    lenis.raf(time * 1000); // Run Lenis' requestAnimationFrame method
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
        pinSpacing: false,
        // markers: true,
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

function productDetail() {
  $(".list-button").mousemove(function (e) {
    callParallax(e);
  });

  $(".list-button").mouseleave(function (e) {
    TweenMax.to(this, 0.3, { height: 0, width: 40 });
    TweenMax.to(".button-circle", 0.3, { scale: 1, x: 0, y: 0 });
  });

  $(".list-button .button-circle").mouseenter(function (e) {
    TweenMax.to(this, 0.3, { scale: 1.4 });
  });

  $(".list-button .button-circle").on("click", function (e) {
    let thisButton = $(e.currentTarget);
    let dataTab = thisButton.data("tab");

    let thisSection = thisButton.closest("section.product-detail");
    let moreClassSection = ".product-1";
    if (thisSection.hasClass("product-2")) {
      moreClassSection = ".product-2";
    }

    console.log(moreClassSection);

    if (thisButton.hasClass("open")) {
      closeTabProductDetail(moreClassSection, dataTab);
    } else {
      thisButton.addClass("open");
      thisButton.siblings().addClass("d-none");

      $(`section.product-detail${moreClassSection} .content`)
        .addClass("active")
        .addClass(dataTab);
      $(`section.product-detail${moreClassSection} .tab`).removeClass("active");
      $(
        `section.product-detail${moreClassSection} [detail-${dataTab}]`
      ).addClass("active");

      let viewWidth = $(window).width() / 2;
      if (viewWidth > 600) {
        viewWidth = 600;
      }

      $(`section.product-detail${moreClassSection} .wrapper-content`)
        .stop()
        .animate(
          {
            width: viewWidth,
          },
          1000
        );
    }
  });
}

function closeTabProductDetail(moreClassSection, dataTab) {
  $(`section.product-detail${moreClassSection} .content`)
    .removeClass("active")
    .removeClass(dataTab);
  $(`section.product-detail${moreClassSection} .tab`).removeClass("active");
  $(`section.product-detail${moreClassSection} .list-button .button-circle`)
    .removeClass("d-none")
    .removeClass("open");

  $(`section.product-detail${moreClassSection} .wrapper-content`)
    .stop()
    .animate(
      {
        width: 0,
      },
      1000
    );
}

function animateZoomIn() {
  gsap.registerPlugin(ScrollTrigger);

  $(".animate-zoomin").each(function () {
    gsap.fromTo(
      $(this).find(".wrapper-image .img"),
      {
        scale: "1.5",
        y: 100,
      },
      {
        scrollTrigger: {
          trigger: this,
          start: "top top",
          end: "+=100%",
          scrub: 0.5,
          // markers: true,
          pin: true,
          onEnterBack: () => {
            $(this).removeClass("done");

            let thisButton = $(this).find(".list-button .button-circle.open");
            let moreClassSection = "";
            if ($(this).hasClass("product-2")) {
              moreClassSection = ".product-2";
            }

            let dataTab = thisButton.data("tab");

            closeTabProductDetail(moreClassSection, dataTab);
          },
          onLeaveBack: () => {
            $(this).removeClass("done");
          },
        },
        scale: "1",
        y: 0,
        duration: 2,
        ease: "none",
        stagger: 0.1,
        onComplete: () => {
          $(this).addClass("done");
        },
      }
    );
  });
  ScrollTrigger.refresh();
}

function parallaxIt(e, target, movement) {
  var $this = $(target);

  var relX = e.pageX;
  var relY = e.pageY;

  var parallaxX = ((relX - $this.offset().left) / $this.width()) * movement;
  var parallaxY = ((relY - $this.offset().top) / $this.height()) * movement;

  TweenMax.to($this, 0.3, {
    x: parallaxX - movement / 2,
    y: parallaxY - movement / 2,
    ease: Power2.easeOut,
  });
}

function callParallax(e) {
  var $button = $(e.target);
  parallaxIt(e, $button, 30);
}

function hero() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    ".hero__img",
    { scale: 0.9 },
    { scale: 1, duration: 2, ease: "power2.out" }
  );

  gsap.fromTo(
    ".hero__img",
    { scale: 1 },
    {
      scale: 2,
      autoAlpha: 0,
      ease: "sine.out",
      scrollTrigger: {
        trigger: ".hero__img",
        start: "top top",
        end: "+=100%",
        scrub: true,
        // markers: true,
        pin: true,
      },
    }
  );

  gsap.fromTo(
    ".intro",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      scrollTrigger: {
        trigger: ".intro",
        start: "top top",
        end: "top 20%",
        scrub: 1,
      },
    }
  );
}

function animationText() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".data-fade-in").forEach((element, i) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 20,
      },
      {
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 85%",
          // markers: true,
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "sine.out",
        stagger: {
          amount: 0.3,
        },
      }
    );
  });
}
function text() {
  const fx1Titles = [
    ...document.querySelectorAll(
      ".details__title[data-splitting][data-effect-one]"
    ),
  ];
  fx1Titles.forEach((title) => {
    const chars = title.querySelectorAll(".char");

    chars.forEach((char) => gsap.set(char.parentNode, { perspective: 1000 }));

    gsap.fromTo(
      chars,
      {
        "will-change": "opacity, transform",
        transformOrigin: "50% 0%",
        opacity: 0,
        rotationX: -90,
        z: -200,
      },
      {
        ease: "power1",
        opacity: 1,
        stagger: 0.05,
        rotationX: 0,
        z: 0,
        scrollTrigger: {
          trigger: title,
          start: "center bottom",
          end: "bottom top+=50%",
          // scrub: true,
          // markers: true,
        },
      }
    );
  });
}
const init = () => {
  intro();
  productDetail();
  hero();
  animationText();
  text();
  animateZoomIn();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
