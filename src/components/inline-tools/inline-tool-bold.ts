import $ from '../dom';
import {InlineTool, SanitizerConfig} from '../../../types';

/**
 * Bold Tool
 *
 * Inline Toolbar Tool
 *
 * Makes selected text bolder
 */
export default class BoldInlineTool implements InlineTool {

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  public static title: string = '加粗';

  /**
   * Sanitizer Rule
   * Leave <b> tags
   * @return {object}
   */
  static get sanitize(): SanitizerConfig {
    return {
      b: {},
    } as SanitizerConfig;
  }

  /**
   * Native Document's command that uses for Bold
   */
  private readonly commandName: string = 'bold';

  /**
   * Styles
   */
  private readonly CSS = {
    button: 'sk-inline-tool',
    buttonActive: 'sk-inline-tool--active',
    buttonModifier: 'sk-inline-tool--bold',
  };

  /**
   * Elements
   */
  private nodes: { button: HTMLButtonElement } = {
    button: undefined,
  };

  /**
   * Create button for Inline Toolbar
   */
  public render(): HTMLElement {
    this.nodes.button = document.createElement('button') as HTMLButtonElement;
    this.nodes.button.type = 'button';
    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
    this.nodes.button.appendChild($.svg('bold', 18, 18));
    return this.nodes.button;
  }

  /**
   * Wrap range with <b> tag
   * @param {Range} range
   */
  public surround(range: Range): void {
    document.execCommand(this.commandName);
  }

  /**
   * Check selection and set activated state to button if there are <b> tag
   * @param {Selection} selection
   */
  public checkState(selection: Selection): boolean {
    const isActive = document.queryCommandState(this.commandName);

    this.nodes.button.classList.toggle(this.CSS.buttonActive, isActive);
    return isActive;
  }

  /**
   * Set a shortcut
   */
  public get shortcut(): string {
    return 'CTRL+B';
  }
}
