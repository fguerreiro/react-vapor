import * as React from 'react';
import { Content } from '../Content';
import { Tooltip } from '../../tooltip/Tooltip';
import { Svg } from '../../svg/Svg';
import { Loading } from '../../loading/Loading';
import { ItemBox } from '../../itemBox/ItemBox';

export class ContentExamples extends React.Component<any, any> {
  render() {
    return (
      <div className='mt2'>
        <h1 className='text-blue mb1 bold'>Content</h1>

        <div className='form-group'>
          <label className='form-control-label'>Content with an string</label>
          <div className='form-control'>
            <Content content='test' />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Content with a Svg</label>
          <div className='form-control'>
            <Content content={() => <Svg svgName='domain-google' svgClass='icon' />} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Content with a tooltip</label>
          <div className='form-control'>
            <Content content={() => <Tooltip title='test'>Tooltip</Tooltip>} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Content with a component Loading</label>
          <div className='form-control'>
            <Content content={Loading} />
          </div>
        </div>
        <div className='form-group'>
          <label className='form-control-label'>Content with a component ItemBox with props</label>
          <div className='form-control'>
            <Content content={ItemBox} componentProps={{ value: 'test' }} />
          </div>
        </div>
      </div>
    );
  }
}
