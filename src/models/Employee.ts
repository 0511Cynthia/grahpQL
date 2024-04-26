import db from '../database';

export default interface Employee {
    id: string,
    name: string,
    lastName: string,
    job: string,
    cellPhone: string,
    password: string
}

export async function getEmployee(cellPhone: string): Promise< Employee | null> {

    try{
        const [Employee]:any = await db.execute("SELECT * FROM gym.employees where cellPhone = ?", [cellPhone])
    
        return Employee[0] 
        
    } catch (e:any) {
        console.log(e)
        return null
    }
}