import MediaEmbedEditing from './mediaembedediting';
/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module media-embed/mediaembedui
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
/**
 * The media embed UI plugin.
 */
export default class MediaEmbedUI extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires(): readonly [typeof MediaEmbedEditing];
    /**
     * @inheritDoc
     */
    static get pluginName(): "MediaEmbedUI";
    /**
     * @inheritDoc
     */
    init(): void;
    private _setUpDropdown;
}
