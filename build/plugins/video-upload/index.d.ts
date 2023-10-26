/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module media-embed/mediaembed
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget } from '@ckeditor/ckeditor5-widget';
import MediaEmbedEditing from './mediaembedediting';
import AutoMediaEmbed from '@ckeditor/ckeditor5-media-embed/src/automediaembed';
import MediaEmbedUI from './MediaEmbedUI';
import '../../mediaembed.css';
export default class MediaEmbed extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires(): readonly [typeof MediaEmbedEditing, typeof MediaEmbedUI, typeof AutoMediaEmbed, typeof Widget];
    /**
     * @inheritDoc
     */
    static get pluginName(): "MediaEmbed";
}
