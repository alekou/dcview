import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .then((module) => {
//     const appRef = module.injector.get(ApplicationRef);
//     const appComponent = appRef.components[0];
//     enableDebugTools(appComponent);
//   })
//   .catch((err) => console.error(err));
