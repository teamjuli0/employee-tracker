module.exports = (data, roleIds, employeeIds, departmentIds) => {
  switch (data) {
    case 'init': {
      return [
        {
          name: 'action',
          message: 'What would you like to do?',
          type: 'list',
          choices: [
            'View All Employees',
            'View All Departments',
            'View All Roles',
            'Add an Employee',
            'Add a New Department',
            'Add a New Role',
            'Update Employee Role',
            'Update Employee Manager',
            'Exit',
          ],
        },
      ]
    }
    case 'addEmployee': {
      return [
        [
          {
            name: 'first_name',
            message: "What is the new employee's first name?",
            type: 'input',
          },
          {
            name: 'last_name',
            message: "What is the new employee's last name?",
            type: 'input',
          },
          {
            name: 'role_id',
            message: 'What is the role id for this employee? (See Chart Above)',
            type: 'list',
            choices: roleIds,
          },
        ],
        {
          name: 'manager_id',
          message: "What is the new employee's manager id? (See Chart Above)",
          type: 'list',
          choices: employeeIds,
        },
      ]
    }
    case 'addDepartment': {
      return [
        {
          name: 'name',
          message: "What is the new department's name?",
          type: 'input',
        },
      ]
    }
    case 'addRole': {
      return [
        {
          name: 'title',
          message: 'What is the name of the role?',
          type: 'input',
        },
        {
          name: 'salary',
          message: 'What is the salary for this role? (Do Not Use Commas)',
          type: 'input',
        },
        {
          name: 'department_id',
          message:
            'What is the id for the department of this role? (See Chart Above)',
          type: 'list',
          choices: departmentIds,
        },
      ]
    }
    case 'updateRole': {
      return [
        [
          {
            name: 'id',
            message:
              'What is the employee id of the employee whos role we will be updating?',
            type: 'list',
            choices: employeeIds,
          },
        ],
        [
          {
            name: 'role_id',
            message:
              'What is the role id we will be updating this employee to?',
            type: 'list',
            choices: roleIds,
          },
        ],
      ]
    }
    case 'updateManager': {
      return [
        {
          name: 'id',
          message:
            "What employee's manager would you like to update? (See Chart Above)",
          type: 'list',
          choices: employeeIds,
        },
        {
          name: 'manager_id',
          message: 'What is the id of the new manager? (See Chart Above)',
          type: 'list',
          choices: employeeIds,
        },
      ]
    }
  }
}
