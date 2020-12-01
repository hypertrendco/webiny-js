import React, { ReactElement } from "react";
import { Cell, Grid } from "@webiny/ui/Grid";
import { Typography } from "@webiny/ui/Typography";

type WrapperPropsType = {
    label: string;
    containerClassName?: string;
    leftCellSpan?: number;
    rightCellSpan?: number;
    children: ReactElement;
};

const Wrapper = ({
    label,
    containerClassName,
    leftCellSpan = 4,
    rightCellSpan = 8,
    children
}: WrapperPropsType) => {
    return (
        <Grid className={containerClassName}>
            <Cell span={leftCellSpan}>
                <Typography use={"subtitle2"}>{label}</Typography>
            </Cell>
            <Cell span={rightCellSpan}>{children}</Cell>
        </Grid>
    );
};

export default React.memo(Wrapper);
