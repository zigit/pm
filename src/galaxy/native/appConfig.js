import appEvents from '../service/appEvents.js';
import eventify from 'ngraph.events';
import scene from '../store/scene.js';
import qs from 'qs';

var defaultConfig = {
  pos: {x : 0, y: 0, z: 0 },
  lookAt: {x: 0, y: 0, z: 0, w: 1},
  showLinks: true,
  orbit: false,
  showSearchBar: false,
  muted: false,
  maxVisibleDistance: 150,
  scale: 1.75,
  manifestVersion: 0
};

export default appConfig();

function appConfig() {
  var hashConfig = parseFromHash(window.location.hash);
  var hashUpdate; // async hash update id

  var api = {
    getCameraPosition: getCameraPosition,
    getCameraLookAt: getCameraLookAt,
    getShowLinks: getShowLinks,
    getOrbit: getOrbit,
    getShowSearchBar: getShowSearchBar,
    getSound: getSound,
    getScaleFactor: getScaleFactor,
    getMaxVisibleEdgeLength: getMaxVisibleEdgeLength,
    setCameraConfig: setCameraConfig,
    setShowLinks: setShowLinks,
    setOrbit: setOrbit,
    setShowSearchBar: setShowSearchBar,
    setSound: setSound,
    getManifestVersion: getManifestVersion,
    setManifestVersion: setManifestVersion,
    setPopupVisibilityAndText: setPopupVisibilityAndText
  };

  appEvents.toggleLinks.on(toggleLinks);
  appEvents.toggleOrbit.on(toggleOrbit);
  appEvents.toggleSearchBar.on(toggleSearchBar);
  appEvents.toggleSound.on(toggleSound);
  appEvents.queryChanged.on(queryChanged);
  appEvents.setPopupVisibilityAndText.on(setPopupVisibilityAndText);

  eventify(api);
  return api;


  function getScaleFactor() {
    return hashConfig.scale;
  }

  function getManifestVersion() {
    return hashConfig.manifestVersion;
  }

  function getMaxVisibleEdgeLength() {
    return hashConfig.maxVisibleDistance * hashConfig.maxVisibleDistance * hashConfig.scale;
  }

  function getCameraPosition() {
    return hashConfig.pos;
  }

  function toggleLinks() {
    setShowLinks(!hashConfig.showLinks);
  }

  function toggleOrbit() {
    setOrbit(!hashConfig.orbit)
  }

  function toggleSearchBar() {
    setShowSearchBar(!hashConfig.showSearchBar);
  }

  function toggleSound() {
    setSound(!hashConfig.muted);
  }

  function getCameraLookAt() {
    return hashConfig.lookAt;
  }

  function getShowLinks() {
    return hashConfig.showLinks;
  }

  function getOrbit() {
    return hashConfig.orbit;
  }

  function getShowSearchBar() {
    return hashConfig.showSearchBar;
  }

  function getSound() {
    return hashConfig.muted;
  }

  function queryChanged() {
    var currentHashConfig = parseFromHash(window.location.hash);
    var cameraChanged = !same(currentHashConfig.pos, hashConfig.pos) ||
                        !same(currentHashConfig.lookAt, hashConfig.lookAt);
    var showLinksChanged = hashConfig.showLinks !== currentHashConfig.showLinks;
    var orbitChanged = hashConfig.orbit !== currentHashConfig.orbit;
    var showSearchBarChanged = hashConfig.showSearchBar !== currentHashConfig.showSearchBar;
    var soundChanged = hashConfig.muted !== currentHashConfig.muted;
    if (cameraChanged) {
      setCameraConfig(currentHashConfig.pos, currentHashConfig.lookAt);
      api.fire('camera');
    }
    if (showLinksChanged) {
      setShowLinks(currentHashConfig.showLinks);
    }
    if (orbitChanged) {
      setOrbit(currentHashConfig.orbit);
    }
    if (showSearchBarChanged) {
      setShowSearchBar(currentHashConfig.showSearchBar);
    }
    if (soundChanged) {
      setSound(currentHashConfig.muted);
    }
  }

  function getSound() {
    return hashConfig.muted;
  }
  
  function getScaleFactor() {
    return hashConfig.scale;
  }

  function getManifestVersion() {
    return hashConfig.manifestVersion;
  }

  function getMaxVisibleEdgeLength() {
    return hashConfig.maxVisibleDistance * hashConfig.maxVisibleDistance * hashConfig.scale;
  }

  function getCameraPosition() {
    return hashConfig.pos;
  }

  function toggleLinks() {
    setShowLinks(!hashConfig.showLinks);
  }

  function toggleOrbit() {
    setOrbit(!hashConfig.orbit)
  }

  function toggleSearchBar() {
    setShowSearchBar(!hashConfig.showSearchBar);
  }

  function toggleSound() {
    setSound(!hashConfig.muted);
  }

  function getCameraLookAt() {
    return hashConfig.lookAt;
  }

  function getShowLinks() {
    return hashConfig.showLinks;
  }

  function getOrbit() {
    return hashConfig.orbit;
  }
  function getShowSearchBar() {
    return hashConfig.showSearchBar;
  }

  function setShowLinks(linksVisible) {
    if (linksVisible === hashConfig.showLinks) return;
    hashConfig.showLinks = linksVisible;
    api.fire('showLinks');
    updateHash();
  }

  function setOrbit(orbiting) {
    if (orbiting === hashConfig.orbit) return;
    hashConfig.orbit = orbiting;
    var hash = makehash();
    window.history.replaceState(undefined, undefined, hash);
    api.fire('orbit');
  }

  function setShowSearchBar(searchBarVisible) {
    if (searchBarVisible === hashConfig.showSearchBar) return;
    hashConfig.showSearchBar = searchBarVisible;
    api.fire('showSearchBar');
    updateHash();
  }

  function setSound(muted) {
    if (muted === hashConfig.muted) return;
    hashConfig.muted = muted;
    window.isMuted = muted;
    api.fire('muted');
    updateHash();
  }

  function setManifestVersion(version) {
    if (version === hashConfig.manifestVersion) return;
    hashConfig = parseFromHash(window.location.hash);
    hashConfig.manifestVersion = version;
    updateHash();

    var name = scene.getGraphName();
    appEvents.downloadGraphRequested.fire(name);
  }

  function setCameraConfig(pos, lookAt) {
    if (same(pos, hashConfig.pos) &&
        same(lookAt, hashConfig.lookAt) &&
        lookAt.w === hashConfig.lookAt.w) return;

    hashConfig.pos.x = pos.x;
    hashConfig.pos.y = pos.y;
    hashConfig.pos.z = pos.z;

    hashConfig.lookAt.x = lookAt.x;
    hashConfig.lookAt.y = lookAt.y;
    hashConfig.lookAt.z = lookAt.z;
    hashConfig.lookAt.w = lookAt.w;

    updateHash();
  }

  function setPopupVisibilityAndText(isVisible, text) {
    api.fire('setPopupVisibilityAndText', { isVisible: isVisible, text: text });
  }

  function updateHash() {
    // TODO: This needs to be rewritten. It should not update all fields,
    // only those that modified.
    //if scene.getGraphName() is not undefined, set window.name to scene.getGraphName() and set name to scene.getGraphName()
    if (scene.getGraphName()) {
      window.graphname = scene.getGraphName();
    }
    var hash = makehash();
    setHash(hash);
  }

  function makehash() {
    var name =  window.graphname;
    var pos = hashConfig.pos;
    var lookAt = hashConfig.lookAt;
    var hash = '#/galaxy/' + name +
      '?cx=' + Math.round(pos.x) +
      '&cy=' + Math.round(pos.y) +
      '&cz=' + Math.round(pos.z) +
      '&lx=' + lookAt.x.toFixed(4) +
      '&ly=' + lookAt.y.toFixed(4) +
      '&lz=' + lookAt.z.toFixed(4) +  
      '&lw=' + lookAt.w.toFixed(4) +
      '&ml=' + hashConfig.maxVisibleDistance +
      '&s=' + hashConfig.scale +
      '&l=' + (hashConfig.showLinks ? '1' : '0') +
      '&o=' + (hashConfig.orbit ? '1' : '0') +
      '&b=' + (hashConfig.showSearchBar ? '1' : '0') +
      '&m=' + (hashConfig.muted ? '0' : '1') +
      '&v=' + hashConfig.manifestVersion;
    return hash;
  }
  
  function setHash(hash) {
    // I noticed Chrome address string becomes very slow if we update URL too
    // often. Thus, I'm adding small throttling here.
    if (hashUpdate) {
      window.clearTimeout(hashUpdate);
    }

    hashUpdate = setTimeout(function() {
      if (window.history) {
        window.history.replaceState(undefined, undefined, hash);
      } else {
        window.location.replace(hash);
      }
      hashUpdate = null;
    }, 400);
  }

  function same(v1, v2) {
    if (!v1 || !v2) return false;
    return v1.x === v2.x &&
           v1.y === v2.y &&
           v1.z === v2.z;
  }

  function parseFromHash(hash) {
    if (!hash) {
      return defaultConfig;
    }

    var query = qs.parse(hash.split('?')[1]);

    var pos = {
      x: query.cx || 0,
      y: query.cy || 0,
      z: query.cz || 0
    };

    var lookAt = {
      x: query.lx || 0,
      y: query.ly || 0,
      z: query.lz || 0,
      w: getNumber(query.lw || 1)
    };

    var showLinks = (query.l === '1');
    var orbit = (query.o === '1');
    var showSearchBar = (query.b === '1');
    var muted = (query.m === '0');
    return {
      pos: normalize(pos),
      lookAt: normalize(lookAt),
      showLinks: showLinks,
      orbit: orbit,
      showSearchBar: showSearchBar,
      muted: muted,
      maxVisibleDistance: getNumber(query.ml, defaultConfig.maxVisibleDistance),
      scale: getNumber(query.s, defaultConfig.scale),
      manifestVersion: query.v || defaultConfig.manifestVersion
    };
  }
}

function normalize(v) {
  if (!v) return v;
  v.x = getNumber(v.x);
  v.y = getNumber(v.y);
  v.z = getNumber(v.z);
  return v;
}

function getNumber(x, defaultValue) {
  if (defaultValue === undefined) defaultValue = 0;

  x = parseFloat(x);
  if (isNaN(x)) return defaultValue;
  return x;
}
