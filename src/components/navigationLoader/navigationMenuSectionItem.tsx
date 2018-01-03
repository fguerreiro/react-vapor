import * as React from 'react';

export interface INavigationMenuSectionItemProps {
  classes?: string[];
}

export class NavigationMenuSectionItem extends React.Component<INavigationMenuSectionItemProps, any> {
  render() {
    let classes = ['mod-sub-navigation-left-margin', 'navigation-loading-item-grey'].concat(this.props.classes);
    return <div className={classes.join(' ')}></div>;
  }
}
