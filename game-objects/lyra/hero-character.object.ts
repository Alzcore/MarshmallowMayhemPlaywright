import { ActorLocator, SpecterWorld, WidgetLocator } from "@specter/test";

export class HeroCharacterObject {
    readonly characterLocator: ActorLocator
    readonly local: ActorLocator
    constructor(private world: SpecterWorld) {
        this.characterLocator = world.getByClass('B_Hero_ShooterMannequin').asActor()
        this.local = this.characterLocator.isLocallyControlled()

    }
}