# LogeeJS 

LogeeJS is a plain JavaScript library that extends the [console API](https://developer.chrome.com/devtools/docs/console-api) and allows basic logging without openning the browser console.

##### Sample screenshots showing extended and custom methods

![Enhanced Methods](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/existing_methods.png)
![Custom Methods](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/custom_methods.png)

## Methods

All methods behave as they do in the browser console, with additional UI logs in a small draggable box.

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
* **console.json**	 
	* *logs the full message with syntax highlighting (falls back to [console.log](https://developer.chrome.com/devtools/docs/console-api#consolelog) in the browser console)*

## Usage

All you have to do is include JS and CSS files on your page and Logee does the rest.

```html
<script src="logee.js" type="text/javascript"></script>
<link href="logee.css" rel="stylesheet" type="text/css"/>

<!-- ... rest of your page -->
<script>
	console.log('Hello World'); // logs in the console as usual as well as in the Logee box
</script>

```
###### Output

![Hello World](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/custom_methods.png)

## Dependencies

None.

