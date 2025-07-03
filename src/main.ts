import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Importaciones de Firebase existentes (Mantenerlas intactas)
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Solo importa 'personCircleOutline' si realmente lo utilizas.
// Si no lo utilizas, puedes eliminar estas dos líneas de importación y la llamada a addIcons().
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

if (environment.production) {
  enableProdMode();
}

// Registrar solo 'personCircleOutline' si se necesita.
// Si no lo necesitas, puedes comentar o eliminar este bloque.
addIcons({ 
  personCircleOutline 
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});