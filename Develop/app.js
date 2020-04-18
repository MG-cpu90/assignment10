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
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const axios = require("axios");

const employeesArray = [];

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  // console.log(`Server running at http://${hostname}:${port}/`);
});

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)


inquirer.prompt([
    {
    type: "confirm",
    message: "Are you the team manager?",
    name: "confirmManager",
    default: true
    },
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
      type: "list",
      message: "What is your employee's role in the company?",
      choices: ['Engineer', 'Intern'],
      name: "role"
    }
  ])
  .then(function(response) {

    const managerInfo = new Manager(
       response.name, 
       response.id,
       response.email, 
       response.officeNumber,
    )

    employeesArray.push(managerInfo);
    console.log(employeesArray);

    if (response.role === 'Engineer') {

      inquirer.prompt([
        {
          type: "input",
          message: "What is your Engineer's full name?",
          name: "name"
        },
        {
          type: "input",
          message: "What is your Engineer's email?",
          name: "email"
        },
        {
          type: "input",
          message: "What is your Engineer's id?",
          name: "id"
        },
        {
        type: "input",
        message: "What is your Engineer's GitHub username?",
        name: "github"
        }
      ])
      .then(answers => {
        // call getGitHubProfileInfo function
          // console.log(JSON.stringify(answers, null, '  '));
          getGitHubProfileInfo(answers.github);

          const engineerInfo = new Engineer(
          answers.name, 
          answers.id,
          answers.email, 
          answers.github
        )
          employeesArray.push(engineerInfo);
          console.log(employeesArray);
          render(employeesArray);

        });

    }
    else {

      inquirer.prompt([
        {
          type: "input",
          message: "What is your Intern's name?",
          name: "name"
        },
        {
          type: "input",
          message: "What is your Intern's email?",
          name: "email"
        },
        {
          type: "input",
          message: "What is Intern's id?",
          name: "id"
        },
        {
        type: "input",
        message: "What university is your Intern currently attending?",
        name: "school"
        }
      ])
      .then(answers => {

        const internInfo = new Intern(
           answers.name, 
           answers.id,
           answers.email, 
           answers.school
        )
        
        employeesArray.push(internInfo);
        console.log(employeesArray);
        render(employeesArray);

        });
    } 
    server.close();

  })

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.

    // Hint: you may need to check if the `output` folder exists and create it if it
    // does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```

async function getGitHubProfileInfo(user) {

  const { data } = await axios.get(
    `https://api.github.com/users/${user}`
  );

  // console.log(data);

  const stringData = JSON.stringify(data, null, '  ');

  // console.log(stringData);

}


// // Rough
// const addEmployee = [
//   {
//     type: "confirm",
//     message: "Do you want to add a new employee to your team?",
//     name: "addEmployee",
//     default: true
//   }
// ];

// const generalQuestions = [
//   {
//     type: "input",
//     message: "What is your full name?",
//     name: "name"
//   },
//   {
//     type: "input",
//     message: "What is your user email?",
//     name: "email"
//   },
//   {
//     type: "input",
//     message: "What is your id?",
//     name: "id"
//   },
//   {
//     type: "list",
//     message: "What is your role in the company?",
//     choices: ['Engineer', 'Intern', 'Manager'],
//     name: "role"
//   }
// ];

// const engineerQuestion = [
// {
//   type: "input",
//   message: "What is your GitHub username?",
//   name: "github"
//   }
// ];

// const internQuestion = [
//   {
//     type: "input",
//     message: "What university are you currently attending?",
//     name: "school"
//     }
//   ];

// const managerQuestion = [
//   {
//     type: "input",
//     message: "What is your office number?",
//     name: "officeNumber"
//     }
//   ];

// // let question = "1";
// // While (question !== "done") {
// //   If (question == "1") {
// //     Let answer = await inquirer(addEmployee);
// //     question = (answer == 'yay') ? "2" : "1";
// //   } else if (question == "2") {
// //     Let answer = await inquirer(generalQuestions);
// //     If (answer == 'barks') { 
// //       question = "done";
// //     } else if (answer == 'dog') {
// //       question = "1";
// //     } else {
// //       question = "2";
// //     }
// //   }
// // }



// inquirer.prompt(questions).then(answers => {
//   // call getGitHubProfileInfo function
//     console.log(JSON.stringify(answers, null, '  '));
//     getGitHubProfileInfo(answers.github, answers.email, answers.repo, answers.projectTitle);

//   });

// inquirer.prompt()

//       if (response.addEmployee) {

//     }

//     else {

//       server.close();

//     }

// async function generateHTML(userName, userPosition, userID, userEmail, userInfo){

//   fs.writeFile("./output/team.html", response, function (err) {
//     if (err) return console.log(err);    
//   });

// server.close();

// }

//   const result = `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
//       <title>My Team</title>
//   </head>
//   <body>
//       <div class="container">
//           <div class="row">
//               <div class="col-sm">
//                   <div class="jumbotron jumbotron-fluid text-white bg-danger text-center">
//                       <div class="container">
//                       <h1 class="display-4">My Team</h1>
//                       </div>
//                   </div>
//               </div>
//           </div>
//           <div class="row">
//               <div class="col-sm">
//                   <div class="card border-secondary" style="width: 18rem;">
//                       <div class="card-body text-white bg-primary">
//                         <h4 class="card-title">${answers.name}</a></h4>
//                         <h5 class="card-text">${answers.employee}</h5>
//                       </div>
//                       <div class="container bg-light">
//                           <div class="card-body">
//                               <ul class="list-group list-group-flush">
//                                 <li class="list-group-item">ID:${answers.id}</li>
//                                 <li class="list-group-item"><a href="mailto:${answers.email}" target="_blank">${answers.email}</a></li>
//                                 <li class="list-group-item">Employee info:${response.school}</li>
//                               </ul>
//                           </div>
//                       </div>
//                   </div>
//               </div>
//           </div>
//       </div>
//   <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
//   <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
//   <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
//   </body>
//   </html>

//   `;

// // e-mail link to populate card
// <a href="mailto:${answers.email}" target="_blank">${answers.email}</a>

// // GitHub link to populate card
// <a href="${stringData}" target="_blank">${answers.github}</a>