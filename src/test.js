'use strict'

const browser = require('./browser');

// Visit google.
browser.getPage('https://www.google.com');

// Search for "python metaclass example".
browser.input('css', '#lst-ib', 'python metaclass example');
browser.submit('name', 'btnK');

// Go to the stackoverflow.
browser.getAttribute('xpath', '//a[contains(@href,"stackoverflow.com")]', 'href').then(
	function(href){
		browser.getPage(href);

		// Get all answer ratings.
		browser.getElems('css', '.answer .vote-count-post').then(function(elems){
			browser.getPromises(elems).then(function (values) {

				// Find the most popular answer.
				const maxRating = Math.max.apply(null, values);

				browser.getAttribute('xpath', `//*[text()=${maxRating}]/../../../../../..`, 'id').then(function(answerId) {
			        browser.log(`The most popular answer is ${answerId}`);

    				// Check if it's marked as the best one.
					browser.getElem('css', `#${answerId} .vote-accepted-on`).then(
						function(elem) {
				        	browser.log('The most popular answer is marked as the best one.');
					    }, 
					    function(err) {
					        if (browser.isNoSuchElemError(err)) {
					            browser.log('The most popular answer is not marked as the best one.');
					        }
				    	}
				    );

    			    // Take Screenshot.
					browser.scrollToElem('css', `#${answerId}`);
					browser.takeScreenshot('max-rating');
			    });
			});
		});
	}
);
