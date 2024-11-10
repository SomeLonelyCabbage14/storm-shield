// Database enums
export type UserType = 'owner' | 'renter'
export type GeneratorCondition = 'new' | 'like-new' | 'good' | 'fair'

// Core interfaces
export interface Profile {
    id: string
    email: string
    user_type: UserType
    full_name: string | null
    is_setup_complete: boolean
    created_at: string
    updated_at: string
}

export interface Generator {
    id: string
    owner_id: string
    model: string
    wattage: number
    condition: GeneratorCondition
    description: string | null
    daily_rate: number
    address: string
    city: string
    state: string
    zip_code: string
    is_available: boolean
    created_at: string
    updated_at: string
}

// Database type
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: Profile
                Insert: Omit<Profile, 'created_at' | 'updated_at'>
                Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
            }
            generators: {
                Row: Generator
                Insert: Omit<Generator, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Generator, 'id' | 'created_at' | 'updated_at'>>
            }
        }
    }
}