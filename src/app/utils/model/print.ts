export interface PrintRequest {
    items: PrintItems[];
    totalAmount: number;
    totalDiscount: number;
    posServiceFee: number;
    charge: number;
    netTotal: number;
    imgBase64?: string;
}

export interface PrintItems {
    productId?: number;
    productName: string;
    quantity: number;
    price: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
}


