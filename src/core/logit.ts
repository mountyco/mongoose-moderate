import { User } from "../interfaces/user";
import { Action, Revision } from "../model/revision";

export const logit = function (entityId: string, entityName: string, action: Action, oldModel: Object, newModel: Object, user: User): Promise<boolean> {
    return new Promise(async (resolve, reject) => {

        if (!user) {
            reject(
                new Error("User not specified")
            );
            return;
        }

        await Revision.create({
            entityId: entityId,
            entityName: entityName,
            action: action,
            old: oldModel,
            new: newModel,
            user: user,
        })


        resolve(true);
    });
};