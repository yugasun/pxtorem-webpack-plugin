# pxtorem-webpack-plugin

<a href="https://www.npmjs.com/package/pxtorem-webpack-plugin"><img src="https://img.shields.io/npm/dm/pxtorem-webpack-plugin.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/pxtorem-webpack-plugin"><img src="https://img.shields.io/npm/v/pxtorem-webpack-plugin.svg" alt="Version"></a>

A webpack plugin for generating rem for stylesheet and inject auto calculate scripts.

## Install

```
npm install pxtorem-webpack-plugin --save-dev
```

## Usage

This plugin should be used with [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PxtoremWebpackPlugin = require('pxtorem-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
    }),
    new PxtoremWebpackPlugin({
      // 
      templates: [
        'index.html'
      ],
      baseWidth: 750,
      baseDpr: 2,
      remUnit: 10,
    }),
  ],
  // ...
}
```

This will generate a file dist/index.html containing the following:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script>
  var designBaseWidth=750;!function(e,t){var n=e.documentElement,i="orientationchange"in window?"orientationchange":"resize",d=function(){var e=n.clientWidth;n.style.fontSize=e/t.designBaseWidth*10+"px",n.setAttribute("data-dpr",Math.floor(window.devicePixelRatio))};d(),e.addEventListener&&t.addEventListener(i,d,!1)}(document,window);
  </script>
  <meta charset="UTF-8">
  <title>Vue webpack demo</title>
</head>
<body>
  <div id="app"></div>
<script type="text/javascript" src="build.js"></script></body>
</html>

```

## Options


You can pass a hash of configuration options to html-webpack-plugin. Allowed values are as follows:

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`templates`](#)**|`{Array}`|`[]`|The html files need to inject rem calculation scripts|
|**[`baseWidth`](#)**|`{Number}`|`750`|The base width for UI design|
|**[`baseDpr`](#)**|`{Number}`|`2`|base device pixel ratio|
|**[`remUnit`](#)**|`{Number}`|`75`| `rem` unit value |


## License

[MIT](./LICENSE)