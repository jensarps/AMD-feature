// This is a 'specific' implementation map
// that will get you blue as color. It uses
// a different approach than the 'red' impl
// map, as it pulls in the dynamic map and
// just replaces the color mapping. This
// techniques is useful for large impl maps.
// Path is relative to baseUrl again.

define(['../targets/dynamic'], function(impls){

	impls.color = 'color/blue';
	
	return impls;

});