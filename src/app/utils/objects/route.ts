import { PrintRequest } from "../model/print";

export class AppRoutes {
    static readonly DEVAGO = "devago";
    static readonly PAK_MEDICAL = "pak_medical";
}


export interface PrintOutRouteState {
    type: keyof AppRoutes;
    printObject: PrintRequest;

}