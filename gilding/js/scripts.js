/*jslint browser: true */
/*global $, console */
// Site namespace/module
var LEAH = {};


LEAH.categories = (function() {
	"use strict";
		 
	var
		categoryData,
		currentCategory,
		currentCatName = '',
		currentSubCatIndex = 0,
		currentSlide = 1, // Set this to 1 because when we load the carousel, the first slide is dimmed out the 2nd one shows.
		mainFilePath = './img/',
		imgs = {},
		loadedImgs = {}, // Holds flags to determine if images have loaded.
		slides = {},
		localData = [],
		
		initCategories = function() {
			$('nav .portfolio').click($.proxy(handleClick, this));
			loadPage('about-page');
			return false;
		},
		
		handleClick = function(e) {
			var $el = $(e.currentTarget);
			$('nav .current').removeClass('current');
			$(e.currentTarget).addClass('current');
			deleteVideo();
			if ($el.hasClass('page')) {
				loadPage.call(this, e);
			} else {
				loadCategory.call(this, e);
			}
			return false;
		},
		
		loadCategory = function(e) {
			var that = this,
				dataPath = e.currentTarget.href;
			currentCategory = dataPath.split('/')[dataPath.split('/').length-1];
			e.preventDefault();
			if (!slides[currentCategory]) {
				slides[currentCategory] = [];
				imgs[currentCategory] = [];
				$.ajax({
					dataType: 'json',
					url: dataPath,
					success: function(data) {
						if (localData.length === 0 || localData[data.name] !== null) {
							localData[data.name] = data;
						}
						currentCatName = data.name;
						currentSubCatIndex = 0;
						clearContent();
						loadCatImgs.call(that, data, currentSubCatIndex);
					}
				});
			} else {
				showCarousel();
				clearContent();
			}
			$('.slideshow-content').toggleClass('hidden', false);
			$('.subpage-content').toggleClass('hidden', true);
			$("#subcat-nav.hidden").removeClass("hidden");
		},

		// Array shuffling algorithm. Used for the about page to pick a random number 3 times.
		fisherYates = function(myArray) {
			var i = myArray.length,
				j,
				tempi,
				tempj;
			if (i === 0) {
				return false;
			}
			while (--i) {
				j = Math.floor( Math.random() * ( i + 1 ) );
				tempi = myArray[i];
				tempj = myArray[j];
				myArray[i] = tempj;
				myArray[j] = tempi;
			}
		},

		// Assume 20 images in the about folder. Pick three.
		randomizeImgs = function() {
			var numItems = 131,
			items = [],
			i = 0,
			html = '';

			// Seed the array.
			for (i=0; i<numItems; i++) {
				items.push(i+1);
			}

			fisherYates(items);
			$('.image-strip').empty();
			for (i=0;i<4;i++) {
				html += '<img src="img/about/about'+items[i]+'.jpg" />';
			}
			$('.image-strip').html(html);
		},


		loadPage = function(e) {
			var type;
			if (typeof e === 'string') {
				type = e;
			} else {
				type = $(e.target).attr('data-type');
			}
			$('.'+type).toggleClass('hidden', false);
			$('.subpage-content').not('.'+type).toggleClass('hidden', true);
			$('.slideshow-content').toggleClass('hidden', true);
			if (type === 'about-page') {
				randomizeImgs();
				loadVideo();
			}
		},
		
		loadVideo = function() {
			//$('.video').html('<iframe frameborder="0" width="480" height="267" scrolling="no" src="http://link.brightcove.com/services/player/bcpid2538399966001/?bctid=2404809791001" ></iframe>');
		},

		deleteVideo = function() {
			//$('.video').html('');
		},

		/*
		 * parameter: subcategory data
		 */
		loadCatImgs = function(catData, subCatIndex) {
			var full,
				altTitle;
					$(catData.slides).each(function(j, val){
						full=mainFilePath + catData.subPath  + val.fileName;
						altTitle=val.description;
							slides[currentCategory].push({
								"full": full,
								"altTitle": altTitle
							});
					});
				clearContent();
				createCarousel();
				
		},
			
		clearContent = function(){
			//$('.carousel').trigger('destroy');
			//$('.carousel li').detach();

		},

		setVisible = function(s) {
			$(s[1]).addClass('highlighted');
			$(s[0]).removeClass('highlighted');
		},

		positionText = function($el) {
			$('[data-category="'+currentCategory+'"] .caption').css({
				'width' : $el.width(),
				'margin-left' : $el.position().left
			}).html(slides[currentCategory][currentSlide].altTitle);
		},

		previousSlide = function(s) {
			var $el = $(s.items.visible[1]);
			setVisible(s.items.visible);

			currentSlide -= 1;
			if (currentSlide < 0) {
				currentSlide = slides[currentCategory].length-1;
			}

			positionText($el);
			
		},

		nextSlide = function(s) {
			var $el = $(s.items.visible[1]);
			setVisible(s.items.visible);
			currentSlide += 1;
			if (currentSlide>=slides[currentCategory].length) {
				currentSlide = 0;
			}
			positionText($el);
		},
	
		allImagesLoaded = function(i) {
			loadedImgs[currentCategory].pop();
			if (loadedImgs[currentCategory].length === 0) {
				loadCarousel();
				return true;
			}
			
			return false;

		},

		createCarousel = function(){
			var i,
				html = '',
				that = this,
				imgSrc,
				img,
				preloadSize = 4;

			currentSlide = 1;
			// Preload the first 3 images.
			imgs[currentCategory] = [];
			loadedImgs[currentCategory] = [];
			// Prime the pump.
			for (i=0; i<preloadSize; i++) {
				imgSrc = slides[currentCategory][i].full;
				loadedImgs[currentCategory][i] = 'notloaded';
			}

			for (i=0; i<preloadSize; i++) {
				imgSrc = slides[currentCategory][i].full;
				img = new Image();
				img.setAttribute('data-index', i);
				imgs[currentCategory].push(img);

				
				imgs[currentCategory][imgs[currentCategory].length-1].onload = function() {
					var $el = $(this);
					allImagesLoaded();
				};
				imgs[currentCategory][imgs[currentCategory].length-1].src = imgSrc;
			}
		},

		showCarousel = function() {
			$('div.slideshow-content').toggleClass('hidden', false);
			$('.carousel-container').toggleClass('hidden', true);
			$('[data-category="'+currentCategory+'"]').toggleClass('hidden', false);
		},

		loadCarousel = function() {
			var i,
				html = '',
				container = '',
				carouselId = currentCategory.split('.')[0];
			for (i=0; i<slides[currentCategory].length; i++) {
				html += '<li><img src="'+slides[currentCategory][i].full+'" /></li>';
			}

			$('.carousel-container').toggleClass('hidden', true);
			$('div.slideshow-content').toggleClass('hidden', false);
			
			container += '<div class="carousel-container" data-category="' + currentCategory + '">';
			container += '<ul class="carousel" id="'+carouselId+'"></ul><div class="caption"></div>';
			container += '<div id="subcat-nav"><a class="prev" id="'+carouselId+'prev">&#60;</a><a id="'+carouselId+'next">&#62;</a></div></div>';

			$('.slideshow-content').prepend(container);

			$('#'+carouselId).append(html).carouFredSel({
				items	: 4,
				width   : 'variable',
				scroll	: {
					items			: 1,
					duration		: 500,
					timeoutDuration	: 1000
				},
				auto	: false,
				prev	: {
					button : '#'+carouselId+'prev',
					onAfter : function(s) {
						previousSlide(s);
					}
				},
				next	: {
					button : '#'+carouselId+'next',
					onAfter : function(s) {
						nextSlide(s);
					}
				},
				onCreate : function(s) {
					var $el;
					setVisible(s.items);
					$el = $(s.items[1]);
					positionText($el);
					//$('.caption').css('width', $el.width()).html(slides[currentCategory][currentSlide].altTitle);
				}
			});
			
		};

		return {
			initCategories : initCategories
		};

})();


$(function() {
	LEAH.categories.initCategories();
	
});