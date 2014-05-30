/**
 * AMD-Feature - A loader plugin for AMD loaders.
 * 
 * https://github.com/jensarps/AMD-feature
 *
 * @author Jens Arps - http://jensarps.de/
 * @license MIT or BSD - https://github.com/jensarps/AMD-feature/blob/master/LICENSE
 * @version 1.1.0
 */
define(['implementations'], function (implementations) {

  // Check availability of implementation
  function isAvailable(impl, name) {
    var isFunction = typeof impl.isAvailable === 'function';
    return (isFunction && impl.isAvailable(name)) || (!isFunction && impl.isAvailable);
  }
  
  return {

    load: function (name, req, load, config) {

      var i, impl, m, toLoad,
          featureInfo = implementations[name],
          hasMultipleImpls = Object.prototype.toString.call(featureInfo) === '[object Array]';

      if (config.isBuild && hasMultipleImpls) {
        // In build context, we want all possible
        // implementations included.
        for (i = 0, m = featureInfo.length; i < m; i++) {
          impl = featureInfo[i].implementation;
          if (typeof impl === 'function') {
            impl = impl.call(featureInfo[i], name);
          }
          if (impl) {
            req(impl, load);
          }
        }

        // We're done here now.
        return;
      }

      if (hasMultipleImpls) {
        // We have different implementations available,
        // test for the one to use.
        for (i = 0, m = featureInfo.length; i < m; i++) {
          impl = featureInfo[i];
          if (isAvailable(impl, name)) {
            break;
          }
          impl = null;
        }
      } else {
        impl = featureInfo;
        // The only implementation can have isAvailable check
        if (impl && typeof impl === 'object' && ('isAvailable' in impl) && ! isAvailable(impl, name)) {
          impl = null;
        }
      }
      
      if (impl) {
        if (typeof impl === 'string') {
          toLoad = impl;
        } else if (typeof impl === 'object' && ('module' in impl)) {
          load(typeof impl.module === 'function' ? impl.module(name) : impl.module);
          return;
        } else {
          toLoad = impl.implementation;
          if (typeof toLoad === 'function') {
            toLoad = impl.implementation(name);
          }
        }
        req([toLoad], load);
      } else {
        req([], load);
      }
    }
  };
});
