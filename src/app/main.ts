import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import firebase from 'firebase';
import { FIREBASE_CONFIG } from './app.firebase.config';

platformBrowserDynamic().bootstrapModule(AppModule);
firebase.initializeApp(FIREBASE_CONFIG)