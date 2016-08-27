
var gulp = require("gulp");
var Git = require("nodegit");
var $ = require("gulp-load-plugins")();
var runSequence = require('gulp-run-sequence');

var pkg = require("./bower.json");
var es = require('event-stream');

var srcPath = "src";
var distPath = "dist";
var outputName = "angular-material-lightbox";

var banner = '/*\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.repository %>\n' +
    '*/\n\n';

gulp.task("build", ["build-js", "build-css"]);
gulp.task("build-js", buildJs);
gulp.task("build-css", buildCss);
gulp.task("bump-version-patch", bumpVersion("patch"));
gulp.task("bump-version-minor", bumpVersion("minor"));
gulp.task("bump-version-major", bumpVersion("major"));



function bumpVersion(type){
    return function(){
        Git.Repository.open(".").then(function(repo){
            return repo.getStatus();
        }).then(function(status){
            if(status.length>0){
                throw new Error("Working directory is no clean! Please first commit your changes and try again");
            }
        }).then(function(){
            runSequence("build", function(){
                gulp.src(['bower.json', 'package.json'])
                    .pipe($.bump({type:type}))
                    .pipe(gulp.dest('./'))
                    .pipe($.git.commit('chore(all): bump version'))
                    .pipe($.filter('package.json'))
                    .pipe($.tagVersion({prefix: ""}));
            })

        }).catch(function(error){
            console.error("Error in bumping version: ", error.message)
        });
    }
}

function buildJs(){
    return es.merge(
        gulp.src(srcPath + "/**/*.js"),
        getHtmlJsStream()
    )
        .pipe($.plumber())
        .pipe($.concat(outputName + ".js"))
        .pipe($.stripBanner())
        .pipe($.banner(banner,{
            pkg: pkg
        }))
        .pipe(gulp.dest(distPath))
        .pipe($.uglify())
        .pipe($.rename({suffix: ".min"}))
        .pipe(gulp.dest(distPath));
}
function buildCss(){
    gulp.src(srcPath + "/**/*.scss")
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.concatCss(outputName + ".css"))
        .pipe(gulp.dest(distPath))
        .pipe($.minifyCss())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(distPath));
}
function getHtmlJsStream(){
    return gulp.src(srcPath + "/**/*.html")
        .pipe($.html2js({base: srcPath}));
}
