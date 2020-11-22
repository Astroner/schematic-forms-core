
export interface Subscription {
    unsubscribe: VoidFunction
}

type updateFunction = (size: number) => void;

export class AdvancedObservable<MessageType> {

    private subs: Array<(message: MessageType) => void> = [];

    public onSubscribe?: updateFunction;
    public onUnsubscribe?: updateFunction;

    public update(message: MessageType) {
        this.subs.forEach(i => i(message))
    }

    subscribe(cb: (message: MessageType) => void): Subscription {
        this.subs.push(cb);
        this.onSubscribe && this.onSubscribe(this.subs.length);
        return {
            unsubscribe: () => {
                this.subs.splice(this.subs.indexOf(cb), 1);
                this.onUnsubscribe && this.onUnsubscribe(this.subs.length)
            }
        }
    }

    size(): number {
        return this.subs.length
    }
}