/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Model, NativeError, Query } from "mongoose";
import { NeedsModeration } from "../interfaces/needsModeration";
import { User } from "../interfaces/user";
import { logit } from "./logit";
import { resolveUser, hasChanges } from "./utils";


export const handleSave = async (newObject: Document): Promise<void> => {
    const user: User = resolveUser(newObject as NeedsModeration);
    if (newObject.isNew) {
        await logit(newObject._id, (newObject.constructor as Model<Document>).collection.name, "create", {}, newObject.toJSON(), user);
        return;
    }

    const oldObject = await (newObject.constructor as Model<Document>).findOne({
        _id: newObject._id
    });
    if (oldObject) {
        if (hasChanges(newObject, oldObject)) {
            await logit(newObject._id, (newObject.constructor as Model<Document>).collection.name, "update", oldObject.toJSON(), newObject.toJSON(), user);
        }
    } else {
        throw new Error("can't find old object") as NativeError;
    }
};

export const handleUpdate = async (query: Query<any, any>): Promise<void> => {
    const updated = query.getUpdate();
    await query.find(query.getQuery())
        .cursor()
        .eachAsync((async (doc: Document) => {
            const newObject: NeedsModeration = doc.set(updated) as NeedsModeration;
            newObject.__user = (updated as NeedsModeration).__user;
            await handleSave(newObject);
        }));
};