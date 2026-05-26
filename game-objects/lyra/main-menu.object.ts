import { SpecterWorld, WidgetLocator } from "@specter/test";

export class MainMenuObject {
    readonly root: WidgetLocator
    readonly startButton: WidgetLocator
    readonly optionsButton: WidgetLocator
    constructor(private world: SpecterWorld) {
        this.root = world.widget('W_LyraFrontEnd')
        this.startButton = this.root.getChild("StartGameButton").first()
        this.optionsButton = this.root.getChild("OptionsButton")
    }
}