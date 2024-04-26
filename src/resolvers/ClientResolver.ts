import ClientController from "../controllers/ClientController";

export const ClientQueryResolver = {
    getClients: ClientController.getClients,
    getClientByID: ClientController.getClientByID,
    getClientsDebtByDate: ClientController.getClientsDebtByDate,
    getClientsPagination: ClientController.getClientsPagination
}

export const ClientMutationResolver = {
    createClient: ClientController.createClient,
    clientGetDebt: ClientController.clientGetDebt,
    clientPayDebt: ClientController.clientPayDebt
}