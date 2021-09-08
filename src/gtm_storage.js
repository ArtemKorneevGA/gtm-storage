class GtmTab {
  constructor() {
    this.tabsKey = "_gtm_tab_ids";
    this.tabKey = "_gtm_tab_id";
    this.tabLiveInterval = 30 * 1 * 1000; //30 seconds
    this.newTab = false;
    this.openTabs = JSON.parse(localStorage.getItem(this.tabsKey)) || {};
    this.tabId = sessionStorage.getItem(this.tabKey);
  }

  generateId() {
    var d = new Date().getTime(); //Timestamp
    return d.toString() + "_" + (Math.random() + 1).toString(36).substring(2);
  }

  clear() {

    return Object.keys(this.openTabs)
      .filter((key) => {
        try {
          return parseInt(this.openTabs[key].exp) > new Date().getTime();
        } catch (e) {
          return false;
        }
      })
      .reduce((obj, key) => {
        obj[key] = this.openTabs[key];
        return obj;
      }, {});
  }

  update() {
    this.openTabs = JSON.parse(localStorage.getItem(this.tabsKey)) || {};
    this.openTabs = this.clear();

    this.openTabs[this.tabId] = {
      exp: new Date().getTime() + this.tabLiveInterval,
    };
    localStorage.setItem(this.tabsKey, JSON.stringify(this.openTabs));
  }

  refresh() {
    //generate tabid
    if (this.tabId === null) {
      this.tabId = this.generateId();
      this.newTab = true;
      sessionStorage.setItem(this.tabKey, this.tabId);
      this.update();
    } else {
      this.update();
    }
  }

  isNewSession() {
    return Object.keys(this.openTabs).length === 1 && this.newTab;
  }
}

export default class GtmStorage {
  constructor() {
    this.storageKey = "_gtm_storage";
    this.tabRefreshInterval = 10 * 1000; //10 seconds
    this.tab = new GtmTab();
    this.tab.refresh();
    this.data = this.tab.isNewSession()
      ? this.clean()
      : this.getDataFromLocalStorage();

    //Init check tabs sync
    this.interval = setInterval(
      () => this.tab.refresh(),
      this.tabRefreshInterval
    );
  }

  refresh() {
    this.data = this.getDataFromLocalStorage();
  }

  getDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || {};
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  get(arg, def) {
    if (typeof this.data[arg] === "undefined") {
      return typeof def === "undefined" ? "" : def;
    }
    return this.data[arg];
  }

  set(obj, save = false) {
    for (const key in obj) {
      this.data[key] = obj[key];
    }
    if (save) this.save();
  }

  plus(key, save = false) {
    if (key in this.data) {
      this.data[key]++;
    } else {
      this.data[key] = 1;
    }
    if (save) this.save();
  }

  clean() {
    localStorage.removeItem(this.storageKey);
    return {};
  }
}

window.GtmStorage = GtmStorage;
