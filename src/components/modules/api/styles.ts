import Module from '../../__module';
import {Styles} from '../../../../types/api';

/**
 *
 */
export default class StylesAPI extends Module {
  get classes(): Styles {
    return {
      /**
       * Base Block styles
       */
      block: 'cdx-block',

      /**
       * Inline Tools styles
       */
      inlineToolButton: 'sk-inline-tool',
      inlineToolButtonActive: 'sk-inline-tool--active',

      /**
       * UI elements
       */
      input: 'cdx-input',
      loader: 'cdx-loader',
      button: 'cdx-button',

      /**
       * Settings styles
       */
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active',
    };
  }
}
