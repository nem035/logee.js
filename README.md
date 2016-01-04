# LogeeJS 

LogeeJS is a plain JavaScript library that extends the [console API](https://developer.chrome.com/devtools/docs/console-api) and allows basic logging without openning the browser console.

All existing console methods behave as they do in the browser console, with additional UI logs in a small draggable box.
Custom methods fallback to `console.log` in the browser console.

#### Examples

`console.log` outputs each argument on a new line, coloring it based on its type. For instance:

`console.log(1, 'str', null, undefined, false);`

Displays the following in the Logee Box:

![Logee Log](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/logee-log.png)

Other methods concatenate the arguments and print them on a single line, with the appropriate method color. Using the same example:

![Logee Info](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/logee-info.png)

All methods that behave like `console.info`:

![Log Methods](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/methods.png)

Outputing a json can be done using `console.json`. A special string `_self_` is logged in case of a circular reference.

![Log Json](https://raw.githubusercontent.com/nem035/logee.js/master/screenshots/logee-json.png)


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
* **console.json**	 
	* *logs the full message with syntax highlighting (falls back to [console.log](https://developer.chrome.com/devtools/docs/console-api#consolelog) in the browser console)*

## Usage

All you have to do is include JS and CSS files on your page and Logee does the rest.

```html
<link href="logee.css" rel="stylesheet" type="text/css"/>
<script src="logee.js" type="text/javascript"></script>

<!-- ... rest of your page -->

<script>

	// displays each argument on a new line, colored by its type
	console.log('Log String', 1234, true); 

	// concatenates all arguments and displays them as a single-spaced, orange, string
	console.warn('This', 'is', 'an', 'info', 'msg'); 

	// displays a full json with syntax highlighting
	console.json({name: 'Nemanja', age: 123 });

</script>
```

## Dependencies

None.
