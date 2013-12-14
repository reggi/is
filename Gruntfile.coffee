'use strict'

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  # TODO 
  # verify server does minification
  # concat
  grunt.initConfig
    watch:
      interrupt: true
      test:
        tasks: ['test']
        files: [
          '**/*.js'
          '**/*.coffee'
        ]

    jshint:
      # Must load config this way to override options
      options: grunt.util._.extend
        reporter: require('jshint-stylish')
      , JSON.parse grunt.file.read './.jshintrc'

      hint:
        files:
          src: [
            'src/**/*.js'
          ]

    mochaTest:
      options:
        reporter: 'spec'
        require: 'coffee-script'
      test:
        src: ['test/**/*.coffee']

      coverage:
        options:
          reporter: 'html-cov'
          quiet: true
          captureFile: 'coverage.html'
        src: ['test/**/*.coffee']

      travis:
        options:
          reporter: 'travis-cov'
        src: ['test/**/*.coffee']

    docco:
      docs:
        options:
          output: 'docs'
        src: ['src/**/*.js']


  grunt.registerTask 'default', ['test', 'uglify:build']
  grunt.registerTask 'test', ['jshint:hint', 'mochaTest:test']
