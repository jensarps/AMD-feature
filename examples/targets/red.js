// This is a 'specific' implementation map.
// In this example, we should serve it to
// people that like the color red.

define({

	// "tellme" only has one implementation,
	// so we just point to the file that contains
	// it - but we need to omit the ".js".
	tellme: 'tellme/tellme',

	// "color" has multiple implementations,
	// but in the specific case we want the
	// red impl to be used.
	color: 'color/red'

});