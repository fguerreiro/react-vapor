import { Content } from '../content/Content';
import { keyCode } from '../../utils/InputUtils';
import { FilterBox } from '../filterBox/FilterBox';
import { ISvgProps, Svg } from '../svg/Svg';
import * as classNames from 'classnames';
import * as React from 'react';
import * as _ from 'underscore';
import * as s from 'underscore.string';

export interface IDropdownOption {
  svg?: ISvgProps;
  value: string;
  displayValue?: string;
  prefix?: string;
  selected?: boolean;
  custom?: boolean;
  hidden?: boolean;
  default?: boolean;
}

export interface IDropdownSearchStateProps {
  isOpened?: boolean;
  filterText?: string;
  options?: IDropdownOption[];
  activeOption?: IDropdownOption;
  setFocusOnDropdownButton?: boolean;
}

export interface IDropdownSearchOwnProps extends React.ClassAttributes<DropdownSearch> {
  id?: string;
  modMenu?: boolean;
  fixedPrepend?: string;
  containerClasses?: string[];
  defaultOptions?: IDropdownOption[];
  defaultSelectedOption?: IDropdownOption;
  filterPlaceholder?: string;
  maxWidth?: number;
  width?: number;
  hasFilterSuggestionBoxWidthFixed?: boolean;
  highlightThreshold?: number;
  highlightAllFilterResult?: boolean;
  noResultText?: string;
  createOptionText?: string;
  deselectAllTooltipText?: string;
  isDisabled?: boolean;
  onOptionClickCallBack?: (option: IDropdownOption) => void;
  onMountCallBack?: () => void;
  onClickCallBack?: () => void;
  supportSingleCustomOption?: boolean;
  searchThresold?: number;
}

export interface IDropdownSearchDispatchProps {
  onMount?: () => void;
  onDestroy?: () => void;
  onToggleDropdown?: () => void;
  onBlur?: (options: IDropdownOption[]) => void;
  onFocus?: () => void;
  onFilterTextChange?: (filterText: string) => void;
  onOptionClick?: (option: IDropdownOption) => void;
  onCustomOptionClick?: (displayValue: string) => void;
  onKeyDownFilterBox?: (keyCode: number) => void;
  onKeyDownDropdownButton?: (keyCode: number) => void;
  onMouseEnterDropdown?: () => void;
  onRemoveSelectedOption?: (value: string) => void;
  onRemoveAllSelectedOptions?: () => void;
  onClose?: () => void;
}

export interface IDropdownSearchProps extends IDropdownSearchOwnProps, IDropdownSearchStateProps, IDropdownSearchDispatchProps { }

export class DropdownSearch extends React.Component<IDropdownSearchProps, {}> {
  filterInput: HTMLDivElement;
  ulElement: HTMLElement;
  protected dropdownButton: HTMLElement;

  static defaultProps: Partial<IDropdownSearchProps> = {
    isOpened: false,
    highlightThreshold: 100,
    highlightAllFilterResult: false,
    noResultText: 'No results',
    searchThresold: 7,
  };

  protected getSelectedOption(): IDropdownOption {
    return _.findWhere(this.props.options, { selected: true });
  }

  protected getSelectedOptions(): IDropdownOption[] {
    return _.where(this.props.options, { selected: true });
  }

  protected getDisplayedOptions(): IDropdownOption[] {
    return _.reject(this.props.options, (option) => {
      return (!this.props.supportSingleCustomOption && option.custom) || option.hidden;
    });
  }

  protected getDropdownOptions(): JSX.Element[] {
    const options = _.chain(this.getDisplayedOptions())
      .filter((option: IDropdownOption) => {
        const value = option.displayValue || option.value;
        return _.isEmpty(this.props.filterText)
          || s.contains(value.toLowerCase(), this.props.filterText.toLowerCase());
      })
      .map((option: IDropdownOption, index: number, options: IDropdownOption[]) => {
        const optionClasses = classNames({
          'state-selected': option.selected,
        });
        const liClasses = classNames({
          'active': JSON.stringify(option) === JSON.stringify(this.props.activeOption),
        });

        const value = option.displayValue || option.value;
        const valueToShow = !!this.props.highlightAllFilterResult || options.length <= this.props.highlightThreshold
          ? this.getTextFiltered(value)
          : value;

        return (
          <li key={option.value}
            className={liClasses}
            title={value}>
            <span className={optionClasses}
              onMouseDown={(e: React.MouseEvent<HTMLSpanElement>) => this.handleOnOptionClick(e)}
              data-value={option.value}>
              {this.getDropdownPrepend(option)}
              {this.getSvg(option)}
              {valueToShow}
            </span>
          </li>
        );
      })
      .value();

    return options.length ? options : this.getNoOptions();
  }

  protected getNoOptions(): JSX.Element[] {
    return [
      <li key='noResultDropdownSearch'>
        <span className='no-search-results'>{this.props.noResultText}</span>
      </li>,
    ];
  }

  protected getSvg(option: IDropdownOption): JSX.Element {
    if (option && option.svg) {
      return (
        <span key={option.svg.name}
          className='value-icon'>
          <Svg {...option.svg} />
        </span>
      );
    }
    return null;
  }

  protected getTextFiltered(text: string): (JSX.Element | string)[] | string {
    const originalText = new String(text).toString();
    if (!_.isEmpty(this.props.filterText)) {
      let highlightIndexKey: number = 0;
      const textFilterElements: (JSX.Element | string)[] = [''];
      let index: number = text.toLowerCase().indexOf(this.props.filterText.toLowerCase());
      while (index !== -1) {
        if (index > 0) {
          textFilterElements.push(text.substring(0, index));
        }
        textFilterElements.push(
          this.getTextElement(text.substring(index, index + this.props.filterText.length), originalText, highlightIndexKey,
            'bold'));
        text = text.substring(index + this.props.filterText.length);
        index = text.toLowerCase().indexOf(this.props.filterText.toLowerCase());
        highlightIndexKey += 1;
      }
      textFilterElements.push(text);

      return textFilterElements;
    }

    return text;
  }

  protected getTextElement(subText: string, text: string, highlightIndexKey: number, className: string = ''): JSX.Element {
    return (
      <span key={`${text}-${highlightIndexKey}`}
        className={className}>
        {subText}
      </span>
    );
  }

  protected getMainInputPrepend(option: IDropdownOption): JSX.Element {
    const prepend = this.props.fixedPrepend || (option && option.prefix);

    return prepend
      ? <Content key={prepend} classes={['dropdown-prepend']} content={prepend} />
      : null;
  }

  protected getDropdownPrepend(option: IDropdownOption): JSX.Element {
    return option && option.prefix
      ? <Content key={option.prefix} classes={['dropdown-prepend']} content={option.prefix} />
      : null;
  }

  protected getMainInput(): JSX.Element {
    const selectedOption: IDropdownOption = _.findWhere(this.props.options, { selected: true });
    const filterPlaceHolder: string = selectedOption && (selectedOption.displayValue || selectedOption.value)
      || this.props.filterPlaceholder;

    if (this.props.isOpened
      && (this.isSearchOn() || this.props.supportSingleCustomOption)) {
      return <FilterBox
        id={this.props.id}
        onFilter={(id, filterText) => this.handleOnFilterTextChange(filterText)}
        onBlur={() => this.handleOnBlur()}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.handleOnKeyDownFilterBox(e)}
        filterPlaceholder={filterPlaceHolder}
        isAutoFocus={true}
        filterText={this.props.filterText || ''}
      />;
    }
    return <button
      className='btn dropdown-toggle dropdown-button-search-container mod-search'
      type='button'
      data-toggle='dropdown'
      onClick={() => this.handleOnClick()}
      onBlur={() => this.handleOnClose()}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.handleOnKeyDownDropdownButton(e)}
      style={{
        maxWidth: this.props.maxWidth,
      }}
      ref={(input: HTMLButtonElement) => { this.dropdownButton = input; }}
      disabled={!!this.props.isDisabled}>
      {this.getMainInputPrepend(this.getSelectedOption())}
      {this.getSvg(this.getSelectedOption())}
      {this.getSelectedOptionElement()}
      <span className='dropdown-toggle-arrow'></span>
    </button>;
  }

  protected isScrolledIntoView(el: Element) {
    const boxTop = this.ulElement.getBoundingClientRect().top;
    const boxBottom = this.ulElement.getBoundingClientRect().bottom;
    const elTop = el.getBoundingClientRect().top;
    const elBottom = el.getBoundingClientRect().bottom;

    return (elTop >= boxTop) && (elBottom <= boxBottom);
  }

  protected handleOnOptionClickOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (this.isKeyToPreventOnKeyDown(e)) {
      e.preventDefault();

      if (this.props.onOptionClickCallBack && this.props.activeOption) {
        this.props.onOptionClickCallBack(this.props.activeOption);
      }
    }
  }

  protected handleOnKeyDownFilterBox(e: React.KeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyDownFilterBox) {
      this.props.onKeyDownFilterBox(e.keyCode);
    }

    this.handleOnOptionClickOnKeyDown(e);
  }

  protected getClasses() {
    return classNames(
      'dropdown',
      'mod-search',
      {
        'open': this.props.isOpened,
        'mod-menu': this.props.modMenu,
      },
      ...(this.props.containerClasses || []),
    );
  }

  protected getStyles() {
    return {
      width: this.props.width,
    };
  }

  private getSelectedOptionElement(): JSX.Element[] {
    if (this.props.options.length) {
      return _.map(this.getSelectedOptions(), (selectedOption: IDropdownOption) => {
        const displayValue = selectedOption.displayValue || selectedOption.value;
        return (
          <span key={selectedOption.value}
            className='dropdown-selected-value'
            data-value={selectedOption.value}
            title={displayValue}>
            {displayValue}
          </span>
        );
      });
    }

    return null;
  }

  private isSearchOn(): boolean {
    return this.props.options.length > this.props.searchThresold;
  }

  private updateScrollPositionBasedOnActiveElement() {
    const activeLi: NodeListOf<Element> = this.ulElement ? this.ulElement.getElementsByClassName('active') : undefined;
    if (activeLi && activeLi.length) {
      const el: Element = activeLi[0];
      if (!this.isScrolledIntoView(el)) {
        if (el.getBoundingClientRect().bottom > this.ulElement.getBoundingClientRect().bottom) {
          this.ulElement.scrollTop += el.getBoundingClientRect().bottom - this.ulElement.getBoundingClientRect().bottom;
        }
        if (el.getBoundingClientRect().top < this.ulElement.getBoundingClientRect().top) {
          this.ulElement.scrollTop -= this.ulElement.getBoundingClientRect().top - el.getBoundingClientRect().top;
        }
      }
    }
  }

  private handleOnFilterTextChange(filterText: string) {
    if (this.props.onFilterTextChange) {
      this.props.onFilterTextChange(filterText);
    }
  }

  private handleOnClick() {
    if (this.props.onClickCallBack) {
      this.props.onClickCallBack();
    }

    if (this.props.onToggleDropdown) {
      this.props.onToggleDropdown();
    }
  }

  private handleOnOptionClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (e.target) {
      const option = _.findWhere(this.props.options, { value: e.currentTarget.dataset.value });
      if (this.props.onOptionClick) {
        this.props.onOptionClick(option);
      }

      if (this.props.onOptionClickCallBack) {
        this.props.onOptionClickCallBack(option);
      }
    }
  }

  private handleOnBlur() {
    if (this.props.onBlur && !this.props.setFocusOnDropdownButton) {
      this.props.onBlur(this.props.options);
    }
  }

  private handleOnClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  private isKeyToPreventOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    /**
     * Prevent Enter key because it triggers an undesirable click event
     * Prevent Tab key to prevent focusing on the next element when selecting an option
     * Prevent Up Arrow key when the first option in the dropdown is the active option to avoid two focus events to be triggered
     */
    return e.keyCode === keyCode.enter
      || e.keyCode === keyCode.tab
      || (e.keyCode == keyCode.upArrow && this.props.activeOption === this.props.options[0]);
  }

  private handleOnKeyDownDropdownButton(e: React.KeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyDownDropdownButton) {
      this.props.onKeyDownDropdownButton(e.keyCode);
    }

    if (!this.isSearchOn()) {
      this.handleOnOptionClickOnKeyDown(e);
    }

    if (!this.isSearchOn()
      && _.contains([keyCode.downArrow, keyCode.upArrow], e.keyCode)) {
      e.preventDefault();
    }
  }

  private handleOnMouseEnter() {
    if (this.props.onMouseEnterDropdown) {
      this.props.onMouseEnterDropdown();
    }
  }

  componentDidUpdate() {
    this.updateScrollPositionBasedOnActiveElement();

    if (this.dropdownButton && this.props.setFocusOnDropdownButton && this.isSearchOn()) {
      this.dropdownButton.focus();
    }
  }

  componentWillMount() {
    if (this.props.onMount) {
      this.props.onMount();
    }

    if (this.props.onMountCallBack) {
      this.props.onMountCallBack();
    }
  }

  componentWillUnmount() {
    if (this.props.onDestroy) {
      this.props.onDestroy();
    }
  }

  render() {
    const options: JSX.Element = this.props.isOpened
      ? (
        <ul className='dropdown-menu'
          ref={(input: HTMLUListElement) => { this.ulElement = input; }}
          onMouseEnter={() => this.handleOnMouseEnter()}>
          {this.getDropdownOptions()}
        </ul>
      )
      : null;

    return (
      <div className={this.getClasses()} style={this.getStyles()}>
        {this.getMainInput()}
        {options}
      </div>
    );
  }
}
