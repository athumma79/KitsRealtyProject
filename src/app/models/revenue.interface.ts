import { Contractor } from "./contractor.interface";
import { ExpenseStatus } from "./expense-status.interface";
import { Property } from "./property.interface";

export interface Revenue {
    property: Property,
    contractor: Contractor,
    expenseStatus: ExpenseStatus,
    revenueAmount: number,
    revenueType: string,
    expenseDueDate: Date,
    amountPaid: number,
    revenueDescription: string,
    folderPath: string,
    dateIncurred: Date
}