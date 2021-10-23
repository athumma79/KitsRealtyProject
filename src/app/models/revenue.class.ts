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

    constructor() {
        this.revenueId = null;
        this.property = new Property();
        this.contractor = new Contractor();
        this.expenseStatus = new ExpenseStatus();
        this.revenueAmount = null;
        this.revenueType = null;
        this.expenseDueDate = null;
        this.amountPaid = null;
        this.revenueDescription = null;
        this.dateIncurred = null;
    }
}