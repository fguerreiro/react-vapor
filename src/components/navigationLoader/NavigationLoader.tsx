import * as React from 'react';

export class NavigationLoader extends React.Component<any, any> {
    render() {
        return (
            <NavigationContainer />
        );
      }
}

function NavigationContainer() {
    return(
        <nav className='navigation'>
            <div className='navigation-menu'>
                <ul className='navigation-menu-sections'>
                    <li className='block navigation-menu-section'>
                        <HeaderNavigationLoader />
                        <NavigationMenuSectionItem />
                        <NavigationMenuSectionItem />
                    </li>
                    <li className='block navigation-menu-section'>
                        <HeaderNavigationLoader />
                        <NavigationMenuSectionItem />
                        <NavigationMenuSectionItem />
                        <NavigationMenuSectionItem />
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
    // const classWidth = 'mod-width-' + props.width;
    // const itemClasses = classNames('navigation-loading-item-grey', 'mod-sub-navigation-left-margin', classWidth);
    return (
        <ul className='navigation-menu-section-items'>
            <div className='navigation-loading-item-grey mod-width-30 mod-sub-navigation-left-margin'></div>
            <div className='navigation-loading-item-grey mod-width-50 mod-sub-navigation-left-margin'></div>
            <div className='navigation-loading-item-grey mod-width-40 mod-sub-navigation-left-margin'></div>
            <div className='navigation-loading-item-grey mod-width-60 mod-sub-navigation-left-margin'></div>
        </ul>
    );
}
