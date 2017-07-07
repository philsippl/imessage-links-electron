
var menubar = require('menubar')
const Path = require('path')


const mb = menubar({
  tooltip: 'You are 1 click away from awesomeness',
  index: Path.join('file://', __dirname, 'index.html')
})

mb.on('ready', function ready () {

})

mb.on('show', function ready () {
    mb.window.webContents.send('reload', 'xxx');
})
