// Variables
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const jest = require("jest");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
const util = require("util");
const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;
const axios = require("axios");
const employeesArray = [];

// Create server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  runCLI();
});

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// Run command line interface
function runCLI() {
  inquirer
    // Prompt the user asking them what they want to do
    .prompt({
      type: "confirm",
      message: "Are you the team manager?",
      name: "confirmManager",
      default: true
    })
    // Depending on their answer, initiate a particular function
    .then(function (answer) {
      if (answer.confirmManager === true) {
        addManager();
      } 
      else {
        // Close server
        server.close();
      }
    });
}

// Function for add a manager
function addManager() {
  // Prompt the manager with some questions about themselves
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your full name?",
        name: "name"
      },
      {
        type: "input",
        message: "What is your user email?",
        name: "email"
      },
      {
        type: "input",
        message: "What is your id?",
        name: "id"
      },
      {
        type: "input",
        message: "What is your office number?",
        name: "officeNumber"
      },
      {
        type: "confirm",
        message: "Would you like to add a new employee to your team?",
        name: "confirmEmployee",
        // default: true
      }
    ])
    // Depending on their answer, initiate a particular function
    .then(function (answer) {
      const managerInfo = new Manager(
        answer.name,
        answer.id,
        answer.email,
        answer.officeNumber
      );

      employeesArray.push(managerInfo);

      if (answer.confirmEmployee === true) {
        addEmployee();
      } 
      else {

        let renderHTML = render(employeesArray);
  
        fs.writeFile("./output/team.html", renderHTML, function (err) {
          if (err) throw err;
          console.log("Team added!");
        });

        // Close server
        server.close();
      }
    });
}

// Function for adding a new employee
function addEmployee() {

  inquirer
    .prompt([
      {
        type: "list",
        message: "What is your employee's role in the company?",
        choices: [
          "Engineer", 
          "Intern"
        ],
        name: "role",
      },
    ])
    .then(function (answer) {
      // Depending on their answer, initiate a particular function for adding an engineer or intern
      if (answer.role === "Engineer") {
        addEngineer();
      } else if (answer.role === "Intern") {
        addIntern();
      }
    });
}


// Function for adding an engineer
function addEngineer() {
  // Prompt the manager with quesions asking them about information regarding their engineer
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your Engineer's full name?",
        name: "name",
      },
      {
        type: "input",
        message: "What is your Engineer's email?",
        name: "email",
      },
      {
        type: "input",
        message: "What is your Engineer's id?",
        name: "id",
      },
      {
        type: "input",
        message: "What is your Engineer's GitHub username?",
        name: "github",
      }
    ])
    // Depending on their answer, initiate a particular function
    .then((answers) => {
      // call getGitHubProfileInfo function
      getGitHubProfileInfo(answers.github);

      const engineerInfo = new Engineer(
        answers.name,
        answers.id,
        answers.email,
        answers.github
      );
      employeesArray.push(engineerInfo);
      addNewEmployee();
    });
}

// Function for adding an intern
function addIntern() {
  // Prompt the manager with quesions asking them about information regarding their intern
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your Intern's name?",
        name: "name",
      },
      {
        type: "input",
        message: "What is your Intern's email?",
        name: "email",
      },
      {
        type: "input",
        message: "What is Intern's id?",
        name: "id",
      },
      {
        type: "input",
        message: "What university is your Intern currently attending?",
        name: "school",
      }
    ])
    // Depending on their answer, initiate a particular function
    .then((answers) => {
      const internInfo = new Intern(
        answers.name,
        answers.id,
        answers.email,
        answers.school
      );

      // After the user has input all employees desired, call the `render` function (required
      // above) and pass in an array containing all employee objects; the `render` function will
      // generate and return a block of HTML including templated divs for each employee!
      employeesArray.push(internInfo);
      addNewEmployee();
    });
}

// Function for adding a new employee
function addNewEmployee() {

  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Would you like to add a new employee to your team?",
        name: "confirmNewEmployee",
        default: true,
      },
    ])
    // Depending on their answer, initiate a particular function
    .then(function (answer) {
      if (answer.confirmNewEmployee === true) {
        addEmployee();
      } else {
        // Close server
        let renderHTML = render(employeesArray);
  
        // After you have your html, you're now ready to create an HTML file using the HTML
        // returned from the `render` function. Now write it to a file named `team.html` in the
        // `output` folder. You can use the variable `outputPath` above target this location.
  
        // Hint: you may need to check if the `output` folder exists and create it if it
        // does not.
  
        fs.writeFile("./output/team.html", renderHTML, function (err) {
          if (err) throw err;
          console.log("Team added!");
        });
        server.close();
      }
    });
}

// Call the GitHub api to retrieve information from the Engineer's GitHub profile
async function getGitHubProfileInfo(user) {
  const { data } = await axios.get(`https://api.github.com/users/${user}`);

  const stringData = JSON.stringify(data, null, "  ");
}

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```
