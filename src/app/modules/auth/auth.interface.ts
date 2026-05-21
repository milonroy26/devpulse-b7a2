export type UserRole = 'contributor' | 'maintainer';

export interface IUser {
    id?: number;
    name: string;
    email: string;
    password?: string; // পাসওয়ার্ড অপশনাল রাখা হয়েছে যেন রেসপন্স বা সিলেক্ট করার সময় বাদ দেওয়া সহজ হয়
    role: UserRole;
    created_at?: Date;
    updated_at?: Date;
}