export interface Plant {
    id: string;
    name: string;
    lastWateredDate: Date | null;
    imageUri?: string; // URI local de l'image (depuis la galerie ou caméra)
    frequency: number; // in days
}