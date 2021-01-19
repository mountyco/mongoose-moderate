import { Document } from "mongoose";
import { NeedsModeration } from "../interfaces/needsModeration";
import { User } from "../interfaces/user";
import { diff } from "deep-diff";
import { Action, Revision } from "../model/revision";


const resolveUser = (newObject: NeedsModeration): User => {
    const user = (newObject).__user;
    if (!user) {
        throw new Error("unable to get user information");
    }
    delete newObject.__user;
    return user;
};

const hasChanges = (newObject: Document, oldObject: Document): boolean => {

    const _a = newObject.toJSON();
    const _b = oldObject.toJSON();

    const changes = (diff(_a, _b));
    if (changes && changes.length) {
        return true;
    }
    return false;
};


const checkIfExists = async (entityId: string, entityName: string, action: Action, newModel: Object): Promise<boolean> => {

    var exists = await Revision.findOne({
        entityId: entityId,
        entityName: entityName,
        action: action
    }).sort({ 'createdAt': -1 });

    if (exists) {
        var old_update = exists.toJSON().new as any;
        sanitize(old_update);
        var new_update = JSON.parse(JSON.stringify(newModel)) as any;
        sanitize(new_update);

        var changes = diff(old_update, new_update);
        if (!changes) {
            return true;
        }
    }

    return false;
}

function sanitize(obj) {
    delete obj.__v;
    delete obj._id;
    delete obj.createdAt;
    delete obj.deletedAt;
    delete obj.updatedAt;

    for (let i in obj) {
        if (typeof i == "object") {
            sanitize(obj);
        }
    }
}

export { resolveUser, hasChanges, checkIfExists };