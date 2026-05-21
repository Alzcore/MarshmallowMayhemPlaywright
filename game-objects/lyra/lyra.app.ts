import { SpecterWorld } from "@specter/test";
import { MainMenuObject } from "./main-menu.object";
import { ExperienceSelectionScreenObject } from "./experience-selection-screen.object";
import { LyraMatch } from "./lyra-match";
import { HeroCharacterObject } from "./hero-character.object";

export class LyraApp {
    readonly mainMenu: MainMenuObject
    readonly experienceSelectionScreen: ExperienceSelectionScreenObject
    readonly gamePhaseSubsystem: LyraMatch
    readonly character: HeroCharacterObject
    constructor(readonly world: SpecterWorld) {
        this.mainMenu = new MainMenuObject(world)
        this.experienceSelectionScreen = new ExperienceSelectionScreenObject(world)
        this.gamePhaseSubsystem = new LyraMatch(world)
        this.character = new HeroCharacterObject(world)
    }
}