/**
* GPF Slideshow
*
* Copyright (c) 2012 Gotham Pixel Factory & Clarke Ulmer
* (gothampixelfactory.com, clarkeulmer.com)
*
**/
if(typeof GPF==="undefined" || !GPF) GPF={};
if(typeof GPF.slideshow==="undefined" || !GPF.slideshow) GPF.slideshow={};
//START SLIDESHOW NAMESPACE
GPF.slideshow = {

	init: function(settings){
		//*** thumbSize and slideMargin dictates width of slideshow container
		//settings check
		if( typeof settings === "undefined" ){
			var settings = GPF.slideshow.defaults;
		}
		
		if( typeof settings.slideshowId === "undefined" ){
			window.console && console.error('GPF Slideshow: Target container ID for slideshow must be specified in init');
			return false;
		}
		if( $("#" + settings.slideshowId).length === 0 ){
			window.console && console.error('GPF Slideshow: Target container ID does not exist');
			return false;
		}
		if( typeof settings.fullSizeTargetId === "undefined" ){
			window.console && console.error('GPF Slideshow: ID of target element for full-size images must be specified in init');
			return false;
		}
		if( $("#" + settings.fullSizeTargetId).length === 0 ){
			window.console && console.error('GPF Slideshow: Full-size image target container ID does not exist');
			return false;
		}
		if( typeof settings.thumbSize === "undefined" ){
			settings.thumbSize = GPF.slideshow.defaults.thumbSize;
		}
		if( typeof settings.fadeInSpeed === "undefined" ){
			settings.fadeInSpeed = GPF.slideshow.defaults.fadeInSpeed;
		}
		if( typeof settings.slideSpeed === "undefined" ){
			settings.slideSpeed = GPF.slideshow.defaults.slideSpeed;
		}
		if( typeof settings.fullSizeFadeInSpeed === "undefined" ){
			settings.fullSizeFadeInSpeed = GPF.slideshow.defaults.fullSizeFadeInSpeed;
		}
		if( typeof settings.slideVisibleCount === "undefined" ){
			settings.slideVisibleCount = GPF.slideshow.defaults.slideVisibleCount;
		}
		if( typeof settings.slideMargin === "undefined" ){
			settings.slideMargin = GPF.slideshow.defaults.slideMargin;
		}
		if( typeof settings.autoPlay === "undefined" ){
			settings.autoPlay = GPF.slideshow.defaults.autoPlay;
		}
		if( typeof settings.autoPlayInterval === "undefined" ){
			settings.autoPlayInterval = GPF.slideshow.defaults.autoPlayInterval;
		}
		if( typeof settings.images === "undefined" ){
			settings.images = GPF.slideshow.defaults.images;
		}
		
		//add id identifier
		var slideshowId = "#" + settings.slideshowId;
		
		
		
		//add slideshow class
		var _slideshow_markup = '<div class="gpf-slides-container"><ul></ul></div><div id="carousel-nav"><div class="prev"><a href=""></a></div><div class="carousel-center"></div><div class="next"><a href=""></a></div></div>';
		
		//add inital slideshow markup
		$("#" + settings.fullSizeTargetId).after(_slideshow_markup);
		
		//load slides
		$(settings.images).each(function(i,data){
			$(slideshowId).find("ul").append('<li><a href="" data-slide-number=' + i + ' data-slide-full=' + data.full + ' alt="' + data.altTitle + '" title="' + data.altTitle + '"><img ' + ' src="' + data.thumb + '" /></a></li>');
		});
		
		
	
		
		//set slide margins
		$(slideshowId).find(".gpf-slides-container ul li").css("margin-left",settings.slideMargin).css("margin-right",settings.slideMargin);
		
		
		//set slideshow and slide container height
		var _slide_li_h = parseFloat( $(slideshowId).find(".gpf-slides-container ul li").height() );
		//$(slideshowId).height( _slide_li_h );
		$(slideshowId).find(".gpf-slides-container").height( _slide_li_h );

		
		//init navigation
		GPF.slideshow.slideNav( $(slideshowId),settings );
		
		//attach slide click
		GPF.slideshow.slideClick($(slideshowId),settings);
		
		//fade in slideshow
		$(slideshowId).fadeTo(settings.fadeInSpeed,1,function(){
			//fire autoplay if set
			if( settings.autoPlay ){
				GPF.slideshow.autoPlaySetInterval( $(slideshowId),settings.autoPlayInterval );
				//always starts at first slide, zero index
				$(slideshowId).find("[data-slide-number=0]").trigger("auto");
			}
			else {
				//show initial full image - uses first slide, zero index
				$(slideshowId).find("[data-slide-number=0]").trigger("click");
			}
		});
		
		},

	slideNav:function(elem,settings){
		numSlides = $('.gpf-slides-container:eq(0) li').length;
	
		//prev
		$(elem).find(".prev").bind("click auto",function(event){
			var num = parseInt($('li.active a').attr('data-slide-number'),10);
			// Handle bounds.
			if (num === 0) {
				num = numSlides - 1;
			} else {
				num -= 1;
			}

			GPF.slideshow.gotoSlide(elem, settings, num);
				
			$('.gpf-slides-container:eq(0) li:eq('+(numSlides-1)+')').prependTo('.gpf-slides-container:eq(0) ul');
			return false;
		});
		
		//next
		$(elem).find(".next").bind("click auto",function(event){
			var num = parseInt($('li.active a').attr('data-slide-number'),10);

			// Handle bounds
			if (num === (numSlides - 1)) {
				num = 0;
			} else {
				num += 1;
			}
			GPF.slideshow.gotoSlide(elem, settings, num);
			$('.gpf-slides-container:eq(0) li:eq(0)').appendTo('.gpf-slides-container:eq(0) ul');
			return false;
		});
	},

	// TODO: Shouldn't need to pass settings and slideshowObj around.
	gotoSlide:function(slideshowObj, settings, num) {
		var $el = $('[data-slide-number='+num+']'),
			_full_image = $el.attr("data-slide-full");
		$(slideshowObj).find("ul li").removeClass("active");
		$el.parent().addClass("active");
		$("#" + settings.fullSizeTargetId+ " img").remove();
		$("<img class='gpf-slideshow-target' src=" + _full_image + " />")
				.appendTo("#" + settings.fullSizeTargetId)
				.fadeTo(settings.fullSizeFadeInSpeed,1);
			
		$("#hero img.gpf-slideshow-target[src*='hz']").css("width","88%");
		GPF.slideshow.slideClickCallback(slideshowObj,num);
	},

	
	slideClick:function(slideshowObj,settings){
		$(slideshowObj).find("ul li a").bind("click auto",function(event){
			var num = $(this).attr('data-slide-number');
			if( event.type === "click" ){
				window.clearInterval( parseFloat($(slideshowObj).attr("data-timer-id")) );
			}
			if( $(this).parent().hasClass("active") ){
				return false;
			}
			GPF.slideshow.gotoSlide(slideshowObj, settings, num);
			return false;
		});
	},




	autoPlaySetInterval:function(slideshowObj,autoPlayInterval){
		//_gpf_autoplay_timer =
		//Do not autoplay if total number of slides is equal to visible number of slides
		if( parseFloat($(slideshowObj).find("[data-slides-total]")) === parseFloat($(slideshowObj).find("[data-slides-visible]")) ){
		return false;
		}
		//eval("div" + i + " = myPanels[i]");
		intervalId = window.setInterval( 'GPF.slideshow.autoPlay("' + $(slideshowObj).attr("id") + '")',autoPlayInterval );
		//set timer value attr
		$(slideshowObj).attr("data-timer-id",intervalId);

	},
	
	autoPlay:function(slideshowId){
		$this = $("#" + slideshowId );
		var _slides_visible = parseFloat( $this.find("[data-slides-visible]").attr("data-slides-visible") );
		var _slides_total = parseFloat( $this.find("[data-slides-total]").attr("data-slides-total") );
		var _active_slide_number = parseFloat( $this.find(".active a").attr("data-slide-number") );
		//alert(_active_slide_number);
		if( _active_slide_number < (_slides_total - 1) ){
		$this.find(".next").trigger("auto");
		$this.find("ul li.active a").closest("li").find("a").trigger("auto");
		$this.find("[data-slide-number=" + (_active_slide_number + 1) + "]").trigger("auto");
		}
		else {
		window.clearInterval( parseFloat($this.attr("data-timer-id")) );
		}
	},
	
	//slideClickCallback:function(slideshowObj,slideshowObjClicked,slideNumber){
	slideClickCallback:function(slideshowObj,slideshowObjClicked){
		gpfSlideshowClickCallback(slideshowObj,slideshowObjClicked);
	},
	
	slideshowLoadCallback:function(slideshowObj){
		gpfSlideshowLoadCallback(slideshowObj);
	}
	
};//end of slideshow behaviors namespace

