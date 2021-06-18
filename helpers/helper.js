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
  viewCategory('employee', async (err, res) => {
    if (err) throw err
    console.table(res)

    const employee = await inquirer.prompt(
      questions(
        'updateRole',
        null,
        res.map((obj) => obj.id)
      )[0]
    )

    viewCategory('role', async (err, res) => {
      if (err) throw err
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
  viewCategory('employee', async (err, res) => {
    if (err) throw err
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

const viewByDepartment = (init) => {
  viewCategory('department', async (err, res) => {
    if (err) throw err
    console.table(res)

    const { department } = await inquirer.prompt(
      questions(
        'viewByDepartment',
        null,
        null,
        res.map((obj) => obj.id)
      )
    )

    connection.query(
      'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS Name, role.title, department.name AS Department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.id = ?',
      [department],
      (err, res) => {
        if (err) throw err
        console.table(res)
      }
    )

    init()
  })
}

const viewByManager = (init) => {
  viewCategory('employee', async (err, res) => {
    const managers = res.filter((obj) => obj.manager_id === null)
    console.table(managers)

    const { manager_id } = await inquirer.prompt(
      questions(
        'viewByManager',
        null,
        managers.map((obj) => obj.id)
      )
    )

    console.log(manager_id)
    connection.query(
      'SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name, role.title, role.salary, department.name AS department FROM ((employee LEFT JOIN role ON role.id = employee.role_id) LEFT JOIN department ON department.id = role.department_id) WHERE employee.manager_id = ?',
      [manager_id],
      (err, res) => {
        if (err) throw err
        console.table(res)
      }
    )

    init()
  })
}

const deleteEmployee = (init) => {
  viewCategory('employee', async (err, res) => {
    if (err) throw err
    console.table(res)

    const { id } = await inquirer.prompt(
      questions(
        'deleteEmployee',
        null,
        res.map((obj) => obj.id)
      )
    )

    connection.query(
      'UPDATE employee SET manager_id = null WHERE manager_id = ?',
      [id],
      (err, res) => {
        if (err) throw err

        connection.query(
          'DELETE FROM employee WHERE employee.id = ?',
          [id],
          (err, res) => {
            if (err) throw err
          }
        )
      }
    )

    init()
  })
}

const deleteRole = (init) => {
  viewCategory('role', async (err, res) => {
    if (err) throw err
    console.table(res)

    const { id } = await inquirer.prompt(
      questions(
        'deleteRow',
        res.map((obj) => obj.id)
      )
    )

    connection.query('DELETE FROM role WHERE role.id = ?', [id], (err, res) => {
      if (err) throw err
    })

    init()
  })
}

const deleteDepartment = (init) => {
  viewCategory('department', async (err, res) => {
    if (err) throw err
    console.table(res)

    const { id } = await inquirer.prompt(
      questions(
        'deleteDepartment',
        null,
        null,
        res.map((obj) => obj.id)
      )
    )

    console.log(id)
    connection.query(
      'DELETE FROM department WHERE department.id = ?',
      [id],
      (err, res) => {
        if (err) throw err
      }
    )

    init()
  })
}

const utilizedBudget = (init) => {
  viewCategory('department', async (err, res) => {
    if (err) throw err
    console.table(res)

    const { id } = await inquirer.prompt(
      questions(
        'utilizedBudget',
        null,
        null,
        res.map((obj) => obj.id)
      )
    )

    connection.query(
      'SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name, role.salary, department.name AS department FROM role LEFT JOIN employee ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id WHERE department.id = ?',
      [id],
      (err, res) => {
        if (err) throw err

        let totalBudget = 0

        res.forEach((employee) => (totalBudget += JSON.parse(employee.salary)))

        console.table([{ 'Total Utilized Budget': totalBudget }])
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
  viewByDepartment,
  viewByManager,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
  utilizedBudget,
}
