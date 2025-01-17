import { Context, ITaskConfig } from "~/types";
import { ITaskTriggerTransport, TaskTriggerTransportPlugin } from "~/plugins";
import { WebinyError } from "@webiny/error";

export interface ICreateTransport {
    context: Context;
    config: ITaskConfig;
}

export const createTransport = (params: ICreateTransport): ITaskTriggerTransport => {
    const plugins = params.context.plugins.byType<TaskTriggerTransportPlugin>(
        TaskTriggerTransportPlugin.type
    );
    const [plugin] = plugins;
    if (!plugin) {
        throw new WebinyError("Missing TaskTriggerTransportPlugin.", "PLUGIN_ERROR", {
            type: TaskTriggerTransportPlugin.type
        });
    }

    const getTenant = (): string => {
        return params.context.tenancy.getCurrentTenant().id;
    };
    const getLocale = (): string => {
        return params.context.cms.getLocale().code;
    };

    return plugin.createTransport({
        context: params.context,
        config: params.config,
        getTenant,
        getLocale
    });
};
