var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '');
var packageName = "package/package" + utc + ".zip";
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        assemble: {
            options: {
                flatten: true,
                partials: ['templates/includes/*.hbs'],
                layoutdir: 'templates/layouts',
                layout: 'default.hbs',
                helpers: ['lib/**/*.js'],
                removeHbsWhitespace: true,
                production: "false",
                version: Math.floor((Math.random() * 1000) + 1),
                //    deploy:"false"
                //  ext: '_en.html'
            },
            //build:{
            //
            //    options:{
            //        production: true
            //    }
            //},
            en: {
                options: {
                    language: "en"
                },
                files: {'en/': ['templates/*.hbs']}
            },
            ar: {
                options: {
                    language: "ar"
                },
                files: {'ar/': ['templates/*.hbs']}
            },
            enProduction: {
                options: {
                    language: "en",
                    production: "true"
                },
                files: {'en/': ['templates/*.hbs']}
            },
            arProduction: {
                options: {
                    language: "ar",
                    production: "true"
                },
                files: {'ar/': ['templates/*.hbs']}
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'common/css/style.css': 'common/sass/style.scss',
                    'common/css/style_ar.css': 'common/sass/style_ar.scss'

                    // 'Common/css/style_ar.css': 'Common/css/style_ar.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['Common/sass/*.scss', 'Common/sass/**/*.scss'],
                tasks: ['sass']
            },
            assemble: {
                files: ['**/*.hbs'],
                tasks: ['assemble:en', 'assemble:ar']
            },
            compass: {
                files: ['Common/images/icons/*.png'],
                tasks: ['compass'],
                options: {
                    event: ['changed', 'added', 'deleted']
                }
            },
            options: {
                livereload: true

                //   event: ['added', 'deleted']
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'Common/css/app.min.css': ['Common/css/bootstrap.css', 'Common/css/style.css'],
                    'Common/css/app-ar.min.css': ['Common/css/bootstrap.css', 'Common/css/style.css', 'Common/css/style-ar.css']
                }
            }
        },
        tinypng: {
            options: {
                apiKey: "JrouuOhPO189HHtUstQnQ1zAzJ3etgon",
                checkSigs: false,
                sigFile: 'file_sigs.json',
                summarize: true,
                showProgress: true,
                stopOnImageError: true
            },
            compress_jpg: {
                expand: true,
                src: 'Common/images/**/*.{jpg,jpeg}',
                dest: 'Common/compress-img/'
                // ext: '.min.png'
            },
            compress_png: {
                expand: true,
                src: ['Common/images/**/*.png', '!Common/images/icons/*.png'],
                dest: 'Common/compress-img/'
                // ext: '.min.png'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['Common/js/jquery/jquery-1.10.1.min.js', 'Common/js/lib/*.js', 'Common/js/default.js'],
                dest: 'Common/js/app.min.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    'Common/js/app.min.js': 'Common/js/app.min.js'
                }
            }
        },
        compass: {                  // Task
            dist: {                   // Target
                options: {
                    config: 'config.rb',
                    force:true,
                    sassDir: 'Common/sass/icon/',
                    cssDir: 'Common/css/',
                    environment: 'development'
                }
            }
        },
        zip: {
            'package': {
                src: ['common/**/*', 'en/**/*', 'ar/**/*', 'templates/**/*'],
                dest: packageName
            }
        }
    });
    // Load the Assemble plugin.
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-tinypng');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask(
        'build',
        [
            'assemble:enProduction',
            'assemble:arProduction',
            'compass',
            'sass',
            'cssmin',
            'concat',
            'uglify',
            'tinypng:compress_jpg',
            'tinypng:compress_png',
            'zip'
        ]
    );
};
