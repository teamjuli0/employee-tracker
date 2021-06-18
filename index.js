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
  viewByDepartment,
  viewByManager,
  deleteEmployee,
  deleteRole,
  deleteDepartment,
  utilizedBudget,
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
      break
    }
    case 'Update Employee Role': {
      updateRole(init)
      break
    }
    case 'Update Employee Manager': {
      updateManager(init)
      break
    }
    case 'View Employees by Department': {
      viewByDepartment(init)
      break
    }
    case 'View Employees by Manager': {
      viewByManager(init)
      break
    }
    case 'Delete Employee': {
      deleteEmployee(init)
      break
    }
    case 'Delete Role': {
      deleteRole(init)
      break
    }
    case 'Delete Department': {
      deleteDepartment(init)
      break
    }
    case "View Department's Total Utilized Budget": {
      utilizedBudget(init)
      break
    }
  }
}

connection.connect((err) => {
  if (err) throw err
  init()
})
