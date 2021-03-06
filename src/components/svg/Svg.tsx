import * as React from 'react';
import { extend, omit } from 'underscore';

const svgsEnum = require('../../../node_modules/coveo-styleguide/dist/svg/CoveoStyleGuideSvg.json') as { [key: string]: string };

/**
 * Pass the required svgName to get your svg.
 * Use svgClass to pass the svg fill class (and the icon class if you didn't pass is as className).
 */
export interface ISvgProps extends React.HTMLProps<Svg> {
  svgClass?: string;
  svgName: string;
}

/**
 * List of props that were passed to the <Svg> component but that should not be passed to the <span> element to avoid warnings.
 * @type {string[]}
 */
const svgPropsToOmit = [
  'svgClass', 'svgName',
];

export class Svg extends React.Component<ISvgProps, any> {
  static defaultProps: Partial<ISvgProps> = {
    svgClass: '',
  };

  private setSvgClass = (svgString: string, svgClass: string): string => {
    const parser = document.createElement('div');
    parser.innerHTML = svgString;

    (parser.children[0] as SVGElement).setAttribute('class', svgClass);

    return parser.innerHTML;
  }

  render() {
    const svgString: string = svgsEnum[this.props.svgName];

    // Omit Svg props to avoid warnings.
    const svgSpanProps = extend({}, omit(this.props, svgPropsToOmit));

    if (svgString) {
      return (
        <span {...svgSpanProps} dangerouslySetInnerHTML={{ __html: this.setSvgClass(svgString, this.props.svgClass) }} />
      );
    } else {
      return (
        <span {...svgSpanProps} >
          <svg className={this.props.svgClass} />
        </span>
      );
    }
  }
}
