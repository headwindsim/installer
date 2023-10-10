import React, { FC } from "react";
import { Box } from "react-bootstrap-icons";
import { Addon, AddonDependency, Publisher } from "renderer/utils/InstallerConfiguration";
import {is} from "immer/dist/utils/common";

export interface DependencyDialogBodyProps {
    addon: Addon,
    dependency: AddonDependency,
    dependencyAddon: string,
    dependencyPublisher: string,
}

export const DependencyDialogBody: FC<DependencyDialogBodyProps> = ({ addon, dependency, dependencyAddon, dependencyPublisher }) => (
    <>
        <p>
            <b>{dependencyAddon}</b>
            {' '}
            by
            {' '}
            <b>{dependencyPublisher}</b>
            {' '}
            is {dependency.optional ? 'recommend' : 'required' } to be installed to use the full functionality of
            {' '}
            <b>{addon.name}</b>
            .
        </p>

        <div className="flex items-center gap-x-7 bg-navy px-7 py-6 rounded-md my-6">
            <Box size={36} />

            <div className="flex flex-col gap-y-2">
                <span className="text-3xl font-medium">{dependencyPublisher}</span>
                <span className="text-4xl font-semibold">{dependencyAddon}</span>
            </div>
        </div>

        <p>{dependency.modalText}</p>
    </>
);
