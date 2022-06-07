// slides the side bar in tablet/phone screens
export const slideIn = (setSideMenuSmallDisplay, sidebarRef) => {
    setSideMenuSmallDisplay(true)
    sidebarRef.current.classList.toggle("slide-in-left")
    setTimeout(() => {sidebarRef.current.classList.toggle("slide-in-left")}, 500)
}

// slides the side bar out tablet/phone screens
export const slideOut = (setSideMenuSmallDisplay, sidebarRef) => {
    sidebarRef.current.classList.toggle("slide-out-left")
    setTimeout(() => {setSideMenuSmallDisplay(false);sidebarRef.current.classList.toggle("slide-out-left")}, 500)
}

// recursively get path of the focused folder
export const trackHier = (idMap, child, res) => {
    if (child) {
        res = trackHier(idMap, idMap[child].parent_folder, res)
        res.push(child)
    }
    return res
}