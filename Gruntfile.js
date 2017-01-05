module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        cssmin:{
           minify:{
               expand: true,
               cwd: 'css',
               src: ['*.css'],
               dest: 'css',
               ext: '.min.css'
           },
           options:{
               keepSpecialComments: 0
           }
        }
    });

    // Load the plugin that provides the "cssmin" task.
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('default', ['cssmin']);

};
