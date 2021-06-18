const inquirer = require('inquirer')
const mysql = require('mysql')
const questions = require('./questions.js')
require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
})

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
      addEmployee()
      break
    }
    case 'Add a New Department': {
      addDepartment()
      init()
      break
    }
    case 'Add a New Role': {
      addRole()
    }
    case 'Update Employee Role': {
      updateRole()
    }
  }
}

const viewCategory = (category, cb) =>
  connection.query(`SELECT * FROM ${category}`, cb)

const addEmployee = () => {
  viewCategory('role', async (err, res) => {
    console.table(res)

    const employeeQuestions = questions(
      'addEmployee',
      res.map((obj) => obj.id)
    )[0]

    const resEmployee = await inquirer.prompt(employeeQuestions)

    viewCategory('employee', async (err, res) => {
      const managerIdPrompt = questions('addEmployee', null, [
        ...res.map((obj) => obj.id),
        'null',
      ])[1]

      console.table(res)

      const resManager = await inquirer.prompt(managerIdPrompt)

      const newEmployee = { ...resEmployee, ...resManager }

      newEmployee.manager_id = JSON.parse(newEmployee.manager_id)

      connection.query('INSERT INTO employee SET ?', newEmployee, (err) => {
        if (err) throw err
      })
      init()
    })
  })
}

const addDepartment = async () => {
  const department = await inquirer.prompt(questions('addDepartment'))
  connection.query(
    `INSERT INTO department SET ?`,
    { ...department },
    (err, res) => {
      if (err) throw err
    }
  )
}

const addRole = () => {
  viewCategory('department', async (err, res) => {
    console.table(res)

    const roleQuestions = questions(
      'addRole',
      null,
      null,
      res.map((obj) => obj.id)
    )

    const departmentObj = await inquirer.prompt(roleQuestions)

    connection.query('INSERT INTO role SET ?', departmentObj, (err) => {
      if (err) throw err
    })

    init()
  })
}

const updateRole = () => {
  viewCategory('employee', async (req, res) => {
    console.table(res)

    const employee = await inquirer.prompt(
      questions(
        'updateRole',
        null,
        res.map((obj) => obj.id)
      )[0]
    )

    viewCategory('role', async (req, res) => {
      const role = await inquirer.prompt(
        questions(
          'updateRole',
          res.map((obj) => obj.id)
        )[1]
      )

      // console.log({ ...employee, ...role })
      console.log(employee)
      console.log(role)
      connection.query(
        `UPDATE employee SET role_id = ? WHERE id = ?`,
        [role.role_id, employee.id],
        (err, res) => {
          if (err) throw err
        }
      )
      init()
    })
  })
}

connection.connect((err) => {
  if (err) throw err
  init()
})
