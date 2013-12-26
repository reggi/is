'use strict'

bannerStr = """
  /*
   * @license is.js <%= pkg.version %>
   * (c) 2013 <%= pkg.author %>
   * is.js may be freely distributed under the MIT license.
   * Generated <%= grunt.template.today("yyyy-mm-dd") %>
   */

"""

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

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
        require : 'coffee-script'

      test:
        src: ['test/**/*.coffee']

      coverage:
        options:
          reporter    : 'html-cov'
          quiet       : true
          captureFile : 'coverage.html'
        src: ['test/**/*.coffee']

    #coffee:
    #  test:
    #    options:
    #      bare: true
    #    files:
    #      'test/test.js': 'test/test.coffee'

    #mochacov:
    #  options:
    #    reporter: 'spec'
    #    bail: true

    #  test:
    #    options:
    #      colors: true

    #  cov:
    #    options:
    #      reporter: 'mocha-term-cov-reporter'
    #      coverage: true

    # Set this up to write somewhere else
    docco:
      docs:
        options:
          output: 'docs'
        src: ['src/**/*.js']

    clean:
      build : ['dist']
      test  : ['test/test.js']
      docs  : ['docs']

    uglify:
      options:
        banner          : bannerStr
        preserveComments: 'some'
        report          : 'gzip'
      build:
        files:
          'dist/is.min.js': ['src/is.js']

    copy:
      build:
        expand  : true
        src     : 'src/is.js'
        dest    : 'dist/'
        flatten : true
        filter  : 'isFile'

    usebanner:
      build:
        options:
          position: 'top'
          banner  : bannerStr
        files:
          src: ['dist/is.js']

    yuidoc:
      build:
        name        : '<%= pkg.name %>'
        description : '<%= pkg.description %>'
        version     : '<%= pkg.version %>'
        url         : '<%= pkg.homepage %>'
        options:
          paths : 'src/'
          themedir : 'node_modules/yuidoc-bootstrap-theme'
          helpers  : [
            'node_modules/yuidoc-bootstrap-theme/helpers/helpers.js'
          ]
          outdir   : 'docs/'
          quiet    : false

  grunt.registerTask 'default', ['test', 'build', 'docs']

  # Build tasks
  grunt.registerTask 'build', [
    'clean:build'
    'copy:build'
    'usebanner:build'
    'uglify:build'
  ]

  # Docs tasks
  grunt.registerTask 'docs', [
    'clean:docs'
    'yuidoc:build'
  ]

  # Test tasks
  grunt.registerTask 'test', [
    'jshint:hint'
    'mochaTest:test'
  ]

  ### TODO
  grunt.registerTask 'test', [
    'jshint:hint'
    'coffee:test'
    'mochacov:test'
    'clean:test'
  ]

  grunt.registerTask 'cov', [
    'coffee:test'
    'mochacov:cov'
    'clean:test'
  ]
  ###
