export default class ColorUI extends Plugin {
    command: string;
    init(): void;
    iframe: Element | null | undefined;
    createColorBtn(): void;
    colorBtn: ButtonView | undefined;
    doCommand(color: any): void;
    createView(): void;
    view: View<HTMLElement> | undefined;
    getSelectionPosition(): {
        top: any;
        left: any;
        height: any;
        width: any;
        bottom: any;
        right: any;
    };
    getSelection(): any;
}
import { Plugin } from "@ckeditor/ckeditor5-core";
import { ButtonView } from "@ckeditor/ckeditor5-ui";
import { View } from "@ckeditor/ckeditor5-ui";
