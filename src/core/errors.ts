export class PendingApprovalError extends Error {
    name: string = "PendingApprovalError"
    constructor() {
        super("requires approval for this change");
    }

}


export class DuplicatePendingApprovalError extends Error {
    name: string = "DuplicatePendingApprovalError"
    constructor() {
        super("duplicate pending approval for this change");
    }
}