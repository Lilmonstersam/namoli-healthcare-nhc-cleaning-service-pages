/*******************************************
 * Launchpad Design 3 Script
 * *****************************************
 *
 * Author: Hicaliber
 * Author URL: hicaliber.com.au
 * 
 * Table of Contents:
 * - Team Element Image Overlay Content
 * 
 ******************************************/

jQuery(document).ready(function($) {

   /********************************************
	# Team Element Image Overlay Content - START
	*********************************************
	* 
	* Slide up transition for Team Element Image Overlay Content
	*/ 
   var element_item = $('.page-element.team-element.image-overlay-content .hic-box');

   element_item.each(function(e) {

      var element_height = $(this).find('.hic-content').outerHeight(true),
          element_padding = parseInt($(this).find('.hic-content').css('padding-top')),
          child_height = $(this).find('.hic-content > div').first().outerHeight(true);

      $(this).find('.hic-content > div').first().css('margin-bottom', element_padding+'px');

      var translate_height = element_height - element_padding - child_height;

      $(this).find('.hic-content').css('transform', 'translateY('+translate_height+'px)');
      $(this).hover(function(e) {
         $(this).find('.hic-content').css('transform', 'translateY(0)');
         e.stopPropagation();
      }, function(e) {
         $(this).find('.hic-content').css('transform', 'translateY('+translate_height+'px)');
         e.stopPropagation();
      });

   });
   /******************************************
	# Team Element Image Overlay Content - END
   ******************************************/

});