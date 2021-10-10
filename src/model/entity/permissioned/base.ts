'use strict';

import { Column, ValueTransformer } from 'typeorm';

export enum Access {
    Read = 1,
    Write
}

type AccessItem = {
    subjectType: string;
    subjectId: string;
    access: Access;
};

type Permission = {
    inheritParents?: boolean;
    accessItems?: AccessItem[];
};

class PermissionTransformer implements ValueTransformer {
    to(value: Permission): string {
        return JSON.stringify(value);
    }

    from(value: string): Permission {
        return JSON.parse(value);
    }
}

export class Permissioned {
    @Column({ type: String, transformer: new PermissionTransformer(), nullable: true })
    permission: Permission;

    parent: Permissioned;
}
