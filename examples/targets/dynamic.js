// This is the dynamic implementation map containing
// tests.

define({

	// "tellme" only has one implementation,
	// so we just point to the file that contains
	// it - but we need to omit the ".js".
	tellme: 'tellme/tellme',

	// "color" has multiple implementations,
	// so we provide tests for the plugin to decide
	// what implementation to load.
	color: [
		{
			implementation: 'color/red',
			
			isAvailable: function(){
				// Let's provide a test that indicates
				// if this implementation is available.
				// This is our most desired impl for
				// this feature, so we put it first.
			
				// For this silly example, let's leave
				// to chance:
				return Math.random() > 0.3;
			}
		},
		{
			implementation: 'color/green',
			
			isAvailable: function(){
				// Let's provide a test that indicates
				// if this implementation is available.
				// This test will only be run if the
				// test above fails.
			
				// 50/50 that you'll get green:
				return Math.random() >= 0.5;
			}
		},
		{
			implementation: 'color/blue',
			
			isAvailable: function(){
				// This implementation is kind of a
				// fallback impl, that is always
				// available, but it should only be
				// used if the others are not available.
				return true;
			}
		}
	]

});