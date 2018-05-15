/* Gruntfile */

'use strict'

module.exports = function (grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt)

  grunt.loadNpmTasks('grunt-aws-lambda')
  grunt.loadNpmTasks('grunt-standard')

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
      },
      error: {
        options: {
          event: 'event_error.json'
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

  grunt.registerTask('package', ['standard', 'lambda_package'])
}
