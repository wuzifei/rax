const babylon = require('babylon');
const template = require('babel-template');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const t = require('babel-types');
const uppercamelcase = require('uppercamelcase');
const { uniqueInstanceID } = require('./utils');

/**
 * kv: {
 *   'foo': 'Bar'
 * }
 * foo is stringLiteral
 * bar is identifier
 * name: is variable name
 */
exports.declearObject = function(kv, name) {
  const properties = Object.keys(kv).map(key => {
    const value = kv[key];
    return t.objectProperty(
      t.identifier(key),
      typeof value === 'number'
        ? t.numericLiteral(value)
        : t.stringLiteral(value)
    );
  });
  const ast = t.variableDeclaration('var', [
    t.variableDeclarator(t.identifier(name), t.objectExpression(properties))
  ]);

  return generate(ast).code;
};

exports.declearVariables = function(kv) {
  const declearations = Object.keys(kv).map(key => {
    const value = kv[key];

    return t.variableDeclaration('var', [
      t.variableDeclarator(
        t.identifier(key),
        typeof value === 'number'
          ? t.numericLiteral(value)
          : t.stringLiteral(value)
      )
    ]);
  });

  const ast = t.program(declearations);
  return generate(ast).code;
};

/**
 * 声明一系列变量
 * @param {Object} tags
 * @param {String} parent
 */
exports.declearTags = function(tags, parentName) {
  const declearators = Object.keys(tags).map(sourceTagName => {
    const targetName = tags[sourceTagName];

    return t.variableDeclarator(
      t.identifier(targetName),
      t.logicalExpression(
        '||',
        t.memberExpression(
          t.identifier(parentName),
          t.stringLiteral(sourceTagName),
          true
        ),
        t.stringLiteral(sourceTagName)
      )
    );
  });

  const ast = t.variableDeclaration('var', declearators);
  return generate(ast).code;
};
