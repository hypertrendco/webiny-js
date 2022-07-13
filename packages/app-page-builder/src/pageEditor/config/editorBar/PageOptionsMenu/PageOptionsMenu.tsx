import React from "react";
import { css } from "emotion";
import { Compose, HigherOrderComponent } from "@webiny/app-admin";
import { Menu } from "@webiny/ui/Menu";
import { IconButton } from "@webiny/ui/Button";
import { ReactComponent as MoreVerticalIcon } from "~/admin/assets/more_vert.svg";
import { EditorBar } from "~/editor";
import { PreviewPageButton } from "./PreviewPageButton";
import { SetAsHomepageButton } from "./SetAsHomepageButton";

const menuStyles = css({
    ".disabled": {
        opacity: 0.5,
        pointerEvents: "none"
    }
});

const PageOptionsMenu: React.FC = () => {
    return (
        <Menu
            data-testid="pb-editor-page-options-menu"
            className={menuStyles}
            handle={<IconButton icon={<MoreVerticalIcon />} />}
        >
            <PreviewPageButton />
            <SetAsHomepageButton />
        </Menu>
    );
};

const AddPageOptionsMenu: HigherOrderComponent = RightSection => {
    return function AddRevisionSelector(props) {
        return (
            <RightSection>
                <PageOptionsMenu />
                {props.children}
            </RightSection>
        );
    };
};

export const PageOptionsMenuPlugin = () => {
    return <Compose component={EditorBar.RightSection} with={AddPageOptionsMenu} />;
};