import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable()
export class UserService {

    user: User = {
        id: ""
    };

    setUser(id: string) {
        this.user.id = id;
    }
    getUser() {
        return this.user;
    }
    
    constructor() {}

}