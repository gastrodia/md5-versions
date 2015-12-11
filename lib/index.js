var fs = require('fs');
var md5 = require('md5');

var walk = require('walk-fs');
var assert = require('assert');
var path = require('path');

//创建多层文件夹 同步
function mkdirsSync(dirpath, mode) { 
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true; 
}

// var options = {
// 	release:'./release',
// 	source:'./dist',
// 	md5Files:[
// 	'./**/*.js',
// 	'./**/*.json',
// 	'./**/*.png',
// 	'./**/*.png'
// 	]
// }




exports.exec = function(options){
  
    walk = function(fpath){
      var files = fs.readdirSync(fpath);
      files.forEach(function(item) {  
          var tmpPath = path.join(fpath , item) ,
              stats = fs.statSync(tmpPath);

          if (stats.isDirectory()) {  
              // console.log(tmpPath)
              // console.log(options.basedir)
              // var relative = tmpPath.replace(options.basedir,'');
              // relative = relative.substring(1,relative.length);
              
              // for(var i in options.md5Files){
              //   var tmpRegex = options.md5Files[i];
              //   if(relative.test(tmpRegex)){
              //      walk(tmpPath); 
              //      break;
              //   }
              // }
              
            
            var releaseDir = tmpPath.replace(path.join(options.basedir,options.source),path.join(options.basedir,options.release));
            mkdirsSync(releaseDir);
            walk(tmpPath); 
              
          } else {  
            //H2101_011_7cb0c38.tt.json
              fs.readFile(tmpPath, function(err, buf) {
                var fileMd5Name = md5(buf);
                var sortMd5 = fileMd5Name.substring(fileMd5Name.length -7 ,fileMd5Name.length);
                var extname = path.extname(item);
                var basename = item.replace(extname,'');
                var md5name = basename + '_' + sortMd5 + extname;
                var rfpath = fpath.replace(path.join(options.basedir,options.source),path.join(options.basedir,options.release));
                var rfname = path.join(rfpath,md5name);
                console.log(tmpPath + ' ---> ' + rfname);
                fs.writeFile(rfname,buf,function(error){
                  assert(!error);
                })
              });
  
          }  
      });  
  };  

  
  walk(path.join(options.basedir,options.source));
 
}
