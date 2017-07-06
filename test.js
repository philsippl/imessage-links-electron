var childProcess = require('child_process')
var jquery = require('jquery');
var iMessage = require('imessage');
var ta = require('time-ago')();
const storage = require('electron-json-storage');
var shell = require('electron').shell;
//open links externally by default

jquery(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});


//var result = childProcess.execSync('imessagejs search "http" --recipient 1 ')

//var array = result.toString().split("---");

var bookmark = function(id){
  console.log(map[id]);
  storage.has(id+"", function(error, hasKey) {
    if (error) throw error;

    bookmarks[id] = !hasKey;

    if (!hasKey) {
      storage.set(id+"", map[id], function(error) {console.log(error)});
      jquery("#"+id+" i").removeClass("fa-bookmark-o");
      jquery("#"+id+" i").addClass("fa-bookmark");
    }else{
      jquery("#"+id+" i").removeClass("fa-bookmark");
      jquery("#"+id+" i").addClass("fa-bookmark-o");
      storage.remove(id+"", function(error) {console.log(error)});
      if(currentView == "bookmarks"){
        loadBookmarks();
      }
    }
  });

}

var iMessage = require('imessage');
var im = new iMessage();

var map = {};
var cache = [];
var currentView = "all";
var bookmarks = {};

var buildList = function(rows){
  for (let obj of rows){

      map[obj.ROWID] = obj;
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
      newElement.html("<div class='bookmark' id='"+obj.ROWID+"' onclick=\"bookmark("+obj.ROWID+")\"><i class='fa fa-bookmark"+(bookmarks[obj.ROWID+""] ? "" : "-o")+"' aria-hidden='true'></i></div><div class='date'>"+date+"</div><a href='"+url+"'>"+url_shortened+"</a>");
      newElement.removeClass("template-entry");
      newElement.click(onclick);

      jquery("body").prepend(newElement);
  }
}

var loadAll = function(){
  currentView = "all";
  jquery(".header-element.right").removeClass("active-header");
  jquery(".header-element.left").addClass("active-header");

  jquery(".template-entry").removeClass("entry");
  jquery(".entry").remove();
  jquery(".template-entry").addClass("entry");

  storage.keys(function(error, keys) {
    bookmarks = arrayToHash(keys);
  });

  cache = hashToArray(map);

  if(cache.length > 0){
    buildList(cache);
  }else {
    im.getMessages("http", function(err, rows) {
      buildList(rows);
    });
  }
}

var loadBookmarks = function(){
  currentView = "bookmarks";

  jquery(".header-element.left").removeClass("active-header");
  jquery(".header-element.right").addClass("active-header");

  jquery(".template-entry").removeClass("entry");
  jquery(".entry").remove();
  jquery(".template-entry").addClass("entry");

  storage.getAll(function(error, data) {
    var array_values = hashToArray(data);
    buildList(array_values);
  });
}

var arrayToHash = function(array){
  let tmp = {};
  for (let obj of array){
    tmp[obj] = true;
  }
  return tmp;
}

var hashToArray = function(hash){
  var array_values = new Array();

  for (var key in hash) {
      array_values.push(hash[key]);
  }
  return array_values;
}

loadAll();
