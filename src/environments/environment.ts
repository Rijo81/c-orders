// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyDLGYjhvPyEelHky_KdsGHlZ0Jf6_ggmqM",
    authDomain: "gseapp-requests.firebaseapp.com",
    projectId: "gseapp-requests",
    storageBucket: "gseapp-requests.firebasestorage.app",
    messagingSenderId: "799544385416",
    appId: "1:799544385416:web:6b521e6ef94b98a0ad643d",
    measurementId: "G-ZHELE4NJXY"
  },
  supabaseUrl: 'https://imfolqngdrsymfotwiib.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZm9scW5nZHJzeW1mb3R3aWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjE3MzYsImV4cCI6MjA1NzM5NzczNn0.RyL2blevo_8Jt1lUbAzs1YuB5OY_3Oux3GDNjZvhCiQ',
   emailjs: {
    serviceId: 'service_1vwb5o5',
    templateIdUser: 'template_52mb6lr',
    templateIdAdmin: 'template_li9fghg',
    publicKey: 'WIeiRn9GhuL72YaNi'
  },
  adminPhone: '18099028301'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
