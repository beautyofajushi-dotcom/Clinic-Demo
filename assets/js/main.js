/* Agrawal Dental Studio — interactions v2 (cinematic + themes) */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ----- Theme toggle ----- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("ads-theme", t); } catch (e) { /* private mode */ }
    if (themeToggle) themeToggle.setAttribute("aria-pressed", t === "dark");
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ----- Scroll progress bar ----- */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  /* ----- Sticky header / progress / back-to-top ----- */
  var header = document.getElementById("siteHeader");
  var toTop = document.getElementById("toTop");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (header) header.classList.toggle("scrolled", y > 10);
      if (toTop) toTop.classList.toggle("show", y > 600);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      if (!reduced) parallax(y);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----- Hero parallax (cinematic depth) ----- */
  var heroFrame = document.querySelector(".hero-media .frame");
  var heroBadge = document.querySelector(".spin-badge");
  function parallax(y) {
    if (y > window.innerHeight * 1.4) return; /* only near hero */
    if (heroFrame) heroFrame.style.transform = "translateY(" + y * 0.07 + "px)";
    if (heroBadge) heroBadge.style.transform = "translateY(" + y * -0.05 + "px)";
  }

  /* ----- Mobile nav ----- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ----- Cinematic reveal on scroll ----- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var delay = parseInt(e.target.getAttribute("data-delay") || "0", 10);
          setTimeout(function () { e.target.classList.add("revealed"); }, delay);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
  }

  /* ----- Animated counters ----- */
  var counters = document.querySelectorAll("[data-count]");
  var runCounter = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = target.toLocaleString("en-IN") + suffix; return; }
    var dur = 1600, start = null;
    var stepFn = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
      if (p < 1) requestAnimationFrame(stepFn);
    };
    requestAnimationFrame(stepFn);
  };
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ----- 3D tilt on cards (cinematic) ----- */
  if (finePointer && !reduced) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("mousemove", function (ev) {
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(1000px) rotateX(" + (py * -5).toFixed(2) + "deg) rotateY(" +
          (px * 5).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ----- Testimonial slider ----- */
  var slider = document.querySelector(".ts-slider");
  if (slider) {
    var track = slider.querySelector(".ts-track");
    var slides = slider.querySelectorAll(".ts-slide");
    var dotsWrap = slider.querySelector(".ts-dots");
    var idx = 0, timer = null;

    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      d.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      dots.forEach(function (d, j) { d.classList.toggle("on", j === idx); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduced) timer = setInterval(function () { go(idx + 1); }, 6500);
    }
    slider.querySelector(".ts-prev").addEventListener("click", function () { go(idx - 1); restart(); });
    slider.querySelector(".ts-next").addEventListener("click", function () { go(idx + 1); restart(); });
    slider.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    slider.addEventListener("mouseleave", restart);
    go(0); restart();
  }

  /* ----- Accordion (with correct init for pre-opened items) ----- */
  function setOpenHeight(item) {
    var body = item.querySelector(".acc-body");
    body.style.maxHeight = body.scrollHeight + "px";
  }
  document.querySelectorAll(".acc-item.open").forEach(setOpenHeight);
  document.querySelectorAll(".acc-item").forEach(function (item) {
    var head = item.querySelector(".acc-head");
    head.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      item.closest(".acc").querySelectorAll(".acc-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".acc-body").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        setOpenHeight(item);
      }
    });
  });
  window.addEventListener("resize", function () {
    document.querySelectorAll(".acc-item.open").forEach(setOpenHeight);
  });
  window.addEventListener("load", function () {
    document.querySelectorAll(".acc-item.open").forEach(setOpenHeight);
  });

  /* ----- Appointment form (demo) ----- */
  var formCard = document.getElementById("formCard");
  var form = document.getElementById("bookingForm");
  if (form && formCard) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var name = (form.querySelector("#fName").value || "").trim().split(" ")[0];
      var ref = "ADS-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
      document.getElementById("successMsg").innerHTML =
        "Thank you" + (name ? ", <strong>" + name + "</strong>" : "") +
        "! Your appointment request has been received. Our front desk will call you within 2 hours (10:00–20:00) to confirm your slot.";
      document.getElementById("successRef").textContent = "Reference ID: " + ref;
      formCard.classList.add("sent");
      formCard.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    });
  }

  /* ----- Booking date min = today ----- */
  var dateInput = document.getElementById("fDate");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  /* ----- Back to top ----- */
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  /* ----- Footer year ----- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  onScroll();
})();
