import { supabase } from '../supabase'
import type { Database } from './types'
import type { Generator, Profile } from './types'

// Profile functions
export async function getProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) throw error
    return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .single()

    if (error) throw error
    return data
}

// Generator functions
export async function createGenerator(generator: Omit<Generator, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
        .from('generators')
        .insert([generator])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getGeneratorsByOwner(ownerId: string) {
    const { data, error } = await supabase
        .from('generators')
        .select('*')
        .eq('owner_id', ownerId)

    if (error) throw error
    return data as Generator[]
}

export async function getAllAvailableGenerators() {
    const { data, error } = await supabase
        .from('generators')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as Generator[]
}

// Auth helper functions
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}