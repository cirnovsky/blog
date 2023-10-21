var htmlVoidElements = ['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'frame', 'hr', 'image', 'img', 'input', 'isindex', 'keygen', 'link', 'menuitem', 'meta', 'nextid', 'param', 'source', 'track', 'wbr'];

var attrRE = /\s([^'"\s><=]+)(?:\s*=\s*(['"])([^]*?)\2)?/g;
// Regular expression for matching and capturing attributes and their values in an HTML tag.
var parseTag = function parseTag(tag) {
  var res = {
    type: 'tag',
    name: '',
    voidElement: false,
    attrs: {},
    children: []
  };
  var tagMatch = tag.match(/<\/?([^\s]+?)[/\s>]/);
  if (tagMatch) {
    res.name = tagMatch[1];
    res.voidElement = htmlVoidElements.includes(tagMatch[1]) || tag.charAt(tag.length - 2) === '/';
    if (res.name.startsWith('!--')) {
      var endIndex = tag.indexOf('-->');
      return {
        type: 'comment',
        comment: endIndex !== -1 ? tag.slice(4, endIndex) : ''
      };
    }
  }
  var reg = new RegExp(attrRE);
  var result = null;
  for (;;) {
    result = reg.exec(tag);
    if (result === null) {
      break;
    }
    if (!result[0].trim()) {
      continue;
    }
    var attrName = result[1];
    var attrValue = result[3]; // Capture the attribute value without quotes
    if (attrName && attrValue !== undefined) {
      res.attrs[attrName] = attrValue;
    }
  }
  return res;
};

var tagRE = /<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g;
var whitespaceRE = /^\s*$/;
// re-used obj for quick lookups of components
var empty = /*#__PURE__*/Object.create(null);
var parse = function parse(html, options) {
  if (options === void 0) {
    options = {};
  }
  options || (options = {});
  options.components || (options.components = empty);
  var result = [];
  var arr = [];
  var current;
  var level = -1;
  var inComponent = false;
  // handle text at top level
  if (html.indexOf('<') !== 0) {
    var end = html.indexOf('<');
    result.push({
      type: 'text',
      content: end === -1 ? html : html.substring(0, end)
    });
  }
  // @ts-ignore
  html.replace(tagRE, function (tag, index) {
    if (inComponent) {
      if (tag !== '</' + current.name + '>') {
        return '';
      } else {
        inComponent = false;
      }
    }
    var isOpen = tag.charAt(1) !== '/';
    var isComment = tag.startsWith('<!--');
    var start = index + tag.length;
    var nextChar = html.charAt(start);
    var parent;
    if (isComment) {
      var comment = parseTag(tag);
      // if we're at root, push new base node
      if (level < 0) {
        result.push(comment);
        return result;
      }
      parent = arr[level];
      if (parent && parent.children && Array.isArray(parent.children)) {
        parent.children.push(comment);
      }
      return result;
    }
    if (isOpen) {
      level++;
      current = parseTag(tag);
      if (current.type === 'tag' && current.name && options.components && options.components[current.name]) {
        current.type = 'component';
        inComponent = true;
      }
      if (!current.voidElement && !inComponent && nextChar && nextChar !== '<' && Array.isArray(current.children)) {
        current.children.push({
          type: 'text',
          content: html.slice(start, html.indexOf('<', start))
        });
      }
      // if we're at root, push new base node
      if (level === 0) {
        result.push(current);
      }
      parent = arr[level - 1];
      if (parent && parent.children) {
        parent.children.push(current);
      }
      arr[level] = current;
    }
    if (!isOpen || current.voidElement) {
      if (level > -1 && (current.voidElement || current.name === tag.slice(2, -1))) {
        level--;
        // move current up a level to match the end tag
        current = level === -1 ? result : arr[level];
      }
      if (!inComponent && nextChar !== '<' && nextChar) {
        // trailing text node
        // if we're at the root, push a base text node. otherwise add as
        // a child to the current node.
        parent = level === -1 ? result : arr[level].children;
        // calculate correct end of the content slice in case there's
        // no tag after the text node.
        var _end = html.indexOf('<', start);
        var content = html.slice(start, _end === -1 ? undefined : _end);
        // if a node is nothing but whitespace, collapse it as the spec states:
        // https://www.w3.org/TR/html4/struct/text.html#h-9.1
        if (whitespaceRE.test(content)) {
          content = ' ';
        }
        // don't add whitespace-only text nodes if they would be trailing text nodes
        // or if they would be leading whitespace-only text nodes:
        //  * end > -1 indicates this is not a trailing text node
        //  * leading node is when level is -1 and parent has length 0
        if (_end > -1 && level + parent.length >= 0 || content !== ' ') {
          if (parent && Array.isArray(parent)) {
            parent.push({
              type: 'text',
              content: content
            });
          }
        }
      }
    }
  });
  return result;
};

function attrString(attrs) {
  var buff = [];
  for (var key in attrs) {
    buff.push(key + '="' + attrs[key] + '"');
  }
  if (!buff.length) {
    return '';
  }
  return ' ' + buff.join(' ');
}
function _stringify(buff, doc) {
  switch (doc.type) {
    case 'text':
      return buff + doc.content;
    case 'tag':
      buff += '<' + doc.name + (doc.attrs ? attrString(doc.attrs) : '') + (doc.voidElement ? '/>' : '>');
      if (doc.voidElement) {
        return buff;
      }
      return buff + doc.children.reduce(_stringify, '') + '</' + doc.name + '>';
    case 'comment':
      buff += '<!--' + doc.comment + '-->';
      return buff;
    default:
      return '';
  }
}
var stringify = function stringify(doc) {
  return doc.reduce(function (token, rootEl) {
    return token + _stringify('', rootEl);
  }, '');
};

export { htmlVoidElements, parse, stringify };
//# sourceMappingURL=html-to-ast.esm.js.map
