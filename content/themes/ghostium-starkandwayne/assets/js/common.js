;(function ($) {

	/*-------------------------------------
		Loader
	-------------------------------------*/
	$(window).load(function () {
		$('#status').fadeOut();
		$('#preloader').delay(1000).fadeOut('slow');
		$('body.dark-load').removeClass('dark-load');

		$('[href^=http]').attr('target', '_blank');

		$.each($('code'), function (_, c) {
			$(c).html(c.textContent
			           .replace(/:::((.|\n)*?):::/mg,
			                    '<span class="hi">$1</span>'));
		});
	})

	/*-------------------------------------
	Header normal
	—-----------------------------------*/
	if ($(window).width() < 1160) {
		var headertp1 = $(".header-type-1");
		headertp1.addClass("page-header");	
		headertp1.attr('id', 'top-nav');	
	}

	/*-------------------------------------
	Top nav
	-------------------------------------*/
	$(function(){	
      // scroll is still position
		var scroll = $(document).scrollTop(),
			window_view = $(window),
			headerHeight = $('.page-header').outerHeight();

		/*-------------------------------------
		Top menu - fixed
		-------------------------------------*/
		window_view.on('scroll', function() {
			var winTop = window_view.scrollTop(),
				top_nav = $("#top-nav");

				if(winTop >= 150){
			top_nav.addClass("is-sticky");
			}else{
				top_nav.removeClass("is-sticky");
			}
			/*-------------------------------------
				Back to top link
			-------------------------------------*/
			$(function(){
				var y = $(this).scrollTop(),
					top = $('.top');
				if (y > 1000) {
					top.fadeIn('slow');
				} else {
					top.fadeOut('slow');
				}
			});

			/*-------------------------------------
			Hide Header on on scroll down
			-------------------------------------*/
			$(function(){
				// scrolled is new position just obtained
				var scrolled = $(document).scrollTop(),
					page_header = $('.page-header');
				
					if (scrolled > headerHeight){
						page_header.addClass('off-canvas-menu');
					} else {
						page_header.removeClass('off-canvas-menu');
					}

				    if (scrolled > scroll){
				         // scrolling down
						 page_header.removeClass('fixed-tp-menu');
				      } else {
						  //scrolling up
						  page_header.addClass('fixed-tp-menu');
				    }				
					 
					scroll = $(document).scrollTop();	
				});
			})
	});


	/*-------------------------------------
		Top menu - Superfish
	-------------------------------------*/
	$('ul.sf-menu').superfish({
		delay: 50,
		speed: 'normal',
		animation:     {opacity:'show'},   // an object equivalent to first parameter of jQuery’s .animate() method. Used to animate the submenu open
		animationOut:  {opacity:'hide'},
		cssArrows: true,
		disableHI: false,
		easing: 'fade',
		touchMove: false,
		swipe: false
	});

	/*-------------------------------------
	Accordion
	-------------------------------------*/
	$('.accordion:nth-child(1n)').accordion({
		heightStyle: 'content'
	});

	/*-------------------------------------
		Parallax
	-------------------------------------*/
	$('.img-parallax').parallax("50%", .50);

	/*-------------------------------------
		Slider portfolio
	-------------------------------------*/
	function initSliders(){
		$('.slider-portfolio').slick({
			dots: true,
			fade: true,
			appendDots: '#dots-control-portfolio-slider',
			dotsClass: 'dots',
			autoplay: true,
			autoplaySpeed: 8000,
			autoHeight: false,
			adaptiveHeight: true,
			mobileFirst: true,
			touch: false,
			cssEase: 'linear',
			prevArrow: $('#control-portfolio-slider > .wrap-prev'),
			nextArrow: $('#control-portfolio-slider > .wrap-next'),
		});
		
	}

	$('.slider-wrap', this).each(function() {
		
		var $dots = $(this).find('#dots-control-portfolio-slider');
		var $arrows = $(this).find('#control-portfolio-slider');
		var $next = $arrows.children(".wrap-next");    
		var $prev = $arrows.children(".wrap-prev");

		var $slick_slider = $(this).children(".slider-portfolio-single");

		// $arrows.css('display', 'none');
		$slick_slider.slick({
			dots: true,
			fade: true,
			appendDots: $dots,
			dotsClass: 'dots',
			autoplay: true,
			autoplaySpeed: 8000,
			autoHeight: false,
			cssEase: 'linear',
			prevArrow: $prev,
			nextArrow: $next
		});
	});

	/*-------------------------------------
		Into slider
	-------------------------------------*/
	$(function() {
		var introHeader = $('.intro'),
			window_view = $(window),
			intro = $('.intro');

		buildModuleHeader(introHeader);

		window_view.resize(function() {
			var width = Math.max(window_view.width(), window_view.innerWidth);
			buildModuleHeader(introHeader);
		});

		window_view.scroll(function() {
			effectsModuleHeader(introHeader, this);
		});

		function buildModuleHeader(introHeader) {
		};
		function effectsModuleHeader(introHeader, scrollTopp) {
			if (introHeader.length > 0) {
				var homeSHeight = introHeader.height();
				var topScroll = $(document).scrollTop();
				if ((introHeader.hasClass('intro')) && ($(scrollTopp).scrollTop() <= homeSHeight)) {
					// introHeader.css('top', (topScroll * .4));
				}
				if (introHeader.hasClass('intro') && ($(scrollTopp).scrollTop() <= homeSHeight)) {
					introHeader.css('opacity', (1 - topScroll/introHeader.height() * 1));
				}
			}
		};
	});

	/*-------------------------------------
		Tabs
	-------------------------------------*/
	$( ".tabs:nth-child(1n)" ).tabs();
	$('#data-systems .carousel:nth-child(1n)').slick({
		dots: true,
		dotsClass: 'dots',
		appendDots: '#dots-control-data-systems',
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 8000,
		infinite: true,
		arrows: false,
		slidesToShow: 5,
		responsive: [
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 5,
				slidesToScroll: 2,
				infinite: false,
				dots: true
			}
		},
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 5,
				slidesToScroll: 1,
				infinite: false,
				dots: true
			}
		},{
			breakpoint: 1024,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: false,
				dots: true
			}
		},
		{
			breakpoint: 992,
				settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: false,
				dots: true
			}
		},

		{
		breakpoint: 600,
			settings: {
			slidesToShow: 3,
			slidesToScroll: 2
			}
		},
		{
		breakpoint: 500,
			settings: {
			slidesToShow: 2,
			slidesToScroll: 2
			}
		},

		{
		breakpoint: 480,
			settings: {
			slidesToShow: 1,
			slidesToScroll: 1
			}
		}
	 // You can unslick at a given breakpoint now by adding:
	 // settings: "unslick"
	 // instead of a settings object
		]
	});
	$('#platform .carousel:nth-child(1n)').slick({
		dots: true,
		dotsClass: 'dots',
		appendDots: '#dots-control-platform',
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 8000,
		infinite: true,
		arrows: false,
		slidesToShow: 5,
		responsive: [
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 2,
				infinite: false,
				dots: true
			}
		},
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: false,
				dots: true
			}
		},{
			breakpoint: 1024,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: false,
				dots: true
			}
		},
		{
			breakpoint: 992,
				settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: false,
				dots: true
			}
		},

		{
		breakpoint: 600,
			settings: {
			slidesToShow: 3,
			slidesToScroll: 2
			}
		},
		{
		breakpoint: 500,
			settings: {
			slidesToShow: 2,
			slidesToScroll: 2
			}
		},

		{
		breakpoint: 480,
			settings: {
			slidesToShow: 1,
			slidesToScroll: 1
			}
		}
	 // You can unslick at a given breakpoint now by adding:
	 // settings: "unslick"
	 // instead of a settings object
		]
	});
	/*-------------------------------------
		Drag images restagt
	-------------------------------------*/
	$('img, a').on('dragstart', function(event) { event.preventDefault(); });

	/*-------------------------------------
		Smooth Scroll to link
	-------------------------------------*/
	$('a.smooth-scroll').on('click', function (event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top - 0
		}, {
			duration: 1000,
			specialEasing: {
				width: "linear",
				height: "easeInOutCubic"
			}
		});
		event.preventDefault();
	});

	/*-------------------------------------
		Background slider function
	-------------------------------------*/
	$('.background-image').each(function(){
		var url = $(this).attr('data-image');
		if(url){
			$(this).css('background-image', 'url(' + url + ')');
		}
	});

	/*-------------------------------------
		Full screen slider - Slick
	-------------------------------------*/
	/*$('.full-slider').slick({
		dots: true,
		fade: true,
		appendDots: '#dots-control-full-slider',
		dotsClass: 'dots',
		autoplay: true,
		autoplaySpeed: 8000,
		autoHeight: false,
		adaptiveHeight: true,
		mobileFirst: true,
		touch: false,
		cssEase: 'linear',
		prevArrow: $('#control-full-slider > .wrap-prev'),
		nextArrow: $('#control-full-slider > .wrap-next'),
	});*/

	/*-------------------------------------
		Slider animation full screen
	-------------------------------------*/
	$('.full-slider').on('afterChange', function(event, slick, currentSlide){
		$('.slick-active .heading-title-big').removeClass('opacity-none');
		$('.slick-active .heading-title-big').addClass('animated fadeInDown');
		//
		$('.slick-active .description').removeClass('opacity-none');
		$('.slick-active .description').addClass('animated slideInUp');
		//
		$('.slick-active .description-slide').removeClass('opacity-none');
		$('.slick-active .description-slide').addClass('animated fadeInUp');

	});

	$('.full-slider').on('beforeChange', function(event, slick, currentSlide){
		$('.slick-active .heading-title-big').addClass('opacity-none');
		$('.slick-active .heading-title-big').removeClass('animated fadeInDown');
		//
		$('.slick-active .description').addClass('opacity-none');
		$('.slick-active .description').removeClass('animated slideInUp');
		//
		$('.slick-active .description-slide').addClass('opacity-none');
		$('.slick-active .description-slide').removeClass('animated fadeInUp');
	});

	/*-------------------------------------
		directionalHover
	-------------------------------------*/
	$('.dh-container').directionalHover();
	/*-------------------------------------
		Testimonials
	-------------------------------------*/
	$('.testimonials-items').slick({
		dots: true,
		dotsClass: 'dots',
		appendDots: '#dots-control-testimonials',
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 8000,
		infinite: true,
		slidesToShow: 3,
		prevArrow: $('#control-customers > .wrap-prev'),
		nextArrow: $('#control-customers > .wrap-next'),
		responsive: [
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 2,
				infinite: false,
				dots: true
			}
		},
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 2,
				infinite: false,
				dots: true
			}
		},
		{
			breakpoint: 1024,
				settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
				infinite: false,
				dots: true
			}
		},

		{
		breakpoint: 600,
			settings: {
			slidesToShow: 2,
			slidesToScroll: 2
			}
		},

		{
		breakpoint: 480,
			settings: {
			slidesToShow: 1,
			slidesToScroll: 1
			}
		}
	 // You can unslick at a given breakpoint now by adding:
	 // settings: "unslick"
	 // instead of a settings object
		]
	});

	/*-------------------------------------
		Our clients
	-------------------------------------*/
	$('#clients-carousel').slick({
		dots: false,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 8000,
		infinite: true,
		slidesToShow: 4,
		prevArrow: $('#control-clients > .wrap-prev'),
		nextArrow: $('#control-clients > .wrap-next'),
		responsive: [
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 2,
				infinite: false,
				dots: false
			}
		},
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 2,
				infinite: false,
				dots: false
			}
		},
		{
			breakpoint: 1024,
				settings: {
				slidesToShow: 3,
				slidesToScroll: 2,
				infinite: false,
				dots: false
			}
		},

		{
		breakpoint: 600,
			settings: {
			slidesToShow: 3,
			slidesToScroll: 2
			}
		},

		{
		breakpoint: 480,
			settings: {
			slidesToShow: 1,
			slidesToScroll: 1
			}
		}
	 // You can unslick at a given breakpoint now by adding:
	 // settings: "unslick"
	 // instead of a settings object
		]
	});


	/*-------------------------------------
		E-mail Ajax Send
	-------------------------------------*/
	$('.contact-form-sub:nth-child(1n)').on('submit',function() {
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			th.trigger("reset");
			th.find('.success-msg').slideToggle('slow');
			setTimeout(function() {
				// Done Functions
				th.find('.success-msg').slideToggle('hide');
			}, 3000);
		});
		return false;
	});

	/*-------------------------------------
		Triggers carousel
	-------------------------------------*/
	/*$('#trigger-carousel').slick({
		dots: true,
		dotsClass: 'dots',
		appendDots: '#dots-control-triggers',
		slidesToScroll: 2,
		autoplay: true,
		autoplaySpeed: 8000,
		arrows: false,
		infinite: true,
		slidesToShow: 3,
		responsive: [
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 2,
				infinite: false,
			}
		},
		{
			breakpoint: 1170,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 2,
				infinite: false,
			}
		},
		{
			breakpoint: 1024,
				settings: {
				slidesToShow: 3,
				slidesToScroll: 2,
				infinite: false,
			}
		},

		{
		breakpoint: 600,
			settings: {
			slidesToShow: 2,
			slidesToScroll: 2
			}
		},

		{
		breakpoint: 480,
			settings: {
			slidesToShow: 1,
			slidesToScroll: 1
			}
		}
	 // You can unslick at a given breakpoint now by adding:
	 // settings: "unslick"
	 // instead of a settings object
		]
	});*/

	/*-------------------------------------
		Mobile menu - full screen menu
	-------------------------------------*/
	$(function() {

		var $menu = $('#mobile-menu'),
			$body = $('body'),
			$fn = $('#mobile-menu'),
			$fnToggle = $('.toggle-mnu'),
			$logo = $('.logo'),
			$window = $(window);

			$menu.find('.menu-item-has-children > a').on('click', function(e) {
				e.preventDefault();
				if ($(this).next('ul').is(':visible')) {
					$(this).removeClass('sub-active').next('ul').slideUp(250);
				} else {
					$('.menu-item-has-children > a').removeClass('sub-active').next('ul').slideUp(250);
					$(this).addClass('sub-active').next('ul').slideToggle(250);
				}
			});

			var fnOpen = false;

			var fnToggleFunc = function() {
				fnOpen = !fnOpen;
				$body.toggleClass('fullscreen-nav-open');
				$fn.stop().fadeToggle(500);
				$fn.toggleClass("active");
				$('.toggle-mnu').toggleClass('on');
				$logo.toggleClass('on');
				$logo.toggleClass('dark-logo');

				return false;
			};

			$fnToggle.on('click', fnToggleFunc);

			$(document).on('keyup', function(e) {
				if (e.keyCode == 27 && fnOpen) {
					fnToggleFunc();
				}

			});

			$fn.find('li:not(.menu-item-has-children) > a').one('click', function() {
				fnToggleFunc();
				return true;
			});

			$menu.on('click', function(){
				fnToggleFunc();
				return true;
			});

			$('.inner-wrap, .fullscreen-menu-toggle').on('click', function(e){
				e.stopPropagation();
			});
	});

	/*-------------------------------------
		Top menu - full screen menu
	-------------------------------------*/
	$(function(){
		var $menu = $('.toggle-top'),
			$body = $('body');

		$menu.on('click', function(e){
			e.preventDefault();
			$(this).toggleClass('on-top');
			$body.toggleClass('active-fullscreen-topnav');
			$('.fullscreen-topnav').toggleClass('show-full-screen');
		});
	});


	/*-------------------------------------
		Who we are height
	-------------------------------------*/
	$('.right-full', this).each(function() {
		var height = $(this).outerHeight();
		$('.left-full').css('height', height);
	});

	/*-------------------------------------
		Blog sidebar height
	-------------------------------------*/
	if ($(window).width() > 768) {
		$('.single-post', this).each(function() {
			var height = $(this).outerHeight();
			$('#sidebar').css('height', height);
		});		
	}

	$('.item-service', this).each(function() {
		var height = $(this).find('.content-service').outerHeight();
		$(this).find('.icon-service').css('height', height);
	});


  if ($('.content').length > 0) {
    var headings = $('.content').find('h1,h2'),
        main = $('<ul>'),
       outer, inner, li;

    headings.each(function (i,e) {
      var type = e.nodeName,
          text = $(e).text();

      var anchor = $(e).attr('id');
      if (typeof(anchor) === 'undefined' || anchor == '') {
        anchor = text.toLowerCase()
                     .replace(/['"+()[]]+/g,  '')
                     .replace(/[^a-z0-9-]+/g, '-')
                     .replace(/^-/g, '')
                     .replace(/-$/g, '')

        $(e).attr('id', anchor);
      }

      li = $('<li><a href="#'+anchor+'">'+text+'</a></li>');
      if (type == 'H1') {
        outer = $(li);
        main.append(outer);
        inner = undefined;
      } else {
        if (typeof(inner) === 'undefined') {
          inner = $('<ul>');
          outer.append(inner);
        }
        inner.append($(li));
      }
    });
    $('.toc').html(main);
  }

  $(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
  $('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});
})(jQuery);
