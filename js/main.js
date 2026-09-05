/* ==========================================================================
   DEMO Hardware — Home Page Scripts (jQuery)
   ========================================================================== */
(function ($) {
  "use strict";

  $(function () {

    /* ------------------------------------------------------------------ */
    /* WOW.js init — scroll reveal animations                             */
    /* ------------------------------------------------------------------ */
    if (typeof WOW !== "undefined") {
      new WOW({ live: false, offset: 60 }).init();
    }

    /* ------------------------------------------------------------------ */
    /* Footer year                                                        */
    /* ------------------------------------------------------------------ */
    $("#year").text(new Date().getFullYear());

    /* ------------------------------------------------------------------ */
    /* Sticky header — solid on scroll, hide on scroll-down, show on      */
    /* scroll-up.                                                         */
    /* ------------------------------------------------------------------ */
    var $header = $("#siteHeader");
    var lastScroll = 0;
    var scrollTicking = false;

    function handleHeaderScroll() {
      var current = $(window).scrollTop();

      if (current > 60) {
        $header.addClass("header--scrolled");
      } else {
        $header.removeClass("header--scrolled");
      }

      if (current > lastScroll && current > 220) {
        $header.addClass("header--hidden");
      } else {
        $header.removeClass("header--hidden");
      }

      lastScroll = current;
      scrollTicking = false;
    }

    $(window).on("scroll", function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(handleHeaderScroll);
        scrollTicking = true;
      }
    });

    /* ------------------------------------------------------------------ */
    /* Active nav link on scroll (simple scrollspy)                       */
    /* ------------------------------------------------------------------ */
    var $navLinks = $(".main-nav a");
    var $sections = $navLinks.map(function () {
      var target = $($(this).attr("href"));
      return target.length ? target : null;
    });

    function updateActiveNav() {
      var scrollPos = $(window).scrollTop() + 160;
      var activeIndex = -1;

      $sections.each(function (i, el) {
        if ($(el).length && $(el).offset().top <= scrollPos) {
          activeIndex = i;
        }
      });

      $navLinks.removeClass("active");
      if (activeIndex > -1) {
        $navLinks.eq(activeIndex).addClass("active");
      }
    }
    $(window).on("scroll", updateActiveNav);
    updateActiveNav();

    /* ------------------------------------------------------------------ */
    /* Scroll to top button                                               */
    /* ------------------------------------------------------------------ */
    var $scrollTop = $("#scrollTop");

    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 500) {
        $scrollTop.addClass("is-visible");
      } else {
        $scrollTop.removeClass("is-visible");
      }
    });

    $scrollTop.on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 650);
    });

    /* ------------------------------------------------------------------ */
    /* Smooth-scroll for in-page anchor links (offset for fixed header)   */
    /* ------------------------------------------------------------------ */
    $('a[href^="#"]').on("click", function (e) {
      var hash = $(this).attr("href");
      if (hash === "#" || hash === "#top") return;
      var $target = $(hash);
      if ($target.length) {
        e.preventDefault();
        var offset = $(window).width() < 768 ? 78 : 104;
        $("html, body").animate({ scrollTop: $target.offset().top - offset }, 700);

        // close mobile offcanvas if open
        var $offcanvas = $(".offcanvas.show");
        if ($offcanvas.length && typeof bootstrap !== "undefined") {
          var instance = bootstrap.Offcanvas.getInstance($offcanvas[0]);
          if (instance) instance.hide();
        }
      }
    });

    /* ------------------------------------------------------------------ */
    /* Count-up stats when the stats band scrolls into view               */
    /* ------------------------------------------------------------------ */
    var countersStarted = false;

    function animateCounters() {
      if (countersStarted) return;
      var $counters = $(".counter");
      if (!$counters.length) return;

      var bandTop = $counters.first().closest("section").offset().top;
      var trigger = $(window).scrollTop() + $(window).height() - 120;

      if (trigger < bandTop) return;

      countersStarted = true;
      $counters.each(function () {
        var $this = $(this);
        var target = parseInt($this.data("count"), 10) || 0;

        $({ val: 0 }).animate(
          { val: target },
          {
            duration: 1600,
            easing: "swing",
            step: function (now) {
              $this.text(Math.floor(now).toLocaleString("en-US"));
            },
            complete: function () {
              $this.text(target.toLocaleString("en-US"));
            }
          }
        );
      });
    }

    $(window).on("scroll", animateCounters);
    animateCounters();

    /* ------------------------------------------------------------------ */
    /* Lightweight parallax on hero + CTA background images               */
    /* ------------------------------------------------------------------ */
    var $heroParallax = $("#heroParallax");
    var $ctaParallax = $("#ctaParallax");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function applyParallax() {
      if (reduceMotion || $(window).width() < 768) return;

      var scrollY = $(window).scrollTop();

      if ($heroParallax.length) {
        var heroOffset = $heroParallax.closest("section").offset().top;
        var heroDelta = (scrollY - heroOffset) * 0.18;
        $heroParallax.css("transform", "translate3d(0," + heroDelta + "px,0)");
      }

      if ($ctaParallax.length) {
        var ctaSection = $ctaParallax.closest("section");
        var ctaTop = ctaSection.offset().top;
        var viewportBottom = scrollY + $(window).height();

        if (viewportBottom > ctaTop && scrollY < ctaTop + ctaSection.outerHeight()) {
          var ctaDelta = (scrollY - ctaTop) * 0.12;
          $ctaParallax.css("transform", "translate3d(0," + ctaDelta + "px,0)");
        }
      }
    }

    $(window).on("scroll", applyParallax);
    applyParallax();

    /* ------------------------------------------------------------------ */
    /* Form UX — prevent default submit, show inline confirmation         */
    /* (no backend wired up in this static demo)                          */
    /* ------------------------------------------------------------------ */
    $("#quoteForm").on("submit", function (e) {
      e.preventDefault();
      var $btn = $(this).find("button[type=submit]");
      var original = $btn.html();
      $btn.html('<i class="fa-solid fa-check"></i> Request Sent').prop("disabled", true);
      setTimeout(function () {
        $btn.html(original).prop("disabled", false);
        $("#quoteForm")[0].reset();
      }, 2600);
    });

    $("#newsletterForm").on("submit", function (e) {
      e.preventDefault();
      var $btn = $(this).find("button[type=submit]");
      var original = $btn.text();
      $btn.text("Subscribed").prop("disabled", true);
      setTimeout(function () {
        $btn.text(original).prop("disabled", false);
        $("#newsletterForm")[0].reset();
      }, 2600);
    });

  });
})(jQuery);
