import * as React from 'react';
import { ItemBox } from '../ItemBox';
import { ITooltipProps } from '../../tooltip/Tooltip';
import { ISvgProps, Svg } from '../../svg/Svg';
import { IContentProps } from '../../content/Content';

export class ItemBoxExamples extends React.Component<any, any> {
  render() {
    const tooltip: ITooltipProps = {
      title: 'title test for the item Box',
      placement: 'bottom',
      container: 'body',
    };

    const svg: ISvgProps = {
      svgName: 'domain-google',
      svgClass: 'icon',
    };
    const getSvgPrepend: IContentProps = { content: () => <Svg {...svg} />, classes: ['mr1'] };
    const getSvgAppend: IContentProps = { content: () => <Svg {...svg} />, classes: ['ml1'] };

    const triggerAlertFunction = () => {
      alert('Event onClick triggered');
    };

    return (
      <div className='mt2'>
        <h1 className='text-blue mb1'>Item Box</h1>

        <div className='form-group'>
          <label className='form-control-label'>Default Item Box</label>
          <div className='form-control'>
            <ItemBox value='test' />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box with an displayValue</label>
          <div className='form-control'>
            <ItemBox value='test' displayValue='Display test' />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box with a prepend text</label>
          <div className='form-control'>
            <ItemBox value='test' prepend={{ content: 'Prefix', classes: ['text-medium-grey', 'mr1'] }} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box with a prepend icon</label>
          <div className='form-control'>
            <ItemBox value='test' prepend={getSvgPrepend} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box with a append icon</label>
          <div className='form-control'>
            <ItemBox value='test' append={getSvgAppend} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box with a title</label>
          <div className='form-control'>
            <ItemBox value='test' tooltip={tooltip} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box with selected</label>
          <div className='form-control'>
            <ItemBox value='test' selected={true} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box with active</label>
          <div className='form-control'>
            <ItemBox value='test' active={true} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box disabled</label>
          <div className='form-control'>
            <ItemBox value='test' disabled={true} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box divider</label>
          <div className='form-control'>
            <ItemBox value='test' divider={true} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Item Box with an onClick event</label>
          <div className='form-control'>
            <ItemBox value='test' onOptionClick={triggerAlertFunction} />
          </div>
        </div>
      </div>
    );
  }
}
