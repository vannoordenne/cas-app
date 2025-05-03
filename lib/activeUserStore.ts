import { create } from 'zustand'
import type { User } from './store'
import type { StateCreator } from 'zustand'

type ActiveUserStore = {
  user: User | null
  setUser: (user: User | null) => void
}

export const useActiveUser = create<ActiveUserStore>((set: Parameters<StateCreator<ActiveUserStore>>[0]) => ({
  user: null,
  setUser: (user: User | null) => set({ user })
})) 