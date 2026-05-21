import { SpecterWorld, WidgetLocator } from "@specter/test";

export class MainMenuObject {
    readonly root: WidgetLocator
    readonly startButton: WidgetLocator
    constructor(private world: SpecterWorld) {
        this.root = world.getWidgetByClass('W_LyraFrontEnd')
        this.startButton = this.root.getChild("StartGameButton")
    }
}