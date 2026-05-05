import { defineStore } from 'pinia';
import { type Users } from '@/types';

export const useAuthStore = defineStore('authenticationStore', {
    state: () => ({
        user: undefined as string | undefined,
        token: undefined as string | undefined
    }),

    getters: {
        getUserName: (state) => {
            return state.user;
        }
    },

    actions: {
        login(name: string, t: string) {
            this.user = name; this.token = t;
        }
    }
})