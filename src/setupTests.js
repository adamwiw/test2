/* eslint-env node */
import { JSDOM } from 'jsdom';

// Set up a basic JSDOM environment
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;