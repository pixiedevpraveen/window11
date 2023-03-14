const os = PetiteVue.reactive({
    count: 1,
    desktop: {
        id: -1,
        contextMenu: {
            id: "comp__desktopContextMenu", show: false
        },
        appContextMenu: {
            app: null,
            id: "comp__desktopIconContextMenu", show: false
        },
        toggle() {
            os.activity.focusedId = this.id
            os.workspaces.setActiveApp('')
            this.contextMenu.show = false
            this.appContextMenu.show = false
        },
        itemSize: "medium",
        getItems() {
            return os.apps.items.filter(a => a.desktop)
        },
        handleAppDblClick(app) {
            os.taskbar.handleAppSingleClick(app)
        },
        openContextMenu(e) {
            if (e.target.id !== "desktop") return;
            this.contextMenu.show = true
            const menu = document.getElementById(this.contextMenu.id)
            menu.style.left = e.clientX + "px"
            menu.style.top = e.clientY + "px"
        },
        openIconContextMenu(e, app) {
            this.appContextMenu.app = app
            this.appContextMenu.show = true
            const menu = document.getElementById(this.appContextMenu.id)
            menu.style.left = e.clientX + "px"
            menu.style.top = e.clientY + "px"
        }
    },
    taskbar: {
        show: true,
        getPinnedApps() {
            return os.apps.items.filter(a => a.taskbarPinned).sort((a, b) => a.taskbarPinned - b.taskbarPinned)
        },
        handleAppSingleClick(app) {
            const activeWorkspace = os.workspaces.all.filter(w => w.id === os.workspaces.active)[0]
            if (app.running) {
                if (app.running.indexOf(activeWorkspace.id) != -1) {
                    app.minimized = !app.minimized
                } else {
                    app.running.push(activeWorkspace.id)

                }
            }
            else {
                app.running = [activeWorkspace.id]
                app.minimized = false
            }
            if (app.minimized) {
                activeWorkspace.activeApp = '';
            } else {
                activeWorkspace.activeApp = (activeWorkspace.activeApp === app.name ? "" : app.name)
            }
            makeDraggable()
        },
        toggle() {
            document.documentElement.style.setProperty("--taskbar-size", this.show ? '0em' : '2.5em');

            this.show = !this.show;
        }
    },
    media: { sound: { volume: 30 } },
    activity: {
        focusedId: 0,
        focus(id) { this.focusedId = id; }
    },
    layout: {
        menu: {
            mainMenu: { id: 1, toggle() { os.activity.focusedId = (os.activity.focusedId == this.id ? 0 : this.id); } },
            systemTray: {
                id: 2,
                toggle() { os.activity.focusedId = (os.activity.focusedId == this.id ? 0 : this.id); },
                items: [
                    { name: 'wifi', icon: "svg/wifi-solid.svg", active: true },
                    { name: 'bluetooth', icon: "svg/bluetooth-b.svg", active: true },
                    { name: 'Airplane mode', icon: "svg/plane-solid.svg", active: false },
                    { name: 'Battery saver', icon: "svg/battery-half-solid.svg", active: false },
                    { name: 'Focus assist', icon: "svg/moon.svg", active: false },
                    { name: 'Location', icon: "svg/map-marker-solid.svg", active: false },
                ]
            },
            calender: {
                id: 3,
                toggle() { os.activity.focusedId = (os.activity.focusedId == this.id ? 0 : this.id); }
            },
            menuRight: 0 // 0=hide menu(#menu-right), 1=system-tray, 2=calender
        },
        brighness: 95.0,
    },
    workspaces: {
        show: true,
        active: 1,
        all: [{ id: 1, activeApp: "" }],
        getActiveWorkspace() {
            return this.all.filter(w => w.id === this.active)[0]
        },
        getActiveApp() {
            return this.all.filter(w => w.id === this.active)[0].activeApp
        },
        setActiveApp(name) {
            this.getActiveWorkspace().activeApp = name
        },
        handleAppSingleClick(app, workspace) {
            workspace.activeApp = app.name
        },
        handleAppDrag(app, workspace) {
            workspace.activeApp = app.name
        },
        handleAppMinimize(app) {
            app.minimized = true
            const workspace = this.getActiveWorkspace()
            if (workspace.activeApp === app.name)
                workspace.activeApp = ''
        },
        handleAppClose(app) {
            const workspace = this.getActiveWorkspace()
            app.running.splice(app.running.indexOf(workspace.id), 1)
            if (workspace.activeApp === app.name)
                workspace.activeApp = ''
        },
        getApps(workspace = this.all[0]) {
            return os.apps.items.filter(a => a.running && a.running.indexOf(workspace.id) != -1)
        },
        addWorkspace() {
            this.all.push({ id: this.all.length + 1 })
        },
        addApp(name = '') {
            const app = os.apps.items.filter(a => a.name === name)
            console.log(app);
        },
    },
    runner: {
        value: '',
        searchedApps() {
            return os.apps.items.filter(a => a.name.toLowerCase().search(this.value.toLowerCase()) != -1 || a.alt.toLowerCase().search(this.value.toLowerCase()) != -1)
        },
        pinnedApps() {
            return os.apps.items.filter(a => a.menuPinned).sort((a, b) => a.menuPinned - b.menuPinned)
        }
    },
    apps: {
        id: 10,
        toggle() { os.activity.focusedId = this.id },
        items: [
            {
                name: 'Google Chrome',
                minimized: false,
                maximized: false,
                desktop: false,
                menuPinned: 1,
                taskbarPinned: 1,
                running: [], // workspaces id
                alt: "browser, internet", icon: "icons/apps/google-chrome.svg",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "10px", y: "10px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'Microsoft Edge',
                minimized: true,
                maximized: false,
                desktop: true,
                menuPinned: 2,
                desktopPosition: { x: "12%", y: "12%" },
                taskbarPinned: 2,
                alt: "browser, internet", icon: "icons/apps/microsoft-edge.svg",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "14px", y: "14px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'Firefox',
                minimized: true,
                maximized: false,
                desktop: false,
                menuPinned: 9,
                taskbarPinned: 3,
                alt: "browser, internet", icon: "icons/apps/firefox.svg",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "16px", y: "16px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'Microsoft Store',
                minimized: true,
                maximized: false,
                desktop: true,
                menuPinned: 3,
                desktopPosition: { x: 1, y: "10%" },
                taskbarPinned: 8,
                alt: "install, software, uninstall", icon: "icons/apps/ms-store.png",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "18px", y: "18px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'MS Word',
                minimized: true,
                maximized: false,
                desktop: false,
                menuPinned: 4,
                taskbarPinned: 5,
                alt: "office", icon: "icons/apps/office-word.png",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "20px", y: "20px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'MS Excel',
                minimized: true,
                maximized: false,
                desktop: false,
                menuPinned: 5,
                taskbarPinned: 6,
                alt: "office", icon: "icons/apps/office-excel.png",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "22px", y: "22px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'MS Power Point',
                minimized: true,
                maximized: false,
                desktop: false,
                menuPinned: 9,
                taskbarPinned: 7,
                alt: "office", icon: "icons/apps/office-powerpoint.png",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "24px", y: "24px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'Video Player',
                minimized: true,
                maximized: false,
                desktop: false,
                menuPinned: 6,
                alt: "video player, music, mp4, mpeg, mkv", icon: "icons/apps/video-player.svg",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "26px", y: "26px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'NotePad',
                minimized: true,
                maximized: false,
                desktop: false,
                menuPinned: 7,
                alt: "text editor, txt, code", icon: "icons/apps/notepad.png",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "28px", y: "28px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'Discord',
                minimized: false,
                maximized: false,
                desktop: true,
                menuPinned: 8,
                desktopPosition: { x: 2, y: 0 },
                taskbarPinned: 4,
                alt: "voice, video, talk, chat, games", icon: "icons/apps/discord.svg",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "32px", y: "32px" },
                    size: { w: "800px", h: "600px" },
                }
            },
            {
                name: 'Recycle Bin',
                minimized: true,
                maximized: false,
                desktop: true,
                menuPinned: 9,
                desktopPosition: { x: 3, y: 0 },
                alt: "delete, remove, restore", icon: "icons/apps/trash-full.png",
                data: {
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia beatae quidem voluptas maiores ducimus animi rem dignissimos earum rerum laboriosam."
                },
                window: {
                    position: { x: "34px", y: "34px" },
                    size: { w: "800px", h: "600px" },
                }
            },
        ]
    },
    toggleAirplane() {
        let status = this.layout.menu.systemTray.items[2].active;
        this.layout.menu.systemTray.items[0].active = this.layout.menu.systemTray.items[1].active = status;
        this.layout.menu.systemTray.items[2].active = !status;
    },
    handleRunnerSearch(e) {
        console.log(e);
    }
})

const store = PetiteVue.reactive({
    state: {
        count: "10%", msg: null, updatedAt: Date()
    },
    getState() {
        try {
            if (sessionStorage.storeState)
                this.state = JSON.parse(sessionStorage.storeState);
        } catch {
            sessionStorage.storeState = ''
            this.state.msg = "can't restore state"
        }
    },
    saveState() {
        sessionStorage.storeState = JSON.stringify(this.state);
    },
    setter: {
        setCount(value) {
            store.state.count = value;
        },
        setMsg(value) {
            store.state.msg = value;
        }
    },
    methods: {
        increment() {
            store.state.count++;
            store.saveState();
        },
        incBy(data) {
            store.state.count += data;
        }
    }
})

const components = {
    desktopIconContextMenu(props) {
        return {
            $template: "#comp__desktopIconContextMenu",
            app: props.app,
        }
    }
}

store.getState();
PetiteVue.
    createApp({
        os,
        store
    }).mount("#windows11");



function makeDraggable() {

    setTimeout(() => {
        let desktopIconsEl = document.querySelectorAll('.desktop-icon');
        let wsAppsEl = document.querySelectorAll('.workspace>.application');
        let desktopIcons = []

        let wsApps = []
        desktopIcons = []
        wsApps = []

        for (var i = 0; i < desktopIconsEl.length; i++) {
            var dragElem = desktopIconsEl[i];
            var draggie = new Draggabilly(dragElem, {
                containment: '#desktop',
                grid: [100, 100]
            });
            desktopIcons.push(draggie);
        }

        for (var i = 0; i < wsAppsEl.length; i++) {
            var dragElem = wsAppsEl[i];
            var wsApp = new Draggabilly(dragElem, {
                handle: dragElem.firstElementChild
            });
            wsApps.push(wsApp);
        }
    }, 500);

}
function makeDraggable2() {
    function onDrop(el, _target, _source, sibling) {
        // console.log(el);
        let ei = Number(el.getAttribute('index'))
        let si = Number(sibling.getAttribute('index'))
        console.log({ ei, si });
        // let temp = notes.value[ei].order
        // notes.value[ei].order = notes.value[si].order
        // notes.value[si].order = temp
    }

    var drag = dragula([document.querySelector(".dragula-sort")]);
    drag.on('drop', onDrop)
}

makeDraggable()
makeDraggable2()
