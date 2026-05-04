export type Vector3D = { X: number; Y: number; Z: number };

export function calculateDistance(vec1: Vector3D, vec2: Vector3D): number {
    const dx = vec2.X - vec1.X;
    const dy = vec2.Y - vec1.Y;
    const dz = vec2.Z - vec1.Z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}