const electron = require("electron");
const uuid = require('uuid-js');
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let todayWindow;
let createWindow;
let listWindow;
let aboutWindow;

let allAppointments = [];

app.on("ready", () => {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: "BALI Rental Mobil"
    });

    todayWindow.loadURL(`file://${__dirname}/home.html`);
    todayWindow.on("close", () => {

        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Semua Pesanan"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("close", () => (listWindow = null));
};

const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Buat Pesanan"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("close", () => (createWindow = null));
};

const aboutWindowCreator = () => {
    aboutWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Tentang"
    });

    aboutWindow.setMenu(null);
    aboutWindow.loadURL(`file://${__dirname}/about.html`);
    aboutWindow.on("close", () => (aboutWindow = null));
};

ipcMain.on("appointment:create", (event, appointment) => {
    appointment.id = uuid.create().toString();

    allAppointments.push(appointment);
    console.log('(index.js) Current Appointments: ', allAppointments);


});

ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allAppointments);
});

ipcMain.on("appointment:request:today", event => {
    console.log("here2");
});

ipcMain.on("appointment:done", (event, id) => {
    console.log("here3");
});

const menuTemplate = [{
        label: "File",
        submenu: [{
                label: "Pesanan Baru",

                click() {
                    createWindowCreator();
                }
            },
            {
                label: "Daftar Pesanan",

                click() {
                    listWindowCreator();
                }
            },
            {
                label: "Keluar",
                accelerator: process.platform === "darwin" ? "CTRL + Q" : "Ctrl + Q",
                click() {
                    app.quit();
                }
            }
        ]
    },

    {
        label: "View",
        submenu: [{
            role: "Reload"
        }, {
            role: "toggledevtools"
        }]
    },

    {

        label: "Tentang",
        click() {
            aboutWindowCreator();
        }
    }
]