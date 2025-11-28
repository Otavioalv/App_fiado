import { cliEventNamesinterface } from "../interfaces/socketIOInterfaces";

export const cliEventNames:cliEventNamesinterface = {
    newMessage: "new-message",
    newCharge: "new_charge"
} as const;