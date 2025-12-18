export interface Plant {
    id: string;
    name: string;
    lastWateredDate: Date;
    imageUrl?: string;
    frequency: number; // in days
}