
var filePathConfig=[
	 {
		  'path':"framework/scripts",
		  'type':'js',
		  'msg':'require config js'
	 },
	 {
		  'path':"framework/scripts/lib",
		  'type':'js',
		  'msg':'lib js'
	 },
	 {
		  'path':"framework/scripts/app",
		  'type':'js',
		  'msg':'app js'
	 },
	 {
		  'path':"framework/styles",
		  'type':'css',
		  'msg':'framework css'
	 },
	 {
		  'path':"framework/styles/font-awesome/less",
		  'type':'other',
		  'msg':'font-awesome less'
	 },
	 {
		  'path':"framework",
		  'type':'html',
		  'msg':'framework html'
	 },
	 {
		  'path':"framework/styles/font-awesome/fonts",
		  'type':'other',
		  'msg':'font-awesome fonts'
	 },
	 {
		  'path':"framework/styles/font-awesome/css",
		  'type':'other',
		  'msg':'font-awesome css'
	 },
	 {
		  'path':"framework/images",
		  'type':'img',
		  'msg':'framework img'
	 }
 ];

var gulp = require('gulp'), 
    minifycss = require('gulp-minify-css'),//css压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    uglify = require('gulp-uglify'),//压缩混淆
    htmlmin = require('gulp-htmlmin'),
    browserSync = require('browser-sync').create();
    notify = require('gulp-notify');//加控制台文字描述用的 
	
var inputBasePath="src";
var outBasePath="dist";	
var taskList=[];
var taskFactory=function(taskName,src,dest,type,mssage){

    if(type==='js')
	{
		 gulp.task(taskName, function () {			
			gulp.src(src)
			  .pipe(uglify())
			  .pipe(gulp.dest(dest));
		 });
	}
	else if(type==='css')
	{
		 gulp.task(taskName, function () {			
			 gulp.src(src)
				.pipe(minifycss())
				.pipe(gulp.dest(dest))
				.pipe(notify({ message: mssage }));
		 });
	}
	else if(type==='html')
	{
		 gulp.task(taskName, function () {			
			gulp.src(src)
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(gulp.dest(dest))
			.pipe(notify({ message: message }));
		 });
	}
	else if(type==='img')
	{
		 gulp.task(taskName, function () {			
			gulp.src(src)
			.pipe(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngcrush()]
			}))
			.pipe(gulp.dest(dest))
			.pipe(notify({ message: message }));
		 });
	}
	else {
	    gulp.task(taskName, function () {			
			gulp.src(src)
			  .pipe(gulp.dest(dest));
		});
	}
   taskList.push(taskName);
}	
var createTask=function() {
	 
	for(var i=0;i<filePathConfig.length;i++)
	{
	    var config=filePathConfig[i];
		var src=inputBasePath+'/'+config.path;
		var dest=outBasePath+'/'+config.path;
		var taskName='framework_mini_'+i;
		
		switch(config.type)
		{
	    	case 'js':
			    src=src+'/*.js';
				taskName=taskName+'_js';break;
			case 'css':
		    	src=src+'/*.css';
				taskName=taskName+'_css';break;
			case 'html':
			    src=src+'/*.html';
				taskName=taskName+'_html';break;
			case 'img':
			    src=src+'/*';
				taskName=taskName+'_img';break;
			default:
			    src=src+'/*';
			    taskName=taskName+'_other';break;
		}
		
		taskFactory(taskName,src,dest,taskName,config.msg);					
	}	  
};

gulp.task('browser-sync', function() {
    var files = [
    '**/*.html',
    '**/*.css',
    '**/*.js'
    ];
    browserSync.init(files,{
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('p',function () {

    createTask();
	for (var i=0;i<taskList.length;i++)
	{
	  gulp.run(taskList[i]);
	}	
});

gulp.task('default',['browser-sync']); //定义默认任务