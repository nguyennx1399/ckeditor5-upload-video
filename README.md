# CKEditor 5 editor with Vue3


## Installation

```bash

```
<template>
  <ckeditor
    v-model="editorData"
    :editor="editor"
    :config="editorConfig"
    @input="contentChange"
  ></ckeditor>
</template>

<script setup>
import Editor from '@nadalnguyen/ckeditor5-upload-video'
import { ref } from 'vue'
import UploadAdapter from './imageUpload'
import { reactive } from 'vue'

const emits = defineEmits(['input'])
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

const editor = reactive(Editor)
const editorData = ref(props.content)
const editorConfig = reactive({
  mediaEmbed: {
    elementName: 'video',
    previewsInData: true,
    extraProviders: [
      {
        name: 'NadalProvider',
        url: [/(.*?)/],
        html: (match) => {
          const src = match.input
          return (
            '<div style="position: relative; padding-bottom: 100%; height: 0; pointer-events: auto;">' +
            '<video controls style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" src="' +
            src +
            '">' +
            '</video>' +
            '</div>'
          )
        },
      },
    ],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  extraPlugins: [MyCustomUploadAdapterPlugin],
})

function MyCustomUploadAdapterPlugin(editor) {
  const myeditor = editor

  // eslint-disable-next-line no-underscore-dangle
  myeditor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new UploadAdapter(loader, myeditor.config._config.type)
  }
}

const contentChange = (text) => {
  emits('input', text)
}
</script>

```
