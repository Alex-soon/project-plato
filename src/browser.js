"use strict"

const webdriver = require('selenium-webdriver');

const SELECTOR_TYPES = {
	css: webdriver.By.css,
	name: webdriver.By.name,
	xpath: webdriver.By.xpath,
}

const fs = require('fs');

const driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome' }).build();

function log(message) {
	console.log(message);
}

function getPage(url) {
	driver.get(url);
}

function getElem(selectorType, selector) {
	const type = SELECTOR_TYPES[selectorType];
	return driver.findElement(type(selector));
}

function getElems(selectorType, selector) {
	const type = SELECTOR_TYPES[selectorType];
	return driver.findElements(type(selector));
}

function input(selectorType, selector, text) {
	getElem(selectorType, selector).sendKeys(text);
}

function submit(selectorType, selector) {
	getElem(selectorType, selector).submit();
}

function getAttribute(selectorType, selector, name) {
	return getElem(selectorType, selector).getAttribute(name);
}

function scrollToElem(selectorType, selector) {
    const element = getElem(selectorType, selector);
    driver.executeScript('arguments[0].scrollIntoView()', element);
}

function takeScreenshot(name) {
    driver.takeScreenshot().then(function(image, err) {
        fs.writeFile(`screenshots/${name}.png`, image, 'base64', function(err) {
            err && log(err);
        });
    });
}

function getPromises(elems) {
	const promises = elems.map((e) => e.getText());
	return Promise.all(promises);
}

function isNoSuchElemError(err) {
	return err instanceof webdriver.error.NoSuchElementError;
}

module.exports = {
	log,
	getPage,
	getElem,
	getElems,
	input,
	submit,
	getAttribute,
	scrollToElem,
	takeScreenshot,
	getPromises,
	isNoSuchElemError,
}
