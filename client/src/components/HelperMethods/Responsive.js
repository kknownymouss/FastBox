// returns an object containing which media query or device is currently accessing the web app
export const responsiveHanlder = (isPhone, isTablet, isDesktop) => {
    return ({
        phoneView : isPhone && isTablet && isDesktop,
        tabletView : !isPhone && isTablet && isDesktop,
        desktopView : !isPhone && !isTablet && isDesktop,
        ultraView: !isPhone && !isTablet && !isDesktop
    })
}
