export const GameplayTags = {
    Event: {
        Spawned: 'Event.Character.Spawned',
        Death: 'Event.Character.Death',
        MeleeHit: 'Event.Melee.Hit'
    },
    Ability: {
        Melee: 'Ability.Attack.Melee'
    },
    Status: {
        OnFire: 'Status.OnFire',
        Death: 'Status.Death',
        Dying: 'Status.Death.Dying',
        Dead: 'Status.Death.Dead'
    }
} as const;