
var menubar = require('menubar')
const Path = require('path')


const mb = menubar({
  index: Path.join('file://', __dirname, 'index.html')
})

mb.on('ready', function ready () {

})

mb.on('show', function ready () {
  require('app').quit();
    mb.window.webContents.send('reload', 'xxx');
})
