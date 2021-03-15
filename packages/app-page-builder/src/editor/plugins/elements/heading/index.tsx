import React from "react";
import kebabCase from "lodash/kebabCase";
import {
    DisplayMode,
    PbEditorPageElementPlugin,
    PbEditorElementPluginArgs
} from "../../../../types";
import { createInitialPerDeviceSettingValue } from "../../elementSettings/elementSettingsUtils";
import Heading, { headingClassName } from "./Heading";
import { createInitialTextValue } from "../utils/textUtils";

export default (args: PbEditorElementPluginArgs = {}): PbEditorPageElementPlugin => {
    const defaultText = "Heading";

    const defaultSettings = [
        [
            "pb-editor-page-element-style-settings-text",
            { useCustomTag: true, tags: ["h1", "h2", "h3", "h4", "h5", "h6"] }
        ],
        "pb-editor-page-element-style-settings-background",
        "pb-editor-page-element-style-settings-border",
        "pb-editor-page-element-style-settings-shadow",
        "pb-editor-page-element-style-settings-padding",
        "pb-editor-page-element-style-settings-margin",
        "pb-editor-page-element-settings-clone",
        "pb-editor-page-element-settings-delete"
    ];

    const elementType = kebabCase(args.elementType || "heading");

    const defaultToolbar = {
        title: "Heading",
        group: "pb-editor-element-group-basic",
        preview() {
            return <h2 className={headingClassName}>{defaultText}</h2>;
        }
    };

    return {
        name: `pb-editor-page-element-${elementType}`,
        type: "pb-editor-page-element",
        elementType: elementType,
        toolbar: typeof args.toolbar === "function" ? args.toolbar(defaultToolbar) : defaultToolbar,
        settings:
            typeof args.settings === "function" ? args.settings(defaultSettings) : defaultSettings,
        target: ["cell", "block"],
        create({ content = {}, ...options }) {
            const previewText = content.text || defaultText;

            const defaultValue = {
                type: this.elementType,
                elements: [],
                data: {
                    text: {
                        ...createInitialPerDeviceSettingValue(
                            createInitialTextValue({
                                type: this.elementType,
                                tag: "h1"
                            }),
                            DisplayMode.DESKTOP
                        ),
                        data: {
                            text: previewText
                        }
                    },
                    settings: {
                        margin: createInitialPerDeviceSettingValue(
                            { all: "0px" },
                            DisplayMode.DESKTOP
                        ),
                        padding: createInitialPerDeviceSettingValue(
                            { all: "0px" },
                            DisplayMode.DESKTOP
                        ),
                        horizontalAlign: createInitialPerDeviceSettingValue(
                            "center",
                            DisplayMode.DESKTOP
                        )
                    }
                },
                ...options
            };

            return typeof args.create === "function" ? args.create(defaultValue) : defaultValue;
        },
        render({ element }) {
            return <Heading elementId={element.id} />;
        }
    };
};
