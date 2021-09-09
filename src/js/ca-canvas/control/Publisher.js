export default class Publisher {
    #state;
    #subscribers;

    constructor(state) {
        this.#state = state;
        this.#subscribers = [];
    }

    addSubscriber(sub) {
        if (!sub.update) {
            throw new Error("No update() method found.");
        }
        this.#subscribers.push(sub);
    }

    removeSubscriber(sub) {
        const i = this.#subscribers.indexOf(sub);
        if (i >= 0) {
            this.#subscribers.pop(i);
        }
    }

    publish() {
        this.#subscribers.forEach(sub => sub.update(this.#state));
    }

    update() {
        this.#state.update();
        this.publish();
    }
}
