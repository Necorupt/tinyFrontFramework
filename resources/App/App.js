
export default {
    name: "App",
    template: `
        <div class="counter">
            <h1>Counter {{ counter }}</h1>

            <button @click="increment()">click me</button>
        </div>`,

    data: {
        counter: 1,
    },
    onCreate() {
        console.log("created counter:", this.data.counter);
    },
    onMount() {
        console.log("mounted");
    },
    methods: {
        increment() {
            this.counter++;
        }
    }
};