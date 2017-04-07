/* Gruntfile */

'use strict'

module.exports = function (grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt)

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {})

  grunt.loadNpmTasks('grunt-aws-lambda')

  grunt.initConfig({
    standard: {
      options: {
        format: true
      },
      all: {
        src: [
          '*.js'
        ]
      }
    },
    lambda_invoke: {
      default: {
        options: {
          file_name: 'index.js'
        }
      }
    },
    lambda_deploy: {
      default: {
        function: 'Turner'
      }
    },
    lambda_package: {
      default: {
      }
    }
  })

  // Default task.
  grunt.registerTask('default', [
    'standard',
    'lambda_invoke'
  ])

  grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy'])
}
