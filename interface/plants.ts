export interface Plant {
    id: string;
    name: string;
    lastWateredDate: Date | null;
    imageUrl?: string;
    frequency: number; // in days
}