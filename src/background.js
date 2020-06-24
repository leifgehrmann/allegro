// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu } from "electron";
import { appMenuTemplate } from "./menu/app_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import { devMenuTemplate } from "./menu/dev_menu_template";
import createWindow from "./helpers/window";

import Store from 'electron-store'

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

const setApplicationMenu = () => {
    const menus = [appMenuTemplate, editMenuTemplate];
    if (env.name !== "production") {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
    const userDataPath = app.getPath("userData");
    app.setPath("userData", `${userDataPath} (${env.name})`);
}

// Setup the localStorage
const store = new Store();

app.on("ready", () => {
    setApplicationMenu();

    const mainWindow = createWindow("main", {
        width: 1000,
        height: 600,
        minWidth: 450,
        backgroundColor: '#FFFFFF',
        show: false,
        webPreferences: {
            // Because we are loading our own files, rather than a remote web page, this is safe
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "app.html"),
            protocol: "file:",
            slashes: true
        })
    );

    mainWindow.on('blur', () => {
        mainWindow.webContents.executeJavaScript(`document.body.classList.add("window-unfocused")`);
    });

    mainWindow.on('focus', () => {
        mainWindow.webContents.executeJavaScript(`document.body.classList.remove("window-unfocused")`);
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });

});

app.on("window-all-closed", () => {
    app.quit();
});
