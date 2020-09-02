// variables: require Employee
const Employee = require("./Employee");

// Code to define and export the Manager class, which inherits from Employee.
class Manager extends Employee {
    constructor(name, id, email, officeNumber) {

        super(name, id, email)
        this.officeNumber = officeNumber;

    }

    getRole() {
        return "Manager";
    };

    getOfficeNumber() {
        return this.officeNumber;
    };

}

module.exports = Manager;