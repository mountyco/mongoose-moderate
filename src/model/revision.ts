import { Schema, Document, Model, model, createConnection } from "mongoose";
import { User } from "../interfaces/user";
export type Action = "update" | "create";
export const RevisionSchema: Schema = new Schema({
    entityName: { type: String, required: true },
    entityId: { type: String, required: true },
    action: { type: String, required: true },
    old: { type: {}, required: true },
    new: { type: {}, required: true },
    user: { type: {}, required: true },
    approver: { type: {}, required: false },
    decliner: { type: {}, required: false },
}, { timestamps: true });

export interface InterfaceRevision extends Document {
    entityName: string;
    action: Action;
    entityId: string;
    old: unknown;
    new: unknown;
    user: User;
    approver: User;
    decliner: User;
}

let Revision: Model<InterfaceRevision>;
if (!process.env.MONGOOSE_MODERATE_CONNECTION_URL) {
    Revision = model("Revision", RevisionSchema as unknown as Schema<InterfaceRevision>);
} else {
    Revision = createConnection(process.env.MONGOOSE_MODERATE_CONNECTION_URL).
        model<InterfaceRevision>("Revision", RevisionSchema as unknown as Schema<InterfaceRevision>);
}

export { Revision };