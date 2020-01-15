export class LocalStorageManager {
    set(obj) {
        const currentDoings = JSON.stringify(obj);
        localStorage.setItem('your_daily_doings', currentDoings);
    }
    get() {
        const currentDoings = localStorage.getItem('your_daily_doings');
        return JSON.parse(currentDoings);
    }
}