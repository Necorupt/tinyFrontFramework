export default class Scope {
    $$watchers = [];
    $$listners = {};

    $digest() {
        const self = this;
        let newValue, oldValue;

        for (let item of this.$$watchers) {
            newValue = item.watchFn(self);
            oldValue = item.last;

            if (newValue !== oldValue) {
                item.last = newValue;
                try {
                    item.listnerFn(newValue, oldValue === this.initWatchVal() ? newValue : oldValue, self);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }

    initWatchVal() {

    }

    $watch(watchFn, listenerFn) {
        let watcher = {
            watchFn: watchFn,
            listnerFn: listenerFn || function () { },
            last: this.initWatchVal()
        }

        this.$$watchers.push(watcher);
    }

    $eval(expr, locals) {
        return expr(this, locals);
    }

    $apply(expr) {
        try {
            return this.$eval(expr);
        }
        finally {
            this.$digest();
        }
    }

    $$fireEventOnScope(eventName, args) {
        let listners = this.$$listners[eventName] || [];

        for (let i = 0; i < listners.length; i++) {
            console.error(listners[i]);
            if (listners[i] === null) {
                listners.splice(i, 1);
            } else {
                try {
                    listners[i].apply(null, args);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }

    $emit(eventName) {
        let event = { name: eventName };
        let arg = (Array.from(arguments)).slice(1);

        this.$$fireEventOnScope(eventName, arg);

        return [event].concat(arg);
    }

    $on(eventName, listner) {
        let listners = this.$$listners[eventName];
        if (!listners) {
            this.$$listners[eventName] = listners = [];
        }

        listners.push(listner);
    }
}