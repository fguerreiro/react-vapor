import * as React from 'react';
import * as classNames from 'classNames';

export class NavigationLoader extends React.Component<any, any> {
  render() {
    return (
      <NavigationContainer />
    );
  }
}

function NavigationContainer() {
  return (
    <nav className='navigation'>
      <div className='navigation-menu'>
        <ul className='navigation-menu-sections'>
          <li className='block navigation-menu-section'>
            <HeaderNavigationLoader />
            <NavigationMenuSectionItem rows={3} />
          </li>
          <li className='block navigation-menu-section'>
            <HeaderNavigationLoader />
            <NavigationMenuSectionItem rows={7} />
          </li>
          <li className='block navigation-menu-section'>
            <HeaderNavigationLoader />
            <NavigationMenuSectionItem rows={5} />
          </li>
        </ul>
      </div>
    </nav>
  );
}

function HeaderNavigationLoader() {
  return (<header className='navigation-menu-section-header'>
    <div className='navigation-loading-item-light-grey mod-navigation-loading-bullet navigation-menu-section-header-icon'></div>
    <div className='navigation-loading-item-light-grey mod-width-40'></div>
  </header>);
}

function NavigationMenuSectionItem(props: any) {
  let numberRows: number = props.rows;
  var rows = [];
  let previous = 30;
  let isSum = true;

  for (var i = 0; i < numberRows; i++) {
    let modWidth = isSum ? previous + 10 : previous - 10;
    previous = modWidth;
    isSum = !isSum;
    let modWidthClass = 'mod-width-' + modWidth;
    let nextClass = classNames('navigation-loading-item-grey', modWidthClass, 'mod-sub-navigation-left-margin');
    rows.push(<div className={nextClass}></div>);
  }

  return (
    <ul className='navigation-menu-section-items'>
      {rows}
    </ul>
  );
}
