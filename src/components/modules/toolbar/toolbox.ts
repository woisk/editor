import Module from '../../__module';
import $ from '../../dom';
import * as _ from '../../utils';
import {BlockToolConstructable} from '../../../../types';
import Flipper from '../../flipper';
import {BlockToolAPI} from '../../block';

/**
 * @class Toolbox
 * @classdesc Holder for Tools
 *
 * @typedef {Toolbox} Toolbox
 * @property {Boolean} opened - opening state
 * @property {Object} nodes   - Toolbox nodes
 * @property {Object} CSS     - CSS class names
 *
 */
export default class Toolbox extends Module {

  /**
   * CSS styles
   * @return {{toolbox: string, toolboxButton string, toolboxButtonActive: string,
   * toolboxOpened: string, tooltip: string, tooltipShown: string, tooltipShortcut: string}}
   */
  get CSS() {
    return {
      toolbox: 'sk-toolbox',
      toolboxButton: 'sk-toolbox__button',
      toolboxButtonActive: 'sk-toolbox__button--active',
      toolboxOpened: 'sk-toolbox--opened',
      openedToolbarHolderModifier: 'codex-editor--toolbox-opened',

      buttonTooltip: 'sk-toolbox-button-tooltip',
      buttonShortcut: 'sk-toolbox-button-tooltip__shortcut',
    };
  }

  /**
   * Returns True if Toolbox is Empty and nothing to show
   * @return {boolean}
   */
  public get isEmpty(): boolean {
    return this.displayedToolsCount === 0;
  }

  /**
   * Opening state
   * @type {boolean}
   */
  public opened: boolean = false;

  /**
   * HTMLElements used for Toolbox UI
   */
  public nodes: {
    toolbox: HTMLElement,
    buttons: HTMLElement[],
  } = {
    toolbox: null,
    buttons: [],
  };

  /**
   * How many tools displayed in Toolbox
   * @type {number}
   */
  private displayedToolsCount: number = 0;

  /**
   * Instance of class that responses for leafing buttons by arrows/tab
   * @type {Flipper|null}
   */
  private flipper: Flipper = null;

  /**
   * Makes the Toolbox
   */
  public make(): void {
    this.nodes.toolbox = $.make('div', this.CSS.toolbox);
    // $.append(this.Editor.Toolbar.nodes.content, this.nodes.toolbox);
    $.append(this.Editor.UI.nodes.holder, this.nodes.toolbox);

    this.addTools();
    this.enableFlipper();
  }

  /**
   * Toolbox Tool's button click handler
   *
   * @param {MouseEvent|KeyboardEvent} event
   * @param {string} toolName
   */
  public toolButtonActivate(event: MouseEvent | KeyboardEvent, toolName: string): void {
    const tool = this.Editor.Tools.toolsClasses[toolName] as BlockToolConstructable;

    this.insertNewBlock(tool, toolName);
  }

  /**
   * Open Toolbox with Tools
   */
  public open(): void {
    if (this.isEmpty) {
      return;
    }

    this.Editor.UI.nodes.wrapper.classList.add(this.CSS.openedToolbarHolderModifier);
    this.nodes.toolbox.classList.add(this.CSS.toolboxOpened);

    this.opened = true;
    this.flipper.activate();
  }

  /**
   * Close Toolbox
   */
  public close(): void {
    this.nodes.toolbox.classList.remove(this.CSS.toolboxOpened);
    this.Editor.UI.nodes.wrapper.classList.remove(this.CSS.openedToolbarHolderModifier);

    this.opened = false;
    this.flipper.deactivate();
  }

  /**
   * Close Toolbox
   */
  public toggle(): void {
    if (!this.opened) {
      this.open();
    } else {
      this.close();
    }
  }

  /**
   * Iterates available tools and appends them to the Toolbox
   */
  private addTools(): void {
    const tools = this.Editor.Tools.available;

    for (const toolName in tools) {
      if (tools.hasOwnProperty(toolName)) {
        this.addTool(toolName, tools[toolName] as BlockToolConstructable);
      }
    }
  }

  /**
   * Append Tool to the Toolbox
   *
   * @param {string} toolName - tool name
   * @param {BlockToolConstructable} tool - tool class
   */
  private addTool(toolName: string, tool: BlockToolConstructable): void {
    const internalSettings = this.Editor.Tools.INTERNAL_SETTINGS;
    const userSettings = this.Editor.Tools.USER_SETTINGS;

    const toolToolboxSettings = tool[internalSettings.TOOLBOX];

    /**
     * Skip tools that don't pass 'toolbox' property
     */
    if (_.isEmpty(toolToolboxSettings)) {
      return;
    }

    if (toolToolboxSettings && !toolToolboxSettings.icon) {
      _.log('Toolbar icon is missed. Tool %o skipped', 'warn', toolName);
      return;
    }

    /**
     * @todo Add checkup for the render method
     */
    // if (typeof tool.render !== 'function') {
    //   _.log('render method missed. Tool %o skipped', 'warn', tool);
    //   return;
    // }

    /**
     * add toolbox tool
     */
    const userToolboxSettings = this.Editor.Tools.getToolSettings(toolName)[userSettings.TOOLBOX] || {};

    const button = $.make('li', [this.CSS.toolboxButton]);

    button.dataset.tool = toolName;
    button.innerHTML = userToolboxSettings.icon || toolToolboxSettings.icon;

    $.append(this.nodes.toolbox, button);

    this.nodes.toolbox.appendChild(button);
    this.nodes.buttons.push(button);

    /**
     * Add click listener
     */
    this.Editor.Listeners.on(button, 'click', (event: KeyboardEvent | MouseEvent) => {
      this.toolButtonActivate(event, toolName);
    });

    /**
     * diy-start
     */
    // const helpToolboxSettings = this.Editor.Tools.getToolSettings(toolName)[userSettings.TOOLBOX] || {};
    //
    // const helpButton = $.make('li', [this.CSS.toolboxButton]);
    //
    // helpButton.dataset.tool = toolName;
    // helpButton.innerHTML = userToolboxSettings.icon || toolToolboxSettings.icon;
    //
    // $.append(this.nodes.toolbox, helpButton);
    //
    // this.nodes.toolbox.appendChild(helpButton);
    // this.nodes.buttons.push(helpButton);
    //
    // /**
    //  * Add click listener
    //  */
    // this.Editor.Listeners.on(helpButton, 'click', (event: KeyboardEvent | MouseEvent) => {
    //   // this.toolButtonActivate(event, toolName);
    //   console.log('click -help');
    // });
    /**
     * diy-end
     */

    /**
     * Add listeners to show/hide toolbox tooltip
     */
    const tooltipContent = this.drawTooltip(toolName);

    this.Editor.Tooltip.onHover(button, tooltipContent, {
      placement: 'bottom',
      hidingDelay: 200,
    });

    /**
     * Enable shortcut
     */
    const toolSettings = this.Editor.Tools.getToolSettings(toolName);

    if (toolSettings && toolSettings[this.Editor.Tools.USER_SETTINGS.SHORTCUT]) {
      this.enableShortcut(tool, toolName, toolSettings[this.Editor.Tools.USER_SETTINGS.SHORTCUT]);
    }

    /** Increment Tools count */
    this.displayedToolsCount++;
  }

  /**
   * Draw tooltip for toolbox tools
   *
   * @param {String} toolName - toolbox tool name
   * @return { HTMLElement }
   */
  private drawTooltip(toolName: string): HTMLElement {
    const toolSettings = this.Editor.Tools.getToolSettings(toolName);
    const toolboxSettings = this.Editor.Tools.available[toolName][this.Editor.Tools.INTERNAL_SETTINGS.TOOLBOX] || {};
    const userToolboxSettings = toolSettings.toolbox || {};
    const name = userToolboxSettings.title || toolboxSettings.title || toolName;

    let shortcut = toolSettings[this.Editor.Tools.USER_SETTINGS.SHORTCUT];

    const tooltip = $.make('div', this.CSS.buttonTooltip);
    const hint = document.createTextNode(_.capitalize(name));

    tooltip.appendChild(hint);

    if (shortcut) {
      shortcut = _.beautifyShortcut(shortcut);

      tooltip.appendChild($.make('div', this.CSS.buttonShortcut, {
        textContent: shortcut,
      }));
    }

    return tooltip;
  }

  /**
   * Enable shortcut Block Tool implemented shortcut
   * @param {BlockToolConstructable} tool - Tool class
   * @param {String} toolName - Tool name
   * @param {String} shortcut - shortcut according to the ShortcutData Module format
   */
  private enableShortcut(tool: BlockToolConstructable, toolName: string, shortcut: string) {
    this.Editor.Shortcuts.add({
      name: shortcut,
      handler: (event: KeyboardEvent) => {
        event.preventDefault();
        this.insertNewBlock(tool, toolName);
      },
    });
  }

  /**
   * Creates Flipper instance to be able to leaf tools
   */
  private enableFlipper(): void {
    const tools = Array.from(this.nodes.toolbox.childNodes) as HTMLElement[];
    this.flipper = new Flipper({
      items: tools,
      focusedItemClass: this.CSS.toolboxButtonActive,
    });
  }

  /**
   * Inserts new block
   * Can be called when button clicked on Toolbox or by ShortcutData
   *
   * @param {BlockToolConstructable} tool - Tool Class
   * @param {String} toolName - Tool name
   */
  private insertNewBlock(tool: BlockToolConstructable, toolName: string) {
    const {BlockManager, Caret} = this.Editor;
    /**
     * @type {Block}
     */
    const {currentBlock} = BlockManager;

    let newBlock;

    if (currentBlock.isEmpty) {
      newBlock = BlockManager.replace(toolName);
    } else {
      newBlock = BlockManager.insert(toolName);
    }

    /**
     * Apply callback before inserting html
     */
    newBlock.call(BlockToolAPI.APPEND_CALLBACK);

    this.Editor.Caret.setToBlock(newBlock);

    /** If new block doesn't contain inpus, insert new paragraph above */
    if (newBlock.inputs.length === 0) {
      if (newBlock === BlockManager.lastBlock) {
        BlockManager.insertAtEnd();
        Caret.setToBlock(BlockManager.lastBlock);
      } else {
        Caret.setToBlock(BlockManager.nextBlock);
      }
    }

    /**
     * close toolbar when node is changed
     */
    this.Editor.Toolbar.close();
  }
}
