About
=====

AMD-feature is a plugin for [AMD loaders](https://github.com/amdjs/amdjs-api/wiki/Loader-Plugins). It allows for easy cross-target 
development and code management.

The Idea
========

… behind this is, that your project's code consists of different 
features, and that some features might have different implementations.
Very probably, these features are already organized as AMD modules.

AMD-feature allows you to list those features in an implementation map. And
if there are multiple implementations for a given feature, you can provide
a method for each implementation in this map, that decides whether a specific
implementation should be used to satisfy the requirement for a certain
feature.

Benefits
========

Using AMD-feature will ease working with different implementations a lot. No
more code-branching inside of a module, but nicely organized files instead.

It allows you to dynamically load the right implementation for a given feature
at runtime, as well as creating a specific build just for one platform. 

AMD-feature is designed that it also allows to create a "dynamic" build. That 
is, to create a build that contains the implementation map as well as all
possible implementations for a given feature. This is needed if you deploy to
an unknown target and still want to keep bandwidth usage down.

How does it work?
=================

The loader plugin requires an implementation map. This map is an object, with
the names of your features as keys. The respective values can either be a 
simple string in case there is only one implementation of a feature, or an
Array of Objects for each of the possible implementation. Each of these objects
must provide two keys: one is a function, 'isAvailable' and the other is a 
string, 'implementation', which contains the path to the file that implements
the feature. The 'isAvailable()' function must return a boolean that determines
whether the implementation is currently suitable for the given feature.


Example 1
=========

You are developing an app for both Android and iOS, and you have a dropdown 
list in your app that works different for both platforms. You could throw all
the code for both targets into one big, un-maintainable file. Or, you could 
separate them: because these are two implementations of one feature.


Example 2
=========

You are building a web-app and your targets are different browsers with
different capabilities. Again, you wouldn't want to put the code for all
browsers in one file, but instead separate code for different targets into
different implementations and use has.js to do runtime feature detection to
load the best implementation for the current browser.

Example 3
=========

You're building an app that has different capabilities in the free and premium
version. So you can use the dynamic implementation map to easily switch between
versions during development and use a specific map to build the code to deploy.


Usage
=====

I've made up a really silly example that you can check out in the examples
directory. It covers the whole thing, and you can nicely see what happens.
However, here's a step-by-step guide:

Given the first example:

Let's call the feature 'dropdown'. So you create two implementations of this:
 

	dropdown-ios.js

```javascript
define(function() {
	var dropdown = function(){
		// ios specific dropdown here
	};
	
	return dropdown;
});
```

and:

	dropdown-android.js

```javascript
define(function() {
	var dropdown = function(){
		// android specific dropdown here
	};
	
	return dropdown;
});
```

Your implementation map would then look like this:

	dynamic.js

```javascript
define({
	'dropdown': [
		{
			isAvailable: function(){
				// test if we are on iOS
				return iOS ? true: false;
			},
			
			implementation: 'src/dropdown-ios'
		},
		{
			isAvailable: function(){
				// if we end up here, we're not on iOS,
				// so we can just return true.
				return true;
			},
			
			implementation: 'src/dropdown-android'
		}
	]
});
```

In your code, you would load your feature like this:

```javascript
define(['feature!dropdown'], function(dropdown){
	
	// The variable 'dropdown' now contains
	// the right implementation - no matter
	// what platform the code is executed on,
	// and you can just do this:
	var myDropdown = new dropdown();
});
```

When you want to deploy your code for a specific platform, e.g. for Android,
you create a so-called 'specific implementation map':

	android.js

```javascript
define({
	'dropdown': 'src/dropdown-android'
});
```

When you feed this implementation map to AMD-feature, it will of course load
only the Android implementation of the dropdown feature.

Now whats left is to tell your AMD loader and the feature plugin what 
implementation map to use. For RequireJS, you do it in the config object:

```html
<script>
	var require = {
		baseUrl: './',
		paths: {
			// we need to point the plugin to the 
			// implementation map that it should use:
			'implementations': 'path/to/impl-map'
		}
	};
</script>
<script type="text/javascript" src="require.js"></script>
```

Direct Loading
==============

In some cases, the implementation of a feature doesn't require an own file, e.g.
if your feature has a native implementation or if it is a plain object.

You can then use the `module` property in the implementation map instead of the
`implementation` property to tell the plugin that no file needs to be loaded,
but to execute the function found in the `module` property and take it's return
value to satisfy the request for the feature.


	dynamic.js

```javascript
define({
	'JSON': [
		{
			isAvailable: function(){
				// test if native JSON is available
				return typeof JSON != 'undefined';
			},

			// if so, directly use the JSON object as module
			module: function () {
			  return JSON;
			}
		},
		{
			isAvailable: function(){
				// This is the fallback
				return true;
			},

			// return the path to some JSON implementation
			implementation: 'src/json-impl'
		}
	]
});
```

To use direct loading in a specific implementation map, pass an object
containing the `module` property instead of a string:


	native-json.js

```javascript
define({

  JSON:	{
    module: function () {
      return JSON;
    }
  }

});
```

See the code in the `examples/direct-load` directory for an example of this.


Builds
======

Creating builds follows the same idea as deploying: In your build profile, just
point to the right implementation map. If you want a dynamic build that
includes all possible implementations for a given feature, point to the dynamic
implementation map. If you want a build for a specific target, that only
contains the implementation for the target, point to the specific implementation
map.

See the `build-profile-*.js` files in the example directory for example build
profiles.

detect.js
=========

Just a little helper: If you require the detect.js module, it will generate
and return a map with the currently used implementations. See the detect.html
file in the examples directory to see how it works.
