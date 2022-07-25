import { gql } from 'apollo-server-express';
const typeDefs = gql`
    type Query{
        SwitchBot (filter: SwitchbotFilter): [SwitchBot]
        MachineList: [MachineList]
        MachineViewList: [MachineList]
        Machine (id: Int!): Machine
        EventMsg: MessageInfo
        RaspiList: [RaspiList]
        WorkerList: [WorkerInfo]
        WorkerViewList: [WorkerInfo]
        AccountType: [AccountType]
        AccountInfo: [WorkerInfoUser]
        EventMsgList: [EMessages]
        TerminalList: [Terminal]
        TerminalEvents (filter: TerminalMsgIDFilter): [TerminalEvents]
    }
 
    type Mutation {
        createEventLogs(input: EventParam!): String 
        WorkerToken(machineQRScan: String!, 
            userQRScan: String!): WorkerToken
        createSwitchBot(input: SwitchbotParam!): String
        deleteSwitchBot(input: SwitchbotDeleteParam!): String   
        updateSwitchBot(input: SwitchbotUpdateParam!): String
        updateRaspi(input: RaspiUpdateParam!): String
        createRaspi(input: RaspiCreateParam!): String 
        deleteRaspi(input: RaspiDeleteParam!): String
        createMachine(input: MachineCreateParam!): String
        createTabletEvent(input: [TabletEventsParam!]): String
        updateMachine(input: MachineUpdateParam!): String
        deleteMachine(input: MachineDeleteParam!): String
        createAccount(input: CreateAccount!): String
        updateAccount(input: UpdateAccount!): String
        updatePass(input: UpdatePass!): String
        accessInfo(input: LoginParam): AccessInfo
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
    type MachineList {
        machineID: Int!
        machineName: String!
        machineModel: String!
        machineSwitchbotID: Int
        machineQR: String!
    }
    type SwitchBot {
        switchbotID: Int!
        switchbotName: String!
        switchbotMac: String!
        switchbotRaspiID: Int
        RaspiList: [RaspiList]
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
        ID: Int!
        FullName: String!
        AccLvl: Int!
        UserQR: String!
        GIDFull: String!
    }

    type WorkerInfoUser{
        ID: Int!
        FullName: String!
        AccLvl: Int! 
        GIDFull: String!
    }
    type MessageInfo {
        messages: [EMessages]
    }
    type EMessages {
        eventMSGID: Int
        eventMSG: String
    }
    
    type AccessInfo {
        UserInfo: WorkerInfoUser
        Noket: String 
    } 
    type AccountType {
        acclvlID: Int
        accType: String
    }
    type Terminal {
        terminalID: Int,
        terminalName: String
    }
    
    type TerminalEvents {
        termID: Int,
        termMsgID: Int,
        termEventMsg: String
    }
 
    input CreateAccount { 
        FullName: String!,
        AccLvl: Int!, 
        GIDFull: String!,
        Pass: String!
    }
    input TerminalMsgIDFilter{
        termID: Int!
    }
    input UpdateAccount {
        ID: Int!,
        FullName: String!,
        AccLvl: Int!
    } 
    input LoginParam {
        GIDFull: String!,
        Pass: String!
    }
    input UpdatePass {
        ID: Int!
        Pass: String!
    }
    input SwitchbotFilter{
        switchbotID: Int
        switchbotRaspiIDisNull: Boolean
    }
    input MachineF{
        machineID: Int
    }
    input EventParam {
        msgID: Int!
    }
    input TabletEventsParam {
        eventMSGID: Int!
        terminalID: Int!
    }
    input SwitchbotParam {
        switchbotName: String!
        switchbotMac: String!
    }

    input SwitchbotDeleteParam{ 
        switchbotID: Int!
    }

    input RaspiDeleteParam {
        raspiID: Int!
    }
    input RaspiCreateParam {
        raspiName: String!
        raspiServer: String!  
    }
    input RaspiUpdateParam {
        raspiID: Int!
        raspiName: String!
        raspiServer: String!
    }
    input SwitchbotUpdateParam{
        switchbotID: Int!
        switchbotName: String!
        switchbotMac: String!
        switchbotRaspiID: Int
    }

    input MachineCreateParam {
        machineName: String!
        machineModel: String!
    }

    input MachineUpdateParam {
        machineID: Int!
        machineName: String!
        machineModel: String!
        machineSwitchbotID: Int
    }

    input MachineDeleteParam{ 
        machineID: Int!
    }
`;

export default typeDefs