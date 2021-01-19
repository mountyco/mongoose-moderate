import { Document } from "mongoose";
export interface NeedsModeration extends Document {
    __user: unknown;
}
