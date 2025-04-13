import {Role} from "@shared/roles.ts";

const featureMatrix: Record<string, Role[]> = {
    manageProducts: [Role.ADMIN],
};

export function hasFeature(
    role: Role | undefined,
    feature: keyof typeof featureMatrix
): boolean {
    return !!role && featureMatrix[feature].includes(role);
}
