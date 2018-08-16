const loaderUtils = require('loader-utils')
const vueLoader = require('vue-loader');
const qs = require('querystring')

const marked = require('marked');
const {Parser, Lexer, Renderer} = marked;

const getNextId = (function(t, n){
  return function() {
    return `doc-${t}-${++n}`;
  };
})(Date.now(), 0);

class DocRenderer extends Renderer {
  code(code, lang, escaped) {
    const id = getNextId();
    this.options.docCtx.docs.push({
      id,
      src: code,
      index: this.options.docCtx.docs.length,
    });

    return `<vue-doc-md doc-id="${id}"></vue-doc-md>`;
  }

}

function docMarked(src, opt) {
  opt = Object.assign({}, marked.defaults, {
    docCtx: {docs: []},
    renderer: new DocRenderer(),
  }, opt || {});

  const tokens = Lexer.lex(src, opt);
  const parser = new Parser(opt);
  return parser.parse(tokens);
}

module.exports = function (source) {
  const loaderContext = this;

  const {
    resourcePath,
    resourceQuery
  } = loaderContext;

  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);

  const docCtx = {docs: []};
  const main = docMarked(source, {docCtx});
  const s = JSON.stringify;
  const docs = docCtx.docs;

  if ('docIndex' in incomingQuery) {
    let src = docs[incomingQuery.docIndex].src;
    if (incomingQuery.type) {
      return vueLoader.call(this, src);
    }

    return src;
  }

  const loaderReq = this.loaders[this.loaderIndex].request;

  return `
  const comps = [
  ${docs.map(doc => {
    return `
    require(${loaderUtils.stringifyRequest(loaderContext, `!!vue-loader!${loaderReq}!${resourcePath}?vue&docIndex=${doc.index}`)}),
    `;
  }).join('\n')}
  ];

  export default {
  docId: '${getNextId()}',
  main: ${s(main)},
  docs: {
    ${docs.map((doc, idx) => {
      return `"${doc.id}": {
        src: ${s(doc.src)},
        comp: comps[${idx}],
      },
      `
    }).join('\n')}
    },
  }`;
};
