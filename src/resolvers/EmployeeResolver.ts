import EmployeeController from "../controllers/EmployeeController"

export const EmployeeQueryResolver = {
    getEmployees: EmployeeController.getEmployees,
    getEmployeesByJob: EmployeeController.getEmployeesByJob,
    getEmployeesPagination: EmployeeController.getEmployeesPagination
}

export const EmployeeMutationResolver = {
    login: EmployeeController.login,
    createEmployee: EmployeeController.createEmployee,
    updateCellphone: EmployeeController.updateCellphone
}