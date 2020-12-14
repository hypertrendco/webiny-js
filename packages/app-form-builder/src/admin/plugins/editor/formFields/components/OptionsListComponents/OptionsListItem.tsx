import React from "react";
import { Typography } from "@webiny/ui/Typography";
import { Tooltip } from "@webiny/ui/Tooltip";
import { css } from "emotion";
import { IconButton } from "@webiny/ui/Button";

import { Switch } from "@webiny/ui/Switch";
import { ReactComponent as EditIcon } from "@webiny/app-form-builder/admin/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "@webiny/app-form-builder/admin/icons/delete.svg";
import { ReactComponent as TranslateIcon } from "@webiny/app-form-builder/admin/icons/round-translate-24px.svg";
import { BindComponent } from "@webiny/form/Bind";

const optionsListItemLeft = css({
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    ">div": {
        display: "flex",
        flexDirection: "column",
        marginLeft: 10,
        color: "var(--mdc-theme-on-surface)",
        span: {
            lineHeight: "125%"
        }
    }
});

const optionsListItemRight = css({
    display: "flex",
    justifyContent: "right",
    alignItems: "center"
});

type DefaultValueSwitchProps = {
    multiple: boolean;
    option: any;
    value: any;
    onChange: any;
};

const DefaultValueSwitch = ({
    multiple,
    option,
    value: currentDefaultValue,
    onChange: setDefaultValue
}: DefaultValueSwitchProps) => {
    if (multiple) {
        const selected =
            Array.isArray(currentDefaultValue) && currentDefaultValue.includes(option.value);

        return (
            <Switch
                value={selected}
                onChange={() => {
                    if (selected) {
                        const value = Array.isArray(currentDefaultValue)
                            ? [...currentDefaultValue]
                            : [];

                        value.splice(value.indexOf(option.value), 1);
                        setDefaultValue(value);
                    } else {
                        const value = Array.isArray(currentDefaultValue)
                            ? [...currentDefaultValue]
                            : [];
                        value.push(option.value);
                        setDefaultValue(value);
                    }
                }}
            />
        );
    }

    const selected = currentDefaultValue === option.value;
    return (
        <Switch
            value={selected}
            onChange={() => {
                const newValue = selected ? "" : option.value;
                setDefaultValue(newValue);
            }}
        />
    );
};

type OptionsListItemProps = {
    multiple: boolean;
    dragHandle: React.ReactNode;
    Bind: BindComponent;
    option: { label: string; value: string };
    deleteOption: () => void;
    editOption: () => void;
};

export default function OptionsListItem(props: OptionsListItemProps) {
    const { option, multiple, dragHandle, Bind, deleteOption, editOption } = props;

    return (
        <>
            <div className={optionsListItemLeft}>
                <Tooltip placement={"bottom"} content={<span>Drag to rearrange the order</span>}>
                    <span>{dragHandle}</span>
                </Tooltip>
                <div>
                    <Typography use={"subtitle1"}>{option.label}</Typography>
                    <Typography use={"caption"}>{option.value}</Typography>
                </div>
            </div>
            <div className={optionsListItemRight}>
                <IconButton icon={<EditIcon />} onClick={editOption} />
                <IconButton icon={<DeleteIcon />} onClick={deleteOption} />

                <Bind name={"settings.defaultValue"}>
                    {({ onChange, value }) => (
                        <Tooltip placement={"bottom"} content={<span>Set as default value</span>}>
                            <DefaultValueSwitch
                                onChange={onChange}
                                value={value}
                                multiple={multiple}
                                option={option}
                            />
                        </Tooltip>
                    )}
                </Bind>
            </div>
        </>
    );
}
