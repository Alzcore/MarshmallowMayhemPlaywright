import { ActorLocator, SpecterWorld, WidgetLocator } from "@specter/test";

export class HeroCharacterObject {
    readonly characterLocator: ActorLocator
    readonly local: ActorLocator
    constructor(private world: SpecterWorld) {
        this.characterLocator = world.actor('B_Hero_ShooterMannequin')
        this.local = this.characterLocator.isLocallyControlled()

    }
}