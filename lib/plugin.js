const _ = require('lodash');
const Px2rem = require('px2rem');

// 默认计算脚本，需要将 remUnit 替换为用户配置参数
let calScript = '!function(e,t){var n=e.documentElement,i="orientationchange"in window?"orientationchange":"resize",d=function(){var e=n.clientWidth;n.style.fontSize=e/t.designBaseWidth*remUnit+"px",n.setAttribute("data-dpr",Math.floor(window.devicePixelRatio))};d(),e.addEventListener&&t.addEventListener(i,d,!1)}(document,window);';

const px2remLoaderFile = require.resolve('px2rem-loader')

class Px2remWebpackPlugin {
  constructor(options) {
    // default options
    this.options = _.extend({
      templates: [],
      cssFiles: [],
      remUnit: 10,
      baseDpr: 2,
      baseWidth: 750,
    }, options);
  }

  // 动态注入 px2rem-loader
  injectPx2remLoader(resource, loaders) {
    const REGEX = /\/node_modules\/(?:[\.\w]+@)?css-loader\//
    const idx = _.findIndex(loaders, path => REGEX.test(path.loader.replace(/\\/g, '/')))
    const isInNodeModules = resource.includes('/node_modules/')
    if (idx === -1 || isInNodeModules) return;
    loaders.splice(idx + 1, 0, {
      loader: px2remLoaderFile,
      options: this.options,
    })
  }

  apply(compiler) {
    const options = this.options;
    const px2remIns = new Px2rem(options);
    const self = this;
    compiler.plugin('normal-module-factory', function (nmf) {
      nmf.plugin('after-resolve', function (data, next) {
        self.injectPx2remLoader(data.resource, data.loaders);
        next(null, data);
      })
    })

    compiler.plugin('emit', function (compilation, callback) {
      // 对html模板进行处理
      options.templates.forEach((template) => {
        const htmlAsset = compilation.assets[template]
        if (htmlAsset) {
          let htmlContent = htmlAsset.source();
          htmlAsset.source = function () {
            calScript = calScript.replace('remUnit', options.remUnit);
            // 注入动态计算脚本
            htmlContent = htmlContent.replace('<head>', `<head><script>var designBaseWidth=${options.baseWidth};${calScript}</script>`);
            return htmlContent;
          }
        }
      })

      callback();
    })
  }
}

module.exports = Px2remWebpackPlugin;