/*jslint browser: true */
/*global $, console, GPF */
// Site namespace/module
var LEAH = {};

LEAH.portfolios = (function() {
	"use strict";

	var
		currentCategory,
		mainFilePath = './img/',
		slides = [],

		initCategories = function() {
			$('nav .portfolio').click($.proxy(handleClick, this));
			$('.overlay').click($.proxy(handlePageClick, this));
			return false;
		},

		handleClick = function(e) {
			var cat = e.target.href;
			e.preventDefault();
			loadCategory.call(this, cat);
			$('nav .current').removeClass('current');
			$(e.currentTarget).addClass('current');
			return false;
		},


		loadCategory = function(category) {
			clearCat();
			currentCategory = category;
				$.ajax({
					dataType: 'json',
					url: category,
					success: function(data) {
						drawImgs(data);
						initSlider();
					}
				});
		},

		drawImgs = function(d) {
			var thumb,
				full,
				altTitle,
				style;
				slides[currentCategory] = [];
				$(d.itemList).each(function(k, val) {
					thumb=mainFilePath + d.thumbnailPath + val.fileName.replace('jpg', 'png');
					full=mainFilePath + d.imagePath + val.fileName;
					altTitle=val.description;
					style=val.style;
					slides[currentCategory].push({
						"full": full,
						"thumb": thumb,
						"altTitle": altTitle
					});
				});

		},

		clearCat = function() {
			$('.panel').toggleClass('show', false);
			$('#leah-slideshow').toggleClass('show', true);
			$(".gpf-slides-container").remove();
			$("#carousel-nav").remove();
		},

		initSlider = function(){
			GPF.slideshow.init(
				{
					"slideshowId":"leah-slideshow", //specific slideshow id
					"fullSizeTargetId":"hero", //element to load full-size images
					"cssPath":"./slideshow.css",
					"slideMargin":7, //applied to left and right of each slide
					"slideVisibleCount": 15, //default number of slides to display
					"slideSpeed":500, //horizontal scroll - milliseconds
					"fadeInSpeed":1000, //slideshow fadein - milliseconds
					"fullSizeFadeInSpeed":1500, //full-size image - milliseconds
					"autoPlay": false, //true/false
					"autoPlayInterval": 15000, //milliseconds
					"thumbSize":[57, 56], //width,height
					"images": slides[currentCategory]
				}
			);
		},

		handlePageClick = function(e) {
			var type = $(e.currentTarget).attr('data-type');
			e.preventDefault();
			showPage(type);
			return false;
		},

		showPage = function(type) {
			$('.panel').removeClass('show');
			$('nav .current').removeClass('current');
			$('nav [data-type="'+type+'"]').addClass('current');
			$('#'+type).addClass('show');
			return false;
		},

		updateCounter = function(num) {
			$('.carousel-center').html(num);
		};

	return {
		initCategories : initCategories,
		loadCategory : loadCategory,
		showPage : showPage,
		updateCounter : updateCounter
	};

})();

$(function() {
  "use strict";
	LEAH.portfolios.loadCategory('data/illustrations.txt');
	LEAH.portfolios.initCategories();
  $('.navigation-menu-button').click(function() {
    $('body').toggleClass('slide');
  });
});

//this function fires on every slide click for a slideshow object
function gpfSlideshowClickCallback(slideshowObj,num){
	LEAH.portfolios.updateCounter(parseInt(num,10)+1);
}

//this function fires on each load of a slideshow
function gpfSlideshowLoadCallback(slideshowObj){
}


