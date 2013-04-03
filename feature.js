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
