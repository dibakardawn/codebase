'use strict';
var querystring = require('querystring');
var _ = require('underscore');
//var https = require('https');
//var API_HOST='http://localhost:7878';
var API_HOST='https://ssggrnsitgt01-inbound.nam.nsroot.net:3443';
var AUTH_HOST='https://ssggrnsitgt01-inbound.nam.nsroot.net:3443';
//var API_HOST='http://vm-c58b-e473.nam.nsroot.net:8085';
//DIT PSG http://vm-e981-342d.nam.nsroot.net:8085

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var LIVERELOAD_PORT = 36739;
var SERVER_PORT = 8000;
var API_MOCKER_PORT = 9898;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {

    return connect.static(require('path').resolve(dir));
};
var modRewrite = require('connect-modrewrite');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    //require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-collection');

    // configurable paths
    var yeomanConfig = {
        app: 'src',
        dist: 'build'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            livereload: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.{html,js,appcache}',
                    '<%= yeoman.app %>/platform/lib/prod/{,*/}*.js',
                    '<%= yeoman.app %>/platform/{,*/}*.js',
                    '<%= yeoman.dist %>/ref_app/*.js',
                    '{build,<%= yeoman.app %>}/{,*/}*.js',
                    '{build,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '<%= yeoman.app %>/{,*/}*.hbs',
                    'test/spec/**/*.js',
                    'data/*.json'
                ]
            },
            handlebars: {
                files: [
                    '<%= yeoman.app %>/{,*/}*.hbs'
                ],
                tasks: ['handlebars']
            },
            test: {
                files: [
                    '<%= yeoman.app %>/{,*/}*.js',
                    'test/spec/**/*.js',
                    'data/*.json'
                ],
                tasks: ['test:true']
            }
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0',
                debug: true

            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            modRewrite([
                                '^/(auth/.*|account/services/.*|v1/config/.*)$ http://localhost:7878/$1',
                                '!\\.html|\\.js|\\.css|\\.jpg|\\.gif|\\.png|\\.woff|\\.eot?#iefix|\\.eot|\\.woff2|\\.svg#interstatelight$ /index.html [L]'
                            ]),


                            mountFolder(connect, 'build'),
                            mountFolder(connect, 'data'),
                            mountFolder(connect, yeomanConfig.app)


                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'build'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect,'data'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            testInBrowser: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'build'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect,'data'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: ['build', '<%= yeoman.dist %>/*'],
            server: 'build'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/{,*/}*.js',
                '!<%= yeoman.app %>/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    //reporter:'mocha-xunit-zh',
                    urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: '<%= yeoman.app %>',
                    optimize: 'none',
                    paths: {
                        'templates': '../../build/ref_app/templates'
                    },
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    findNestedDependencies:true
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        'build/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*.*'
                    ]
                }]
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= yeoman.app %>/main.js'
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST',
                    amd: true,
                    processName: function(filePath) {
                        return filePath.replace(yeomanConfig.app + '/', '');
                    }
                },
                files: {
                    'src/modules/templates.js': [
                        '<%= yeoman.app %>/**/*.hbs'
                    ]
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        }
    });

    grunt.registerTask('test:browser', [
        'clean:server',
        'createDefaultTemplate',
        'handlebars',
        'connect:testInBrowser',
        'open',
        'watch'
    ]);

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('src/modules/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve' + (target ? ':' + target : '')]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['clean:server','build', 'open:server', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',
                'createDefaultTemplate',
                'handlebars',
                'connect:test',
                'open:test',
                'watch'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'createDefaultTemplate',
            'handlebars',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',
                'createDefaultTemplate',
                'handlebars',
                'connect:test',
                'mocha'
            ];

        if(!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'createDefaultTemplate',
        'handlebars',
        'useminPrepare',
        'requirejs',
        'htmlmin',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);
};
