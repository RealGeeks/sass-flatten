'use strict';

var fs = require('fs');
var read = fs.readFileSync;
var path = require('path');
var gonzales = require('gonzales-pe');

var flatten = module.exports = function (data, includePath) {
  var ast = gonzales.parse(data, {syntax: 'scss'});
  var content = ast.content;
  var args;

  for (var index = 0; index < (content.length || 0); index++) {
    var node = content[index];

    if (isImportStatement(node)) {
      args = node.content.reduce(
        accumulate.bind(undefined, node.includePath || includePath),
        []
      );

      // Only remove node at index if we successfully imported something.
      if (args.length) {
        // Remove import node and delimiter node.
        args.unshift(index, 2);
        content.splice.apply(content, args);

        // Go one step back because we now have a different node at index.
        index--;
      }
    }
  }

  return ast.toCSS('scss');
};

var resolveScssPath = flatten.resolvePath = function (sassPath, includePaths) {
  // Remove file extension.
  var sassPathName = sassPath.replace(/\.\w+$/, '');
  var file;

  for (var index = 0; index < includePaths.length; index++) {
    // We only care about _partials.
    file = path.normalize(includePaths[index] + '/' + sassPathName + '.scss');
    file = path.join(path.dirname(file), '_' + path.basename(file));

    if (fs.existsSync(file)) {
      return file;
    }

    else {
      throw new Error("Could not resolve import for file " + file + " with sassPath " + sassPath + " with include paths " + includePaths);
    }
  }
};

function isImportStatement(node) {
  return node.type == 'atrules' &&
    node.content[0].type == 'atkeyword' &&
    node.content[0].content[0].type == 'ident' &&
    node.content[0].content[0].content == 'import';
}

function accumulate(includePath, array, node) {
  if (node.type == 'string') {
    var resolvedFile = resolveScssPath(
      // Remove quotes
      node.content.slice(1, -1),
      [includePath]
    );

    if (resolvedFile) {
      var resolvedDir = path.dirname(resolvedFile);
      var subnodes = gonzales.parse(
        read(resolvedFile, 'utf8'),
        {syntax: 'scss'}
      ).content;

      subnodes.forEach(function (node) {
        node.includePath = resolvedDir;
      });

      return array.concat(subnodes);
    }
  }

  return array;
}
