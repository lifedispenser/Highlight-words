/**
 * jquery.highlightwords.js
 * Copyright (c) 2010 
 * Licensed under the MIT License (http://www.opensource.org/licenses/mit-license.php)
 * 
 * @author Spencer Ying
 * @projectDescription	jQuery plugin for adding style to a word or a group of words in a document.
 * @version 0.1.0
 * 
 * @requires jquery.js (tested with 1.4.2)
 * 
 * @param class   class that contains the style.
 * @param words   array - a list of words [ 'a', 'b', 'c' ]
 * 
 * 2 usages:
 * 
 * First way:
 * //in stylesheet:
 * .class1 { color: green; }
 * 
 * //in js:
 * $(selector).hightlight_words({
 *   'class' : class1,
 *   'words' : ['word1', 'word2', etc],
 *   'partial' : false
 * });
 *
 *
 * Second way: this way is better organizationally IMO.
 * //html:
 * add a 'words' attribute into any element that you want highlighted like so: 
 * words = "{ 'class' : ['word1', 'word2', 'etc'], 'class2' : ['more', 'words'] }"
 * example <p words="{ 'animals' : ['cat', 'dog', 'monkey'], 'people' : ['joe','alex','melissa'] }"> ... text here ... </p>
 * 
 * //stylesheet:
 * add the styles to the stylesheet or page...
 * .animals { color: brown; }
 * .people { color: black; }
 *
 * //in js:
 * $(document).ready(function() {
 * 	$().hlw();
 * });
 */

(function( $ ){
  $.fn.hlw = function(options) { //we still keep it in $() for namespacing.
    $("[words]").each(function() {
			var arr = eval("eval(" + $(this).attr("words")+")"); //wow javascript sometimes you amaze me.
			for(var item in arr) {
				$(this).highlight_words({'class' : item, 'words' : arr[item]});
			}
		});
  };
  $.fn.highlight_words = function(options) {
    
    return this.each(function() {
      //default settings 
      var settings = {
        'class' : 'greend',
        'words' : ["hello", "world"],
        'partial' : true
      };
			if ( options ) {$.extend( settings, options );}
			
      for(var i in settings['words']) { 
        settings['words'][i] = settings['words'][i].replace(/[<>]+/g, "");
				settings['words'][i] = settings['words'][i].replace(/^[\W]+/g, "");
      }
      var old_html = $(this).html();
			old_html = old_html.replace(/(\S)</g, "$1 <");
			old_html = old_html.replace(/>(\S)/g, "> $1");
			var new_html = "";
			
			var wordarray = old_html.split(/[\s]+/);
			var in_tag = false;
			var settings_words = settings['words'];
			
			for (var i=0; i<wordarray.length; i++) {
				var html_word = $.trim(wordarray[i]);
				for (var k=0; k<settings_words.length; k++) { 
					var test_word = $.trim(settings_words[k]);
					if(html_word[0] == '<') { in_tag = true; }
					if(html_word.indexOf('>') == html_word.length-1) { in_tag = false; new_html += html_word + " "; break; }
					if(html_word.length == 0) {break;}
					
					if(!in_tag) {
						var numwords = test_word.split(" ").length;
						if(numwords > 1) {
							var new_html_word = html_word;
							for(var l = 1; l < numwords; l++) {
								new_html_word += " " + wordarray[i+l];
							}
							if(new_html_word.toLowerCase().indexOf(test_word.toLowerCase()) == 0) {
								if(new_html_word.length > test_word.length) { // if partial is false, skip the word
									if(!settings['partial'] && new_html_word[test_word.length].match(/[a-zA-z]/)) { 
										break;
									}
								}
								var new_word = "<span class='" + settings['class'] + "'>" + new_html_word.substring(0, test_word.length) 
									+ "</span>" + new_html_word.substring(test_word.length, new_html_word.length);  
								new_html += new_word + " ";
								i += numwords-1;
								break;
							}
						}
						
						while(html_word[0].match(/\W/)) { //if it starts with a non-word character
							new_html += html_word[0];
							html_word = html_word.substring(1, html_word.length);
							if(html_word.length == 0) {break;} // if 0, break
						}
						if(html_word.toLowerCase().indexOf(test_word.toLowerCase()) == 0) {
							if(html_word.length > test_word.length) { // if partial is false, skip the word
								if(!settings['partial'] && html_word[test_word.length].match(/[a-zA-z]/)) { 
									break;
								}
							}
							var new_word = "<span class='" + settings['class'] + "'>" + html_word.substring(0, test_word.length) 
								+ "</span>" + html_word.substring(test_word.length, html_word.length);  
							new_html += new_word + " ";
							break;
						}
					}
					if(k == settings_words.length-1) {
						new_html += html_word + " ";
					}
				}
				
			}
			$(this).html(new_html);
    });
  };
})( jQuery );