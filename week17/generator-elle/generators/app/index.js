var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
        
    }
    async prompting() {
      this.answers = await this.prompt([{
        type    : 'input',
        name    : 'title',
        message : 'Your project title',
      }]);
    }
  
    writing() {
      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('public/index.html'),
        { title: this.answers.title } // user answer `title` used
      );
    }
};

// User Interactions
// Templates File System
// Npm Dependencies