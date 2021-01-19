import { User } from "../interfaces/user";
import { Action, Revision } from "../model/revision";
import { DuplicatePendingApprovalError } from "./errors";
import { checkIfExists } from "./utils";


export const logit = function (entityId: string, entityName: string, action: Action, oldModel: Object, newModel: Object, user: User): Promise<boolean> {
    return new Promise(async (resolve, reject) => {

        if (!user) {
            reject(
                new Error("User not specified")
            );
            return;
        }

        var exists = await checkIfExists(entityId, entityName, action, newModel);
        if (exists) {
            reject(
                new DuplicatePendingApprovalError()
            )
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