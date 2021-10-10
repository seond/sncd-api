'use strict';

/**
 * This set of utility functions collects allowed subjects/actions in the vertical hierarchy of a requested object
 * to determine if the user has a permission to perform an action to the object. 
 */

import { Permissioned, Access } from '../model/entity/permissioned/base';

export const isAllowedToUser = (userId: string, access: Access, targetObject: Permissioned) => {
    if (targetObject.permission.accessItems) {
        const accessItems = targetObject.permission.accessItems;
        for (let i = 0; i < accessItems.length; i++) {
            if (accessItems[i].subjectId === userId && accessItems[i].access >= access) {
                return true;
            }
        }
    }

    if (targetObject.permission.inheritParents && targetObject.parent) {
        return isAllowedToUser(userId, access, targetObject.parent);
    }

    return false;
};
