var childProcess = require('child_process')
jquery = require('jquery');
var iMessage = require('imessage');
var ta = require('time-ago')();

var shell = require('electron').shell;
//open links externally by default

jquery(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});


//var result = childProcess.execSync('imessagejs search "http" --recipient 1 ')

//var array = result.toString().split("---");

var onclick = function(t,e){

  console.log(t.href);
}

var iMessage = require('imessage');
var im = new iMessage();


im.getMessages("http", function(err, rows) {
  for (let obj of rows){
      console.log(obj)
      fromMe = obj.is_from_me
      url = obj.text
      date = ta.ago((obj.date + iMessage.OSX_EPOCH)*1000)

      if(url == undefined || (!url.startsWith("http://") && !url.startsWith("https://"))){
        continue;
      }

      url_shortened = url;

      if(url.length > 100){
        url_shortened = url.substring(0,100);
        url_shortened += "..."
      }

      var newElement = jquery(".template-entry").clone();
      if(fromMe){
        newElement.addClass("fromMe");
      }
      newElement.html("<div class='date'>"+date+"</div><a href='"+url+"'>"+url_shortened+"</a>");
      newElement.removeClass("template-entry");
      newElement.click(onclick);

      jquery("body").prepend(newElement);

  }
});
