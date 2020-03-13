/**
 * Build styles
 */
require('./index.css').toString();


/**
 * CodeTool for Editor.js
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 * @version 2.0.0
 */

class CodeTool {
  /**
   * Allow to press Enter inside the CodeTool textarea
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * @typedef {Object} CodeData — plugin saved data
   * @param {String} code - previously saved plugin code
   */

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {CodeData} data — previously saved plugin code
   * @param {Object} config - user config for Tool
   * @param {Object} api - Editor.js API
   */
  constructor({data, config, api}) {
    this.api = api;

    this.placeholder = config.placeholder || CodeTool.DEFAULT_PLACEHOLDER;

    this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: 'ce-code',
      textarea: 'ce-code__textarea'
    };

    this.nodes = {
      holder: null,
      textarea: null
    };

    this.data = {
      code: data.code || ''
    };

    this.nodes.holder = this.drawView();
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let wrapper = document.createElement('div'),
      textarea = document.createElement('textarea');

    wrapper.classList.add(this.CSS.baseClass, this.CSS.wrapper);
    textarea.classList.add(this.CSS.textarea, this.CSS.input);
    textarea.textContent = this.data.code;

    textarea.placeholder = this.placeholder;

    wrapper.appendChild(textarea);

    this.nodes.textarea = textarea;

    return wrapper;
  }


  /**
   * Return Tool's view
   * @returns {HTMLDivElement} this.nodes.holder - Code's wrapper
   * @public
   */
  render() {
    return this.nodes.holder;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} codeWrapper - CodeTool's wrapper, containing textarea with code
   * @returns {CodeData} - saved plugin code
   * @public
   */
  save(codeWrapper) {
    return {
      code: codeWrapper.querySelector('textarea').value
    };
  }

  /**
   * onPaste callback fired from Editor`s core
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event) {
    const content = event.detail.data;
    this.data = {
      code: content.textContent
    };
  }

  /**
   * Returns Tool`s data from private property
   * @return {*}
   */
  get data() {
    return this._data;
  }

  /**
   * Set Tool`s data to private property and update view
   * @param {CodeData} data
   */
  set data(data) {
    this._data = data;

    if (this.nodes.textarea) {
      this.nodes.textarea.textContent = data.code;
    }
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: '<svg  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  width="19" height="19"><path d="M896 128H128c-35.2 0-64 28.8-64 64v640c0 35.2 28.8 64 64 64h768c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64z m32 704c0 19.2-12.8 32-32 32H128c-19.2 0-32-12.8-32-32V320h832v512z m0-544H96v-96c0-19.2 12.8-32 32-32h768c19.2 0 32 12.8 32 32v96z" ></path><path d="M416 224m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" ></path><path d="M288 224m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" ></path><path d="M160 224m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"></path><path d="M446.784 757.28l99.568-370.832 30.896 8.288-99.568 370.848zM405.04 711.776L269.248 576l135.776-135.76-22.656-22.64L224 576l158.4 158.4zM618.96 711.776l22.672 22.624L800 576l-158.4-158.4-22.64 22.608L754.752 576z" ></path></svg>',
      title: '代码'
    };
  }

  /**
   * Default placeholder for CodeTool's textarea
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_PLACEHOLDER() {
    return 'Enter code';
  }

  /**
   *  Used by Editor.js paste handling API.
   *  Provides configuration to handle CODE tag.
   *
   * @static
   * @return {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ['pre'],
    };
  }
}

module.exports = CodeTool;
