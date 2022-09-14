const window = PetiteVue.reactive({
    count: 0,

    taskbar: {
        show: true, apps: [{ name: "terminal", running: false }], activeAppId: 0,
        toggle() {
            // window.activity.focus(0);
            // document.querySelector(":root").setAttribute("--taskbar-size", 0)
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
            mainMenu: { id: 1, toggle() { window.activity.focusedId = (window.activity.focusedId == this.id ? 0 : this.id); } },
            systemTray: {
                id: 2,
                toggle() { window.activity.focusedId = (window.activity.focusedId == this.id ? 0 : this.id); },
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
                toggle() { window.activity.focusedId = (window.activity.focusedId == this.id ? 0 : this.id); }
            },
            menuRight: 0 // 0=hide menu(#menu-right), 1=system-tray, 2=calender
        },
        brighness: 95.0,
    },
    workspace: { show: true },
    desktop: {
        id: -1,
        toggle() { window.activity.focusedId = this.id },
        items: [
            { name: 'wifi', icon: "svg/wifi-solid.svg", active: false },
            { name: 'bluetooth', icon: "svg/bluetooth-b.svg", active: false },
            { name: 'Airplane mode', icon: "svg/plane-solid.svg", active: false },
            { name: 'Battery saver', icon: "svg/battery-half-solid.svg", active: false },
            { name: 'Focus assist', icon: "svg/moon.svg", active: false },
            { name: 'Location', icon: "svg/map-marker-solid.svg", active: false },
        ]
    },
    apps: {
        id: 10,
        toggle() { window.activity.focusedId = this.id },
        items: [
            { name: 'wifi', icon: "svg/wifi-solid.svg", active: false },
            { name: 'bluetooth', icon: "svg/bluetooth-b.svg", active: false },
            { name: 'Airplane mode', icon: "svg/plane-solid.svg", active: false },
            { name: 'Battery saver', icon: "svg/battery-half-solid.svg", active: false },
            { name: 'Focus assist', icon: "svg/moon.svg", active: false },
            { name: 'Location', icon: "svg/map-marker-solid.svg", active: false },
        ]
    },
    toggleAirplane() {
        let status = this.layout.menu.systemTray.items[2].active;
        this.layout.menu.systemTray.items[0].active = this.layout.menu.systemTray.items[1].active = status;
        this.layout.menu.systemTray.items[2].active = !status;
    },

})

const store = PetiteVue.reactive({
    state: {
        count: 0, msg: null, updatedAt: Date()
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
            // store.saveState();
        }
    }
})

const components = {
    getData(url) {
        axios.get("/test/components/").then((response) => {
            console.log(response.data);

        }).catch((err) => {
            console.log(error);
        });
    }
}

store.getState();
PetiteVue.
    createApp({
        window,
        $delimiters: ['{', '}'],
        store
    }).mount("#windows11");
