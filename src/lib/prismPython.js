import Prism from 'prismjs';

if (!Prism.languages.python) {
  Prism.languages.python = {
    comment: { pattern: /#.*/, greedy: true },
    string: {
      pattern: /("""|'''|"|')(?:\\[\s\S]|(?!\1)[^\\]|\1\1(?!\1))*\1/,
      greedy: true,
    },
    keyword: /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/,
    builtin: /\b(?:abs|all|any|bool|bytes|callable|chr|dict|dir|divmod|enumerate|eval|filter|float|format|frozenset|getattr|globals|hasattr|hash|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip)\b/,
    boolean: /\b(?:True|False|None)\b/,
    number: /\b0(?:x[\da-f]+|o[0-7]+|b[01]+)\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?j?/i,
    decorator: { pattern: /@\w+(?:\.\w+)*/, alias: 'function' },
    operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/,
  };
}

export default Prism;
