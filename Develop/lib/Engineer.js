// variables: require Employee
const Employee = require("./Employee");

// Code to define and export the Engineer class, which inherts from Employee
class Engineer extends Employee {
    constructor(name, id, email, github) {

        super(name, id, email)
        this.github = github;

    }

    getGithub() {
        return this.github;
    };

    getRole() {
        return "Engineer";
    };
}

module.exports = Engineer;