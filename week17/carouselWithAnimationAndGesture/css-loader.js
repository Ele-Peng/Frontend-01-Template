let css = require('css');

module.exports = function (source, map) {

  var stylesheet = css.parse(source);
  
  let name = this.resourcePath.match(/([^/]+).css$/)[1];

  for (let rule of stylesheet.stylesheet.rules) {
    rule.selectors = rule.selectors.map(selector => {
      return selector.match(new RegExp(`^.${name}`))
      ? selector
      : `.${name} ${selector}`
    });
  }

  console.log(css.stringify(stylesheet));

  return `
  let style = document.createElement("style");
  style.innerHTML = ${JSON.stringify(css.stringify(stylesheet))};
  document.head.appendChild(style);
  `;
}
// console.log(css);

// let style = document.createElement("style");

// style.innerHTML = css[0][1];

// document.documentElement.appendChild(style);