
		 _                             ___ _____ 
		| |                           |_  /  ___|
		| |     ___   __ _  ___  ___    | \ `--. 
		| |    / _ \ / _` |/ _ \/ _ \   | |`--. \
		| |___| (_) | (_| |  __/  __/\__/ /\__/ /
		\_____/\___/ \__, |\___|\___\____/\____/ 
		              __/ |                      
		             |___/                             


**NOTE: This is still a work in progress. The functionality was tested in the latest Chrome & Firefox but proper testing is yet to be included.**

# LogeeJS 

LogeeJS is a plain JavaScript library that extends the [console API](https://developer.chrome.com/devtools/docs/console-api) and allows basic logging without openning the browser console.

### Summary

LogeeJS generates a dragable & resizable box on top of your page that shows styled log messages.
All existing console methods behave as they do in the browser console, with some of them showing logs in the Logee box as well. Custom methods provided by LogeeJS fallback to `console.log` in the browser console.

This means you can plug in LogeeJS on your website and it will display your existing logs without any changes to the code. 

### Examples

#### Differently colored methods

![Logee Extended Methods](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/logee-extended.png)

#### Logging primitives

```js
console.log(1, 'str', null, undefined, false)
```

![Logee primitives log](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/logee-primitives.png)

#### Logging Objects 

```js
var obj = {
  "String": "foo",
  "Number": 123456,
  "Boolean": true,
  "Null": null,
  "Undefined": undefined,
  "Array": [1, 2],
  "Regex": /12345/g,
  "nested": {
  	name: 'Hi, I am nested'
  }
};
o['Self Reference'] = o;

console.log(o);
```

![Logee object log](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/logee-object.png)

Only the actual object is logged (not the prototype chain).
A special string `_self_` is logged in case of a circular reference.

## Control

Logee box header contains:

- a button to clear the console, 
- two buttons to increase/decrease the font size
- a button to minimize/maximize Logee box

Additionally, you can :

- click on the header to drag the Logee box arround the screen
- click on the small resizor in the bottom right corner of the footer to resize Logee box
- Press `Ctrl+L` to show/hide Logee box

## Methods

##### Extended
* [console.log](https://developer.chrome.com/devtools/docs/console-api#consolelog)
* [console.info](https://developer.chrome.com/devtools/docs/console-api#consoleinfo)
* [console.debug](https://developer.chrome.com/devtools/docs/console-api#consoledebug)
* [console.warn](https://developer.chrome.com/devtools/docs/console-api#consolewarn)
* [console.error](https://developer.chrome.com/devtools/docs/console-api#consoleerror)
* [console.clear](https://developer.chrome.com/devtools/docs/console-api#consoleclear)

##### Custom
* **console.success** 
	* *logs in green color (falls back to [console.log](https://developer.chrome.com/devtools/docs/console-api#consolelog) in the browser console)*


## Options

    shouldAttachToConsole : true  // determines if Logee is attached to the console or has to be used independently

## Usage

All you have to do is include JS and CSS files on your page and LogeeJS does the rest.

You can use the direct raw github link:

    https://raw.githubusercontent.com/nem035/logee.js/master/dist/logee.min.css
    https://raw.githubusercontent.com/nem035/logee.js/master/dist/logee.min.js

 or download the css/js files yourself.

#### Example 1

```html
<link href="logee.min.css" rel="stylesheet" type="text/css"/>
<script src="logee.min.js" type="text/javascript"></script>

<!-- ... rest of your page -->

<script>

	/* 
    Initialize Logee.

	  By default, Logee is attached to the browser console.
		This means extended console methods log BOTH in the 
		browser and in the Logee box.
  */
	Logee.init(); 

	// displays each argument on a new line, colored by its type
	console.log('Log String', 1234, true); 

	// displays each argument on a new line, colored in orange
	console.warn('This', 'is', 'a', 'warning', 'msg'); 

	// clear the console and the Logee box
	console.clear();

	// displays a full json with syntax highlighting
	console.log({name: 'Nemanja', age: 123 });

</script>
```

#### Example 2


```html
<link href="logee.min.css" rel="stylesheet" type="text/css"/>
<script src="logee.min.js" type="text/javascript"></script>

<!-- ... rest of your page -->

<script>

  /* 
     Initialize Logee and detach it from the console.

     This means extended console methods log ONLY in 
     the browser and logging in the Logee box requires 
     calling methods on the Logee object. 
  */
	Logee.init({ shouldAttachToConsole: true }); // 

	// logs in the console but not in the Logee box
	console.log('something'); 

	// logs in the Logee box
	Logee.log('Log String', 1234, true); 

</script>
```

## Dependencies

None.
