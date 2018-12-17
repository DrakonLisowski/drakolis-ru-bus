export interface Command {
    getEventName(): string;
    isValid(object: object): boolean;
}
