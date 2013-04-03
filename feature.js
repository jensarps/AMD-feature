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

  return {

    load: function (name, req, load, config) {

      var i, m, toLoad,
          featureInfo = implementations[name],
          hasMultipleImpls = Object.prototype.toString.call(featureInfo) == '[object Array]';

      if (config.isBuild && hasMultipleImpls) {
        // In build context, we want all possible
        // implementations included.
        for (i = 0, m = featureInfo.length; i < m; i++) {
          if (featureInfo[i].implementation) {
            req([featureInfo[i].implementation], load);
          }
        }

        // We're done here now.
        return;
      }

      if (hasMultipleImpls) {
        // We have different implementations available,
        // test for the one to use.
        for (i = 0, m = featureInfo.length; i < m; i++) {
          var current = featureInfo[i];
          if (current.isAvailable()) {
            if (typeof current.module != 'undefined') {
              load(current.module());
              return;
            }
            toLoad = current.implementation;
            break;
          }
        }
      } else {
        if (typeof featureInfo.module != 'undefined') {
          load(featureInfo.module());
          return;
        }
        toLoad = featureInfo;
      }

      req([toLoad], load);
    }
  };
});
