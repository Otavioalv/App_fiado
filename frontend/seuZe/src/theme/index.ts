import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { padding } from "./padding";
import { gap } from "./gap";

export const theme = {
    colors,
    typography,
    spacing,
    radius,
    padding,
    gap
} as const;

export type AppTheme = typeof theme;
