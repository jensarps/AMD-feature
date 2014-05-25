// This is the concise dynamic implementation map without tests.

define({

	// "tellme" only has one implementation,
	// so we just point to the file that contains
	// it - but we need to omit the ".js".
	tellme: 'tellme/tellme',

	// "color" has multiple implementations,
	// so we provide function for the 'implementation' property to decide
	// what implementation to load.
	color: {
		implementation: function(name) {
			var color;
			if (Math.random() > 0.3) {
				color = 'red';
			} else if (Math.random() >= 0.5) {
				color = 'green';
			} else {
				color = 'blue';
			}
			return name + '/' + color;
		}
	}

});