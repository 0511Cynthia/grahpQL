import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ClientQueryResolver, ClientMutationResolver } from "./resolvers/ClientResolver";
import { EmployeeQueryResolver, EmployeeMutationResolver } from "./resolvers/EmployeeResolver";
import 'dotenv/config';

const typeDefs = `
    type Client {
        id: ID
        name: String
        lastName: String
        age: Int
        cellPhone: String
    }

    type Employee {
        id: ID
        name: String
        lastName: String
        job: String
        cellPhone: String
        password: String 
    }

    type ClientDebt {
        id: ID
        dateDebt: String
        debt: Int
    }

    type Query {
        getClients: [Client],
        getClientByID(id: ID): Client
        getEmployees: [Employee]
        getEmployeesByJob(job: String): [Employee]
        getClientsDebtByDate(date: String): [ClientDebt]
        getClientsPagination(page: Int, limit: Int): [Client]
        getEmployeesPagination(page: Int, limit: Int): [Employee]
    }

    type Mutation {
        login(cellPhone: String, password: String): String
        createClient(name: String, lastName: String, age: Int, cellPhone: String): Client
        createEmployee(name: String, lastName: String, job: String, cellPhone: String, password: String): Employee
        updateCellphone(id: ID, cellPhone: String): Employee
        clientGetDebt(id: ID, dateDebt: String, debt: Int): ClientDebt
        clientPayDebt(id: ID): String
    }
`

const resolvers = {
    Query: {
        ...ClientQueryResolver,
        ...EmployeeQueryResolver
    },
    Mutation: {
        ...ClientMutationResolver,
        ...EmployeeMutationResolver
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const port = process.env.PORT ? Number.parseInt(process.env.PORT):3000;

(async() => {
    const {url} = await startStandaloneServer(server, {
        context: async({req}) => {
            const {headers} = req
            return { headers }
        },
        listen: {port: port}
    })

    console.log('Server running in port: '+ url);
})();