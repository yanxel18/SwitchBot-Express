import { gql } from 'apollo-server-express';
const typeDefs = gql`
    type Query{
        Switchbot: [SwitchBot]
        MachineList: [Machine]! 
        Machine (id: Int!): Machine
        EventMsg: MessageInfo
        MachineFilter (filter:MachineF ): [Machine]! 
        
    }
 
    type Mutation {
        createEventLogs(input: EventParam!): String 
        WorkerToken(machineQRScan: String!, 
            userQRScan: String!): WorkerToken,
        createSwitchBot(input: SwitchbotParam!): String     
    }
    type WorkerToken {
        Noket: String
        ScanInfo: ScanInfo 
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

    type SwitchBot {
        switchbotID: Int!
        switchbotName: String!
        switchbotMac: String!
    }
    type ScanInfo {
        machineID: Int!
        machineName: String!
        machineModel: String!
        switchbotID: Int!
        switchbotName: String!
        switchbotMac: String!
        raspiID: Int!
        raspiName: String!
        raspiServer: String! 
        UInfo: [WorkerInfo]
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
        GIDFull: String!
    }

    type MessageInfo {
        messages: [EMessages]
    }
    type EMessages {
        eventMSGID: Int
        eventMSG: String
    } 
    
    input MachineF{
        machineID: Int
    }
    input EventParam {
        msgID: Int!
    }

    input SwitchbotParam {
        switchbotName: String!
        switchbotMac: String!
    }
`;

export default typeDefs