import { Injectable } from '@angular/core';
import { User } from './user';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserService {

    store: Storage;

    constructor(private storage: Storage) {
        this.store = storage;
    }

    user: User = {
        id: "",
        refreshToken: "",
    };

    setUser(id: string, refreshToken: string) {
        this.user.id = id;
        this.user.refreshToken = refreshToken;
        this.store.set('refreshToken', refreshToken);
    }
    getUser() {
        return this.user;
    }
    


}