export interface PrintRequest {
    date: Date;
    items: PrintItems[];
    totalAmount: string;
    totalDiscount: string;
    posServiceFee: string;
    charge: string;
    netTotal: string;
}

export interface PrintItems {
    productId?: number;
    productName: string;
    quantity: string;
    price: string;
    gstRate: string;
    gstAmount: string;
    totalAmount: string;
}


