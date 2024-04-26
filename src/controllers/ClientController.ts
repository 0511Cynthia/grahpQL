import db from '../database';
import { verifyJWT } from '../services/JWTService';
import { createID } from '../services/CreateIDService';
import { sendMessage } from '../services/MessageService';

//Queries
const getClients = async (__:void, args: any, context: any) => {
    try {
      const token = context.headers.authorization
      const error = verifyJWT(token)
      if(error)
      throw error
      const [clients] = await db.execute("SELECT * FROM gym.clients");
      return clients;
    } catch (e: any) {
      console.log(e);
      return e
    }
};

const getClientByID = async (__: void, args: any, context: any) => {
    try {
      const token = context.headers.authorization
      const error = verifyJWT(token)
      if(error)
      throw error
        const { id } = args;
        const [clients] = await db.execute("SELECT * from gym.clients where id = ?", [
          id,
        ]);
  
        return Array.isArray(clients) ? clients[0] : null;
    } catch (e: any) {
      console.log(e);
      return e
    }
};

const getClientsDebtByDate = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization
    const error = verifyJWT(token)
    if(error)
    throw error
      const dateDebt = args.date;
      
      const [clientsDebt] = await db.execute("SELECT * from gym.clientsdebt where dateDebt = ?", [
        dateDebt
      ]);

      return clientsDebt;
  } catch (e: any) {
    console.log(e);
    return e
  }
};

const getClientsPagination = async (__:void, args: any, context: any ) => {
  try {
    const token = context.headers.authorization
    const error = verifyJWT(token)
    if(error)
    throw error
    
    const {page, limit} = args
       
    const [clients] = page && limit ? 
    await db.execute(`SELECT * FROM gym.clients limit ${limit} offset ${page-1} `)
    :
    await db.execute("SELECT * FROM gym.clients");
  
    return clients
    
  } catch (e: any) {
    console.log(e);
    return e;
  }
};

//Mutaciones
const createClient = async(__:void, args: any, context: any) => {
    try {
      const token = context.headers.authorization
      const error = verifyJWT(token)
      if(error)
      throw error
      const idClient = createID();
      
      const client = {
        id: idClient,
        name: args.name,
        lastName: args.lastName,
        age: args.age,
        cellPhone: args.cellPhone
      }
      const result = await db.query("INSERT INTO gym.clients (id,name,lastName,age,cellPhone) VALUES (?,?,?,?,?)",
        [client.id, client.name, client.lastName, client.age, client.cellPhone]);
      console.log(result);
      const notice = "Nuevo cliente registrado";
      sendMessage(notice);
      return client;
    } catch (e: any) {
      console.log(e)
      return e
    }
}

const clientGetDebt = async(__:void, args:any, context: any) =>{
  try {
    const token = context.headers.authorization
    const error = verifyJWT(token)
    if(error)
    throw error
    const {id, dateDebt, debt} = args;
    
    const clientDebt = {
      id,
      dateDebt,
      debt
    }
    const result = await db.query("INSERT INTO gym.clientsdebt (id,dateDebt,debt) VALUES (?,?,?)",
      [id, dateDebt, debt]);

      console.log(result);
    return clientDebt;
  } catch (e: any) {
    console.log(e)
    return e
  }
}

const clientPayDebt = async(__:void, args:any, context: any) =>{
  try {
    const token = context.headers.authorization
    const error = verifyJWT(token)
    if(error)
    throw error
    const {id} = args;
    
    const clientDebt = {
      id
    }
    const result = await db.query("DELETE FROM gym.clientsdebt WHERE id = ?",
      [id]);

      console.log(result);
      if (result) {
        return "El cliente pago su deuda";
      }else{
        return "Fallo al pagar la deuda";
      }
    
  } catch (e: any) {
    console.log(e)
    return e
  }
}

export default {
    getClients,
    getClientByID,
    getClientsDebtByDate,
    getClientsPagination,
    createClient,
    clientGetDebt,
    clientPayDebt
}