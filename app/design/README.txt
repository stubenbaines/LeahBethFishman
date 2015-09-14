Client wishes to have a portfolio site with 2 different sections:
Design site
Gilding site

Both sites need to use a fluid layout. The content should be centered and she would like the content to fill the available browser width. 

See design_site.psd for design site. 

Each section (Illustration, Graphic Design, etc) will load up a series of images with thumbs. 
The thumb carousel should be infinite, meaning you should be able to scroll through it without reaching an end. After the last item, item 1 will display again. 
The main image will transition with a fade between the items. 
The prev/next arrows should advance the carousel.


Coding suggestions:
- Use HTML5 for markup. 
- Consider using CSS transitions/classes to manage the fades rather than using jQuery fadeIn(). 
- An infinite carousel feels like something you should find an off the shelf component rather than writing your own.
- Consider creating a re-usable slideshow module. I have not uploaded the gilded site design yet, but it would be a success if we can re-use the slideshow code between the 2 sites. 
- There are plenty of design elements and fonts that will not be available with pure CSS and web-fonts. May need to use image sprites and image replacement to render the design elements. Do not use inline <img> tags because they will not be semantically meaningful. 



