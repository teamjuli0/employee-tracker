const inquirer = require('inquirer')
const connection = require('../connection')
const questions = require('./questions.js')

const viewCategory = (category, cb) =>
  connection.query(`SELECT * FROM ${category}`, cb)

const addEmployee = (init) => {
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

const addRole = (init) => {
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

const updateRole = (init) => {
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

const updateManager = (init) => {
  viewCategory('employee', async (req, res) => {
    console.table(res)

    const employeeInfo = await inquirer.prompt(
      questions(
        'updateManager',
        null,
        res.map((obj) => obj.id)
      )
    )

    employeeInfo.manager_id === employeeInfo.id
      ? (employeeInfo.manager_id = null)
      : null

    connection.query(
      'UPDATE employee SET manager_id = ? WHERE id = ?',
      [employeeInfo.manager_id, employeeInfo.id],
      (err, res) => {
        if (err) throw err
      }
    )
    init()
  })
}

module.exports = {
  viewCategory,
  addEmployee,
  addDepartment,
  addRole,
  updateRole,
  updateManager,
}
