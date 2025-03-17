import { preloadImages } from "../libs/utils.js";
let lenis;
Splitting();
function intro() {
  lenis = new Lenis();

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
    // console.log("All images loaded");
    gsap.to(ball, {
      frame: images.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 1,
        pin: "canvas",
        end: "150%",
        pinSpacing: false
        // markers: true,
      },
      onUpdate: render
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
    // TweenMax.to(".button-circle .text::before", 0.3, { scale: 0.4 });
  });
  //

  // start open popup
  $(".product-variant .content-top__image").on("click", function (e) {
    $(".content-discover").addClass("show-popup");
    $(".content-discover").css("z-index", "199");
    $("body").addClass("overflow-hidden");
  });

  $(".content-discover__close").on("click", function (e) {
    $(".content-discover").removeClass("show-popup");

    if ($(window).width() < 767) {
      setTimeout(() => {
        $(".content-discover").css("z-index", "-1");
      }, 300);
    } else {
      $(".content-discover").css("z-index", "-1");
    }
    $("body").removeClass("overflow-hidden");
  });
  // end open popup

  $("section.product-detail .wrapper-content .tab-close").on(
    "click",
    function () {
      $(".list-button .button-circle.open").trigger("click");
    }
  );

  $(".list-button .button-circle").on("click", function (e) {
    let thisButton = $(e.currentTarget);
    let dataTab = thisButton.data("tab");

    let thisSection = thisButton.closest("section.product-detail");
    let moreClassSection = ".product-1";

    if (thisSection.hasClass("product-2")) {
      moreClassSection = ".product-2";
    }

    thisSection.toggleClass("open");
    $("body").toggleClass("overflow-hidden");
    $(".sticky-menu").toggleClass("hide");

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

      $("body").addClass("overflow-hidden");
      $(".sticky-menu").addClass("hide");

      let viewWidth = $(window).width() / 2;
      if (viewWidth > 600) {
        viewWidth = 600;
      }

      $(`section.product-detail${moreClassSection} .wrapper-content`)
        .stop()
        .animate(
          {
            width: viewWidth
          },
          1000
        );

      gsap.fromTo(
        `section.product-detail${moreClassSection} .wrapper-content`, // Selector
        {
          width: 0, // Giá trị ban đầu của width
          x: "100%" // Giá trị ban đầu của transformY
        },
        {
          width: viewWidth, // Thu hẹp chiều rộng về 0
          x: 0, // Di chuyển phần tử xuống dưới (transformY 100%)
          duration: 1, // Thời gian thay đổi (1 giây)
          ease: "none" // Hiệu ứng mượt mà
        }
      );
    }
  });

  // change color on popup
  const contentDiscoverDot = $(".content-discover .dot-color");
  contentDiscoverDot.on("click", function () {
    let thisButton = $(this);
    if (thisButton.hasClass("active")) return;

    contentDiscoverDot.removeClass("active");
    thisButton.addClass("active");

    let thisButtonColor = thisButton.data("color");
    $(".content-discover .swiper-discover-img").removeClass("active");
    $(
      `.content-discover .swiper-discover-img[data-color=${thisButtonColor}]`
    ).addClass("active");

    $(
      `section.product-variant .content-pagination li[data-variant=${thisButtonColor}]`
    ).trigger("click");

    // update title color
    $(".content-discover .color .title").text(thisButtonColor);
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

  $("body").removeClass("overflow-hidden");
  $(".sticky-menu").removeClass("hide");

  let viewWidth = $(window).width() / 2;
  if (viewWidth > 600) {
    viewWidth = 600;
  }
  gsap.fromTo(
    `section.product-detail${moreClassSection} .wrapper-content .detail-${dataTab}`, // Selector
    {
      y: 0
    },
    {
      y: "100%",
      duration: 1,
      ease: "none",
      onComplete: function () {
        gsap.set(this.target, { transform: "none" });
      }
    }
  );

  gsap.fromTo(
    `section.product-detail${moreClassSection} .wrapper-content`, // Selector
    {
      x: 0
    },
    {
      x: "100%",
      duration: 1,
      ease: "none",
      onUpdate: function () {
        if (this.progress() > 0.2) {
          // console.log("Progress exceeded 0.8!");

          gsap.fromTo(
            `section.product-detail${moreClassSection} .wrapper-content`,
            {
              width: viewWidth
            },
            {
              width: 0,
              duration: 0.5,
              ease: "none"
            }
          );
        }
      }
    }
  );
}

function animateZoomIn() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const posMobile = $(window).width() < 767 ? "-100" : "-150";

  $(".animate-zoomin").each(function () {
    let target = $(this);

    gsap.fromTo(
      $(this).find(".wrapper-image .img"),
      {
        scale: "2",
        transformOrigin: "top center",
        y: posMobile
      },
      {
        scrollTrigger: {
          trigger: this,
          start: "top 103%",
          end: "+=100%",
          scrub: 0.5,
          // markers: true,
          // pin: true,
          // markers: true,
          onEnterBack: () => {
            $(this).removeClass("done");

            let thisButton = $(this).find(".list-button .button-circle.open");
            let moreClassSection = "";
            if ($(this).hasClass("product-2")) {
              moreClassSection = ".product-2";
            }

            let dataTab = thisButton.data("tab");

            // closeTabProductDetail(moreClassSection, dataTab);
          },
          onLeaveBack: () => {
            $(this).removeClass("done");
          },
          onUpdate: (self) => {
            if (self.progress > 0.99) {
              $(this).addClass("done");
            } else {
              $(this).removeClass("done");
            }
          }
        },
        scale: "1",
        y: 0,
        duration: 1.5,
        ease: "none",
        stagger: 0.1,
        onComplete: () => {
          $(this).addClass("done");
        }
      }
    );

    target.on("click", function () {
      gsap.to(window, {
        scrollTo: {
          y: target.offset().top - (window.innerHeight - target.outerHeight()),
          autoKill: false
        },
        duration: 1,
        ease: "power2.out"
      });
    });
  });
  $(".animate-zoomin").each(function () {
    let target = $(this);

    gsap.fromTo(
      $(this).find(".wrapper-image .img"),
      {
        scale: "2",
        transformOrigin: "top center",
        y: -150
      },
      {
        scrollTrigger: {
          trigger: this,
          start: "top 103%",
          end: "+=100%",
          scrub: 0.5,
          // markers: true,
          // pin: true,
          // markers: true,
          onEnterBack: () => {
            $(this).removeClass("done");

            let thisButton = $(this).find(".list-button .button-circle.open");
            let moreClassSection = "";
            if ($(this).hasClass("product-2")) {
              moreClassSection = ".product-2";
            }

            let dataTab = thisButton.data("tab");

            // closeTabProductDetail(moreClassSection, dataTab);
          },
          onLeaveBack: () => {
            $(this).removeClass("done");
          },
          onUpdate: (self) => {
            if (self.progress > 0.99) {
              $(this).addClass("done");
            } else {
              $(this).removeClass("done");
            }
          }
        },
        scale: "1",
        y: 0,
        duration: 1.5,
        ease: "none",
        stagger: 0.1,
        onComplete: () => {
          $(this).addClass("done");
        }
      }
    );

    target.on("click", function () {
      gsap.to(window, {
        scrollTo: {
          y: target.offset().top - (window.innerHeight - target.outerHeight()),
          autoKill: false
        },
        duration: 1,
        ease: "power2.out"
      });
    });
  });
  // ScrollTrigger.refresh();
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
    ease: Power2.easeOut
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
        pin: true
      }
    }
  );

  gsap.fromTo(
    ".intro",
    {
      autoAlpha: 0
    },
    {
      autoAlpha: 1,
      scrollTrigger: {
        trigger: ".intro",
        start: "top top",
        end: "top 20%",
        scrub: 1
      }
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
        y: 20
      },
      {
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 85%"
          // markers: true,
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "sine.out",
        stagger: {
          amount: 0.3
        }
      }
    );
  });

  document.querySelectorAll(".data-text-split").forEach((element) => {
    let text = new SplitType(element, { types: "chars" });

    // gsap.fromTo(
    //   text.chars,
    //   { clipPath: "inset(100% 0% 0% 0%)" },
    //   {
    //     clipPath: "inset(0% 0% 0% 0%)",
    //     duration: 2,
    //     // stagger: 0.05,
    //     ease: "power3.out",
    //     scrollTrigger: {
    //       trigger: element,
    //       start: "top 50%",
    //       end: "bottom 50%",
    //       toggleActions: "play none none reverse",
    //       markers: true,
    //     },
    //   }
    // );
  });
}
function text() {
  const fx1Titles = [
    ...document.querySelectorAll(
      ".details__title[data-splitting][data-effect-one]"
    )
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
        z: -200
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
          end: "bottom top+=50%"
          // scrub: true,
          // markers: true,
        }
      }
    );
  });
}

function changeVariantProduct() {
  const buttonVariants = $("section.product-variant .content-pagination li");

  buttonVariants.on("click", function () {
    let thisButton = $(this);
    let dataVariant = thisButton.data("variant");
    let dataRef = thisButton.data("ref");

    thisButton.addClass("active");
    thisButton.siblings().removeClass("active");

    $("section.product-variant .content-top__sku span").text(dataRef);
    $("section.product-variant .content-top__image img").removeClass("active");
    $(
      "section.product-variant .content-top__image .swiper-img-wrapper"
    ).removeClass("active");
    $(
      `section.product-variant .content-top__image img[data-variant='${dataVariant}']`
    ).addClass("active");
    $(
      `section.product-variant .content-top__image .swiper-img-wrapper[data-variant='${dataVariant}']`
    ).addClass("active");

    // active popup
    $(
      `.content-discover__content .group-color .dot-color[data-color='${dataVariant}']`
    ).trigger("click");
  });

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".js-parallax").forEach((wrap) => {
    const y = wrap.getAttribute("data-y") || -100;

    gsap.to(wrap, {
      y: y,
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        duration: 1,
        ease: "power4"
        //markers: true
      }
    });
  });
  // Pin .product-variant khi chạm vào header
  gsap.to(".product-variant", {
    scrollTrigger: {
      trigger: ".product-variant",
      start: "top top", // Khi phần tử chạm vào header
      end: "+=150%", // Giữ pin đến khi cuộn 150% chiều cao section
      scrub: 1,
      pin: true, // Giữ cố định
      // pinSpacing: false,
      // markers: true, // Debug, có thể xóa sau khi kiểm tra
      onUpdate: (self) => {
        if (self.progress > 0.5) {
          $(".product-variant").addClass("done");
        } else {
          $(".product-variant").removeClass("done");
        }
      }
    }
  });

  // Hiệu ứng opacity của .product-sku và .product-variant-content
  // gsap.fromTo(
  //   ".product-sku",
  //   { autoAlpha: 0 },
  //   {
  //     autoAlpha: 1,
  //     ease: "none", // Chuyển động đều đặn, không tăng giảm tốc
  //     scrollTrigger: {
  //       trigger: ".product-variant",
  //       start: "top top", // Bắt đầu thay đổi opacity khi pin bắt đầu
  //       end: "30% top", // Hoàn thành opacity = 1 khi cuộn đến cuối vùng pin
  //       scrub: true,
  //       markers: true
  //     }
  //   }
  // );

  // gsap.fromTo(
  //   ".product-variant-content",
  //   { autoAlpha: 1 },
  //   {
  //     autoAlpha: 0,
  //     ease: "none", // Chuyển động đều đặn, không tăng giảm tốc
  //     scrollTrigger: {
  //       trigger: ".product-variant",
  //       start: "top top", // Bắt đầu giảm opacity khi pin bắt đầu
  //       end: "30% top", // Hoàn thành opacity = 0 khi cuộn đến cuối vùng pin
  //       scrub: true
  //     }
  //   }
  // );

  $(".content-top__image .swiper").mouseenter(function (e) {
    let thisContentImage = $(this).closest(".content-top__image");
    thisContentImage.addClass("active");

    // $(this).mousemove(function (e) {
    //   // Get the position of the .content-top__image element
    //   var imageOffset = $(this).offset();
    //   var imageWidth = $(this).outerWidth();
    //   var imageHeight = $(this).outerHeight();

    //   // Calculate the new position of .cursor-pointer relative to the image
    //   var cursorX = e.pageX - imageOffset.left;
    //   var cursorY = e.pageY - imageOffset.top;

    //   // Ensure the cursor stays inside the boundaries of the image
    //   cursorX = Math.max(
    //     0,
    //     Math.min(cursorX, imageWidth - $(".cursor-pointer").outerWidth())
    //   );
    //   cursorY = Math.max(
    //     0,
    //     Math.min(cursorY, imageHeight - $(".cursor-pointer").outerHeight())
    //   );

    //   // Set the cursor position within the image
    //   $(".cursor-pointer").css({ left: cursorX, top: cursorY });
    // });
  });

  $(".content-top__image .swiper").mouseleave(function (e) {
    let thisContentImage = $(this).closest(".content-top__image");
    thisContentImage.removeClass("active");
    // $(this).removeClass("active");
  });

  document.querySelectorAll(".swiper-img-wrapper").forEach(function (wrapper) {
    const swiper = new Swiper(wrapper.querySelector(".swiper"), {
      loop: true,
      slidesPerView: 1,
      slidesPerPage: 1,
      allowTouchMove: false,
      speed: 500,
      autoplay: false,
      navigation: {
        nextEl: wrapper.querySelector(".swiper-button-next"), // Scoped to the wrapper
        prevEl: wrapper.querySelector(".swiper-button-prev") // Scoped to the wrapper
      }
    });
  });
}

function stickyMenu() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  window.addEventListener("DOMContentLoaded", () => {
    const links = gsap.utils.toArray(".sticky-menu__container ul li a");

    if (!links.length) return;

    // Xử lý sự kiện click
    links.forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = button.getAttribute("href");

        if (!id || !id.startsWith("#") || !document.querySelector(id)) {
          // console.warn(
          //   "Liên kết không hợp lệ hoặc không tìm thấy phần tử:",
          //   id
          // );
          return;
        }

        e.preventDefault();

        links.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        gsap.to(window, {
          duration: 0.5,
          scrollTo: { y: id, offsetY: 0 },
          ease: "power2.out"
        });
      });
    });

    // Theo dõi cuộn và thêm class 'active' tự động
    links.forEach((link) => {
      const id = link.getAttribute("href");

      if (!id || !id.startsWith("#") || !document.querySelector(id)) {
        // console.warn("Liên kết không hợp lệ hoặc không tìm thấy phần tử:", id);
        return;
      }

      const section = document.querySelector(id);
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        // markers: true,
        onEnter: () => {
          links.forEach((item) => item.classList.remove("active"));
          link.classList.add("active");
        },
        onEnterBack: () => {
          links.forEach((item) => item.classList.remove("active"));
          link.classList.add("active");
        },
        onLeave: () => link.classList.remove("active"),
        onLeaveBack: () => link.classList.remove("active")
      });
    });
  });
  // hiệu ứng

  // Thiết lập trạng thái ban đầu
  gsap.set(".sticky-menu__container ul li:nth-child(-n+3)", {
    autoAlpha: 1, // <li> 1, 2, 3 hiện
    width: "auto"
  });

  gsap.set(".sticky-menu__container ul li:nth-child(4)", {
    autoAlpha: 0, // <li> 4 ẩn
    width: "0",
    padding: "0"
  });

  // Tạo timeline cho hiệu ứng
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".product-variant",
      start: "top 100%", // Khi đỉnh section product-variant cách top viewport 20%
      end: "bottom top", // Kết thúc khi đáy section chạm top viewport
      toggleActions: "play none none reverse", // Chạy timeline khi vào, đảo ngược khi ra
      // markers: true, // Uncomment để debug với markers
      onUpdate: (self) => {
        const variant = document.querySelector(".product-variant");
        if (variant.classList.contains("done")) {
          tl.play();
        } else {
          tl.reverse();
        }
      }
    }
  });

  // Thêm các hiệu ứng vào timeline
  tl
    // Scale sticky-menu__container về 0
    .to(".sticky-menu__container", {
      scale: 0,
      duration: 0.3,
      ease: "power2.in"
    })
    // Ẩn li 1, 2, 3 và hiện li 4 (đồng thời)
    .to(
      ".sticky-menu__container ul li:nth-child(-n+3)",
      {
        autoAlpha: 0,
        width: "0",
        padding: "0",
        duration: 0.5,
        ease: "power2.inOut"
      },
      "<" // Chạy đồng thời với bước scale về 0
    )
    .to(
      ".sticky-menu__container ul li:nth-child(4)",
      {
        autoAlpha: 1,
        width: "auto",
        padding: "initial",
        duration: 0.5,
        ease: "power2.inOut"
      },
      "<" // Chạy đồng thời với bước trên
    )
    // Scale sticky-menu__container về 1
    .to(".sticky-menu__container", {
      scale: 1,
      duration: 0.3,
      transformOrigin: "center",
      ease: "power2.out"
    });
}
stickyMenu();
function swiperDiscover() {
  const swiperDiscoverContainers = document.querySelectorAll(
    ".swiper-discover-img"
  );
  if (!swiperDiscoverContainers.length) return;

  swiperDiscoverContainers.forEach((container) => {
    new Swiper(container, {
      slidesPerView: 1,
      pagination: {
        el: container.querySelector(".swiper-pagination")
      },
      navigation: {
        nextEl: container.querySelector(".swiper-button-next"),
        prevEl: container.querySelector(".swiper-button-prev")
      }
    });
  });
}

function customCursor() {
  const cursor = document.querySelector(".cursor");
  const target = document.querySelector(".content-top__image");

  if (!cursor || !target) return;

  gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

  let active = false;

  target.addEventListener("mouseenter", () => {
    active = true;
    gsap.to(cursor, { opacity: 1, duration: 0.3, ease: "power2.out" });
  });

  target.addEventListener("mouseleave", () => {
    active = false;
    gsap.to(cursor, { opacity: 0, duration: 0.3, ease: "power2.out" });
  });

  document.addEventListener("mousemove", (e) => {
    if (!active) return;
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.2,
      ease: "power2.out"
    });
  });
}

const init = () => {
  intro();
  productDetail();
  hero();
  animationText();
  text();
  swiperDiscover();
  animateZoomIn();
  changeVariantProduct();
  customCursor();
  document
    .querySelectorAll(".button-custom")
    .forEach(
      (button) =>
        (button.innerHTML =
          "<div><span>" +
          button.textContent.trim().split("").join("</span><span>") +
          "</span></div>")
    );
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

$(window).on("beforeunload", function () {
  window.scrollTo(0, 0);
});
