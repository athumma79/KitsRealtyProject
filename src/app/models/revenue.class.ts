import { Contractor } from "./contractor.class";
import { ExpenseStatus } from "./expense-status.class";
import { Property } from "./property.class";

export class Revenue {
    revenueId: number
    property: Property
    contractor: Contractor
    expenseStatus: ExpenseStatus
    revenueAmount: number
    revenueType: string
    expenseDueDate: Date
    amountPaid: number
    revenueDescription: string
    dateIncurred: Date
}