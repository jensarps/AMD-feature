// This is a dynamic implementation map containing tests.

define({

	JSON: [
		{
      module: function () {
        return JSON;
      },

			isAvailable: function(){
				// Let's provide a test that indicates
				// if this implementation is available.
				// This is our most desired impl for
				// this feature, so we put it first.

        return typeof JSON != 'undefined';
			}
		},
		{
			implementation: 'json-impl',
			
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
