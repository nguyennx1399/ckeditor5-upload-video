import MediaEmbedEditing from './mediaembedediting';

/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module media-embed/mediaembedui
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { createDropdown, CssTransitionDisablerMixin, ButtonView, type DropdownView } from '@ckeditor/ckeditor5-ui';

import MediaFormView from './ui/mediaformview';
import type { LocaleTranslate } from '@ckeditor/ckeditor5-utils';
import type MediaRegistry from './mediaregistry';
import mediaIcon from './media.svg';
/**
 * The media embed UI plugin.
 */
export default class MediaEmbedUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get requires() {
		return [MediaEmbedEditing] as const;
	}

	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'MediaEmbedUI' as const;
	}

	/**
	 * @inheritDoc
	 */
	public init(): void {
		const editor = this.editor;
		const command: any = editor.commands.get('mediaEmbed')!;
		// has upload 
		editor.ui.componentFactory.add('mediaEmbed', locale => {
			const dropdown = createDropdown(locale);

			this._setUpDropdown(dropdown, command);

			return dropdown;
		});
	}

	private _setUpDropdown(dropdown: DropdownView, command: any): void {
		const editor = this.editor;
		const t = editor.t;
		const button = dropdown.buttonView;
		const registry = editor.plugins.get(MediaEmbedEditing).registry;

		dropdown.once('change:isOpen', () => {
			const form = new (CssTransitionDisablerMixin(MediaFormView))(getFormValidators(editor.t, registry), editor.locale);
			dropdown.panelView.children.add(form);

			// Note: Use the low priority to make sure the following listener starts working after the
			// default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
			// invisible form/input cannot be focused/selected.
			button.on('open', () => {
				form.disableCssTransitions();

				// Make sure that each time the panel shows up, the URL field remains in sync with the value of
				// the command. If the user typed in the input, then canceled (`urlInputView#fieldView#value` stays
				// unaltered) and re-opened it without changing the value of the media command (e.g. because they
				// didn't change the selection), they would see the old value instead of the actual value of the
				// command.
				form.url = command.value || '';
				form.urlInputView.fieldView.select();
				form.enableCssTransitions();

			}, { priority: 'low' });

			// Execute the command when the form.uploadButtonView is clicked.
			form.uploadButtonView.on('execute', () => {
				// choose local file
				const input = document.createElement('input');
				input.type = 'file';
				input.accept = 'video/*';
				input.onchange = async e => {
					const file = (e.target as HTMLInputElement).files![0];
					const url = await command.executeUploadVideo(file);
					editor.execute('mediaEmbed', url);
					editor.editing.view.focus();
				};
				input.click();
			});

			dropdown.on('submit', () => {
				if (form.isValid()) {
					editor.execute('mediaEmbed', form.url);
					editor.editing.view.focus();
				}
			});

			dropdown.on('change:isOpen', () => form.resetFormStatus());
			dropdown.on('cancel', () => {
				editor.editing.view.focus();
			});

			dropdown.on('upload', () => {

			});

			form.delegate('submit', 'cancel').to(dropdown);
			form.urlInputView.fieldView.bind('value').to(command, 'value');

			// Form elements should be read-only when corresponding commands are disabled.
			form.urlInputView.bind('isEnabled').to(command, 'isEnabled');
		});

		dropdown.bind('isEnabled').to(command);

		button.set({
			label: t('Insert media'),
			icon: mediaIcon,
			tooltip: true
		});
	}
}

function getFormValidators(t: LocaleTranslate, registry: MediaRegistry): Array<(v: MediaFormView) => string | undefined> {
	return [
		form => {
			if (!form.url.length) {
				return t('The URL must not be empty.');
			}
		},
		form => {
			if (!registry.hasMedia(form.url)) {
				return t('This media URL is not supported.');
			}
		}
	];
}