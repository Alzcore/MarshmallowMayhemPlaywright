import { SpecterWorld, WidgetLocator } from "@specter/test";

export class ExperienceSelectionScreenObject {
    readonly root: WidgetLocator
    readonly quickPlayButton: WidgetLocator
    constructor(private world: SpecterWorld) {
        this.root = world.widget('W_ExperienceSelectionScreen')
        this.quickPlayButton = this.root.getChild("QuickplayButton")
    }
}