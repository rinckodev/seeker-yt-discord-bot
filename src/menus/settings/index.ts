import { settingsChannelMenu, settingsChannelsMenu, settingsChannelsOptions } from "./channels.js";
import { settingsMainMenu } from "./main.js";
import { settingsNav } from "./nav.js";
import { settingsRoleMenu, settingsRolesMenu, settingsRolesOptions } from "./roles.js";

export const settingsMenu = {
    nav: settingsNav,
    main: settingsMainMenu,
    channels:{
        options: settingsChannelsOptions,
        main: settingsChannelsMenu,
        submenu: settingsChannelMenu,
    },
    roles: {
        options: settingsRolesOptions,
        main: settingsRolesMenu,
        submenu: settingsRoleMenu, 
    }
};