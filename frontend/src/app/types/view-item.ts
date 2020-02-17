import { Identifiers } from '.';

export interface ViewItem {
    id: string;
    picture: string;
    mainContent: string;
    secondaryContent: string;
    ro_diasabled?: boolean;
}
