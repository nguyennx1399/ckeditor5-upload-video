


// import { Plugin } from '@ckeditor/ckeditor5-core';
// import { createDropdown, CssTransitionDisablerMixin, type DropdownView } from '@ckeditor/ckeditor5-ui';


// /**
//  * The media embed UI plugin.
//  */
// export default class Test extends Plugin {
//     /**
//      * @inheritDoc
//      */
//     public static get requires() {
//         return [] as const;
//     }

//     /**
//      * @inheritDoc
//      */
//     public static get pluginName() {
//         return 'MediaEmbedUI' as const;
//     }

//     /**
//      * @inheritDoc
//      */
//     public init(): void {
//         const editor = this.editor;
//         const command: MediaEmbedCommand = editor.commands.get('mediaEmbed')!;

//         editor.ui.componentFactory.add('mediaEmbed', locale => {
//             const dropdown = createDropdown(locale);

//             this._setUpDropdown(dropdown, command);

//             return dropdown;
//         });
//     }

//     private _setUpDropdown(dropdown: DropdownView, command: MediaEmbedCommand): void {
//         const editor = this.editor;
//         const t = editor.t;
//         const button = dropdown.buttonView;
//         const registry = editor.plugins.get(MediaEmbedEditing).registry;
//         console.log('open dropdown');

//         dropdown.once('change:isOpen', () => {
//             const form = new (CssTransitionDisablerMixin(MediaFormView))(getFormValidators(editor.t, registry), editor.locale);

//             dropdown.panelView.children.add(form);

//             // Note: Use the low priority to make sure the following listener starts working after the
//             // default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
//             // invisible form/input cannot be focused/selected.
//             button.on('open', () => {
//                 form.disableCssTransitions();

//                 // Make sure that each time the panel shows up, the URL field remains in sync with the value of
//                 // the command. If the user typed in the input, then canceled (`urlInputView#fieldView#value` stays
//                 // unaltered) and re-opened it without changing the value of the media command (e.g. because they
//                 // didn't change the selection), they would see the old value instead of the actual value of the
//                 // command.
//                 form.url = command.value || '';
//                 form.urlInputView.fieldView.select();
//                 form.enableCssTransitions();
//             }, { priority: 'low' });

//             dropdown.on('submit', () => {
//                 if (form.isValid()) {
//                     editor.execute('mediaEmbed', form.url);
//                     editor.editing.view.focus();
//                 }
//             });

//             dropdown.on('change:isOpen', () => form.resetFormStatus());
//             dropdown.on('cancel', () => {
//                 editor.editing.view.focus();
//             });

//             form.delegate('submit', 'cancel').to(dropdown);
//             form.urlInputView.fieldView.bind('value').to(command, 'value');

//             // Form elements should be read-only when corresponding commands are disabled.
//             form.urlInputView.bind('isEnabled').to(command, 'isEnabled');
//         });

//         dropdown.bind('isEnabled').to(command);

//         button.set({
//             label: t('Insert media'),
//             icon: 'a',
//             tooltip: true
//         });
//     }
// }

