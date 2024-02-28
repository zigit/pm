/**
 * Wrapper on top of graph data. Not sure where it will go yet.
 */
import linkFinder from './edgeFinder.js';
export default graph;

function resolveLaw(lawDict, txt) {

  var re = /([0-9]+:[0-9]+)#?K?([0-9]*)P?([0-9]*)S?([0-9]*)(.*)/;
  var myArray = txt.match(re);

  let finalStr = lawDict[myArray[1]]
  if (myArray[2] != '') {
  	finalStr = finalStr + ", Kapitel " + myArray[2];
  }
  if (myArray[3] != '') {
  	finalStr = finalStr + ", Paragraf " + myArray[3];
  }
  if (myArray[4] != '') {
  	finalStr = finalStr + ", Stycke " + myArray[4];
  }
  return finalStr
}

function graph(rawGraphLoaderData) {
  var {labels, outLinks, inLinks, positions, lawDict} = rawGraphLoaderData;
  var empty = [];

  var api = {
    getNodeInfo: getNodeInfo,
    getConnected: getConnected,
    find: find,
    findLinks: findLinks,
  };

  return api;

  function findLinks(from, to) {
    return linkFinder(from, to, outLinks, inLinks, labels);
  }

  function find(query) {
    var result = [];
    if (!labels) return result;

    if (typeof query === 'string') {
      // short circuit if it's blank string - no results
      if (!query) return result;
      query = regexMatcher(query);
    }

    for (var i = 0; i < labels.length; ++i) {
      if (query(i, labels, outLinks, inLinks, positions)) {
        result.push(getNodeInfo(i));
      }
    }

    return result;
  }

  function regexMatcher(str) {
    var regex = compileRegex(str);
    if (!regex) return no;

    return function (i, labels, outLinks, inLinks, pos) {
      var label = labels[i];
      if (typeof label === 'string') {
        return label.match(regex);
      }
      return label.toString().match(regex);
    }
  }

  function no() { return false; }

  function compileRegex(pattern) {
    try {
      return new RegExp(pattern, 'ig');
    } catch (e) {
      // this cannot be compiled. Ignore it.
    }
  }

  function getConnected(startId, connectionType) {
    if (connectionType === 'out') {
      return outLinks[startId] || empty;
    } else if (connectionType === 'in') {
      return inLinks[startId] || empty;
    }
    return empty;
  }

  function getNodeInfo(id) {
    if (!labels) return;

    var outLinksCount = 0;
    if (outLinks[id]) {
      outLinksCount = outLinks[id].length;
    }

    var inLinksCount = 0;
    if (inLinks[id]) {
      inLinksCount = inLinks[id].length;
    }

    return {
      id: id,
      name: labels[id],
      fullName: resolveLaw(lawDict, labels[id]),
      out: outLinksCount,
      in : inLinksCount
    };
  }

  function getName(id) {
    if (!labels) return '';
    if (id < 0 || id > labels.length) {
      throw new Error(id + " is outside of labels range");
    }
    return labels[id];
  }

  function getPositions() {
    return positions;
  }

  function getLinks() {
    return links;
  }
}
