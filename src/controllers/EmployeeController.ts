import db from '../database';
import { createJWT, verifyJWT } from '../services/JWTService';
import { hashPassword, validatePassword } from '../services/EncryptPasswordService';
import { createID } from '../services/CreateIDService';
import { sendMessage } from '../services/MessageService';
import { getEmployee } from '../models/Employee';

//Queries
const getEmployees = async (__:void, args: any, context: any) => {
    try {
      const token = context.headers.authorization
      const error = verifyJWT(token)
      if(error)
      throw error
        const [employees] = await db.execute("SELECT * FROM gym.employees");
        return employees;
    } catch (e: any) {
        console.log(e);
        return e
    }
};

const getEmployeesByJob = async (__:void, args: any, context: any) => {
  
    try {
      const token = context.headers.authorization
      const error = verifyJWT(token)
      if(error)
      throw error
        const job = args.job;
        const [employees] = await db.execute("SELECT * FROM gym.employees WHERE job = ?", [job]);
        return employees;
    } catch (e: any) {
        console.log(e);
        return e
    }
};

const getEmployeesPagination = async (__:void, args: any, context: any ) => {
    try {
      const token = context.headers.authorization
      const error = verifyJWT(token)
      if(error)
      throw error
      
      const {page, limit} = args
         
      const [employees] = page && limit ? 
      await db.execute(`SELECT * FROM gym.employees limit ${limit} offset ${page-1} `)
      :
      await db.execute("SELECT * FROM gym.employees");
    
      return employees
      
    } catch (e: any) {
      console.log(e);
      return e;
    }
};
//Mutaciones
const login = async (__:void, args: any) => {
    try{  
      const {cellPhone, password} = args
      
      const employee = await getEmployee(cellPhone);
  
      if(employee && await validatePassword(password,employee.password)){
        return createJWT(cellPhone, password);
      } 
      
      return 'usuario o contrasena incorrecto'
  
    } catch (e: any){
      console.log(e)
      return e
    }
}

const createEmployee = async(__:void, args: any) => {
    try {
        const pass = args.password;
        const encryptPass = await hashPassword(pass);
        const idEmployee = createID();
        
        const employee = {
            id: idEmployee,
            name: args.name,
            lastName: args.lastName,
            job: args.job,
            cellPhone: args.cellPhone,
            password: encryptPass
        }
        const result = await db.execute("INSERT INTO gym.employees (id,name,lastName,job,cellPhone,password) VALUES (?,?,?,?,?,?)",
            [employee.id, employee.name, employee.lastName, employee.job, employee.cellPhone, employee.password]);
        console.log(result);
        const notice = "Nuevo empleado registrado";
        sendMessage(notice);
        return employee;
    } catch (e: any) {
        console.log(e)
        return e
    }
}

const updateCellphone = async(__:void, args: any, context: any) =>{
    try {
      const token = context.headers.authorization
      const error = verifyJWT(token)
      if(error)
      throw error
      const {id, cellPhone} = args;
      const employee = {
        id: id,
        cellPhone: cellPhone
      }
      const result = await db.query("UPDATE gym.employees SET cellPhone = ? WHERE id = ?",
        [cellPhone, id]);
      console.log(result);
      return employee;
    }  catch (e: any) {
      console.log(e)
      return e
    }
};

export default {
    login,
    getEmployees,
    getEmployeesByJob,
    getEmployeesPagination,
    createEmployee,
    updateCellphone
}