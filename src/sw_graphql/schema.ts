import { gql } from 'apollo-server-express';
const typeDefs = gql`
    type Query{
        MachineList: [Machine]! 
        Machine (id: Int!): Machine
        EventMsg: MessageInfo
        MachineFilter (filter:MachineF ): [Machine]! 
        WorkerToken(machineQRScan: String!, 
            userQRScan: String!): WorkerToken 
    }
 
   
    type WorkerToken {
        Noket: String
        error: [ErrorMsg]
    } 
    type ErrorMsg {
        message: String
    }
    type Machine {
        machineID: Int!
        machineName: String!
        machineModel: String!
        switchbotID: Int!
        switchbotName: String!
        switchbotMac: String!
        raspiID: Int!
        raspiName: String!
        raspiServer: String!
        RaspiList: [RaspiList]
    } 

    type RaspiList {
        raspiID: Int!
        raspiName: String!
        raspiServer: String!
    }
    type WorkerInfo {
        ID: Int!,
        FullName: String!,
        AccLvl: Int!,
        UserQR: String!,
        GIDFUll: String!
    }

    type MessageInfo {
        messages: [EMessages],
        error: [ErrorMsg]
    }
    type EMessages {
        eventMSGID: Int
        eventMSG: String
    } 
    input MachineF{
        machineID: Int
    }
`;

export default typeDefs