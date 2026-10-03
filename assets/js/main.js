/* Agrawal Dental Studio — shared interactions */
(function () {
  "use strict";

  /* ----- Sticky header ----- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    var toTop = document.getElementById("toTop");
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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

  /* ----- Reveal on scroll ----- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
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
    var dur = 1600;
    var start = null;
    var stepFn = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString("en-IN") + suffix;
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
    counters.forEach(function (el) {
      el.textContent = parseInt(el.getAttribute("data-count"), 10).toLocaleString("en-IN") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* ----- Testimonial slider ----- */
  var slider = document.querySelector(".ts-slider");
  if (slider) {
    var track = slider.querySelector(".ts-track");
    var slides = slider.querySelectorAll(".ts-slide");
    var dotsWrap = slider.querySelector(".ts-dots");
    var idx = 0;
    var timer = null;

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
      timer = setInterval(function () { go(idx + 1); }, 6500);
    }
    slider.querySelector(".ts-prev").addEventListener("click", function () { go(idx - 1); restart(); });
    slider.querySelector(".ts-next").addEventListener("click", function () { go(idx + 1); restart(); });
    slider.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    slider.addEventListener("mouseleave", restart);
    go(0); restart();
  }

  /* ----- Accordion ----- */
  document.querySelectorAll(".acc-item").forEach(function (item) {
    var head = item.querySelector(".acc-head");
    var body = item.querySelector(".acc-body");
    head.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      item.closest(".acc").querySelectorAll(".acc-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".acc-body").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
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
      var msg = document.getElementById("successMsg");
      msg.innerHTML = "Thank you" + (name ? ", <strong>" + name + "</strong>" : "") +
        "! Your appointment request has been received. Our front desk will call you within 2 hours (10:00–20:00) to confirm your slot.";
      document.getElementById("successRef").textContent = "Reference ID: " + ref;
      formCard.classList.add("sent");
      formCard.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ----- Back to top ----- */
  var toTop = document.getElementById("toTop");
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ----- Booking date min = today ----- */
  var dateInput = document.getElementById("fDate");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  /* ----- Footer year ----- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
