/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import UploadAdapter from "@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import Highlight from "@ckeditor/ckeditor5-highlight/src/highlight";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";
import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import TableCaption from "@ckeditor/ckeditor5-table/src/tablecaption";
import PlainTableOutput from "@ckeditor/ckeditor5-table/src/plaintableoutput";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";
import CloudServices from "@ckeditor/ckeditor5-cloud-services/src/cloudservices";
import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock";
import TextPartLanguage from "@ckeditor/ckeditor5-language/src/textpartlanguage";
import SourceEditing from "@ckeditor/ckeditor5-source-editing/src/sourceediting";
import { InfoBlock, Bold, Border, Strong } from "./customPlugins";

export default class KnowitEditor extends ClassicEditorBase {}

// Plugins to include in the build.
KnowitEditor.builtinPlugins = [
  Essentials,
  UploadAdapter,
  Underline,
  Highlight,
  Autoformat,
  Bold,
  Strong,
  Italic,
  BlockQuote,
  CKFinder,
  CloudServices,
  EasyImage,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TableCaption,
  PlainTableOutput,
  TextTransformation,
  CodeBlock,
  TextPartLanguage,
  SourceEditing,
  InfoBlock,
  Border,
];

// Editor configuration.
KnowitEditor.defaultConfig = {
  toolbar: {
    items: [
      "textPartLanguage",
      "|",
      "heading",
      "|",
      "bold",
      "strong",
      "italic",
      "underline",
      "|",
      "highlight",
      "link",
      "numberedList",
      "bulletedList",
      "|",
      "outdent",
      "indent",
      "|",
      "uploadImage",
      "InfoBlock",
      "blockQuote",
      "border",
      "insertTable",
      "mediaEmbed",
      "undo",
      "redo",
      "codeBlock",
      "sourceEditing",
    ],
  },
  image: {
    toolbar: [
      "imageStyle:inline",
      "imageStyle:block",
      "imageStyle:side",
      "|",
      "toggleImageCaption",
      "imageTextAlternative",
    ],
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "toggleTableCaption",
    ],
  },
  language: {
    textPartLanguage: [{ title: "Engelska", languageCode: "en" }],
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "sv",
  },
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading2",
        view: "h2",
        title: "Rubrik 2",
        class: "ck-heading_heading1",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Rubrik 3",
        class: "ck-heading_heading2",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Rubrik 4",
        class: "ck-heading_heading3",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Rubrik 5",
        class: "ck-heading_heading4",
      },
    ],
  },
  codeBlock: {
    languages: [
      { language: "plaintext", label: "Plain text" }, // The default language.
      { language: "c", label: "C" },
      { language: "cs", label: "C#" },
      { language: "cpp", label: "C++" },
      { language: "css", label: "CSS" },
      { language: "diff", label: "Diff" },
      { language: "html", label: "HTML" },
      { language: "java", label: "Java" },
      { language: "javascript", label: "JavaScript" },
      { language: "json", label: "JSON" },
      { language: "php", label: "PHP" },
      { language: "python", label: "Python" },
      { language: "ruby", label: "Ruby" },
      { language: "typescript", label: "TypeScript" },
      { language: "xml", label: "XML" },
    ],
  },
};
