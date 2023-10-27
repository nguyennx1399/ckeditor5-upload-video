/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module media-embed/mediaembedcommand
 */

import type { DocumentSelection, Element, Model, Selection, Position } from 'ckeditor5/src/engine';
import { Command } from 'ckeditor5/src/core';
import { findOptimalInsertionRange } from 'ckeditor5/src/widget';

import { getSelectedMediaModelWidget, insertMedia } from './utils';

import { FileRepository, FileLoader } from '@ckeditor/ckeditor5-upload';
import { Notification } from '@ckeditor/ckeditor5-ui';


/**
 * The insert media command.
 *
 * The command is registered by the {@link module:media-embed/mediaembedediting~MediaEmbedEditing} as `'mediaEmbed'`.
 *
 * To insert media at the current selection, execute the command and specify the URL:
 *
 * ```ts
 * editor.execute( 'mediaEmbed', 'http://url.to.the/media' );
 * ```
 */
export default class MediaEmbedCommand extends Command {
    /**
     * Media url.
     */
    declare public value: string | undefined;

    /**
     * @inheritDoc
     */
    public override refresh(): void {
        const model = this.editor.model;
        const selection = model.document.selection;
        const selectedMedia = getSelectedMediaModelWidget(selection);

        this.value = selectedMedia ? selectedMedia.getAttribute('url') as string : undefined;

        this.isEnabled = isMediaSelected(selection) || isAllowedInParent(selection, model);

    }

    /**
     * Executes the command, which either:
     *
     * * updates the URL of the selected media,
     * * inserts the new media into the editor and puts the selection around it.
     *
     * @fires execute
     * @param url The URL of the media.
     */
    public override execute(url: string): void {
        const model = this.editor.model;
        const selection = model.document.selection;
        const selectedMedia = getSelectedMediaModelWidget(selection);

        if (selectedMedia) {
            model.change(writer => {
                writer.setAttribute('url', url, selectedMedia);
            });
        } else {
            insertMedia(model, url, selection, true);
        }
    }

    public async executeUploadVideo(file: File) {
        const editor = this.editor;
        const fileRepository = editor.plugins.get(FileRepository);
        const loader = fileRepository.createLoader(file);
        // Do not throw when upload adapter is not set.FileRepository will log an error anyway.
        if (!loader) {
            return;
        }
        const { status } = loader
        if (status == 'idle') {
            const res = await this._readAndUpload(loader)
            return res
        }
    }

    protected async _readAndUpload(loader: FileLoader) {
        const editor = this.editor;
        const t = editor.locale.t;
        const fileRepository = editor.plugins.get(FileRepository);
        const notification = editor.plugins.get(Notification);


        return loader.read()
            .then(() => {
                const promise = loader.upload();
                return promise;
            })
            .then(data => {
                return data?.default
            })
            .catch(error => {
                // If status is not 'error' nor 'aborted' - throw error because it means that something else went wrong,
                // it might be generic error and it would be real pain to find what is going on.
                if (loader.status !== 'error' && loader.status !== 'aborted') {
                    throw error;
                }

                // Might be 'aborted'.
                if (loader.status == 'error' && error) {
                    notification.showWarning(error, {
                        title: t('Upload failed'),
                        namespace: 'upload'
                    });
                }

                clean();
            });

        function clean() {
            fileRepository.destroyLoader(loader);
        }
    }
}

/**
 * Checks if the media embed is allowed in the parent.
 */
function isAllowedInParent(selection: Selection | DocumentSelection, model: Model): boolean {
    const insertionRange = findOptimalInsertionRange(selection, model);
    let parent = insertionRange.start.parent as Element;

    // The model.insertContent() will remove empty parent (unless it is a $root or a limit).
    if (parent.isEmpty && !model.schema.isLimit(parent)) {
        parent = parent.parent as Element;
    }

    return model.schema.checkChild(parent, 'media');
}

/**
 * Checks if the media object is selected.
 */
function isMediaSelected(selection: Selection | DocumentSelection): boolean {
    const element = selection.getSelectedElement();
    return !!element && element.name === 'media';
}