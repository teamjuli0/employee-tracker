const inquirer = require('inquirer')
const connection = require('./connection')
const { questions, helpers } = require('./helpers')
const {
  viewCategory,
  addEmployee,
  addRole,
  addDepartment,
  updateRole,
  updateManager,
} = helpers

const init = async () => {
  const { action } = await inquirer.prompt(questions('init'))
  switch (action) {
    case 'View All Employees': {
      viewCategory('employee', (err, res) => console.table(res))
      init()
      break
    }
    case 'View All Departments': {
      viewCategory('department', (err, res) => console.table(res))
      init()
      break
    }
    case 'View All Roles': {
      viewCategory('role', (err, res) => console.table(res))
      init()
      break
    }
    case 'Add an Employee': {
      addEmployee(init)
      break
    }
    case 'Add a New Department': {
      addDepartment()
      init()
      break
    }
    case 'Add a New Role': {
      addRole(init)
    }
    case 'Update Employee Role': {
      updateRole(init)
    }
    case 'Update Employee Manager': {
      updateManager(init)
    }
  }
}

connection.connect((err) => {
  if (err) throw err
  init()
})
