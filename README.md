# Notes .. Vue 3 + TypeScript + Vite

## Installation 

```` console
npm install
````

### locally-trusted development certificates

```` console
mkcert install
mkdir ssl
cd ssl
mkcert localhost
````

### server

https://script.google.com/home

paste code : ./server/apps_script.gs
deploy

### set environment

App.vue :
 password : any string
 salt : crypto.lib.WordArray.random(128 / 8) //.toString()
 webUrl : Google Apps Script URL

```` javascript
let webUrl = "https://script.google.com/macros/s/...../exec"
const password = "...Password..."
const salt = "01234567890abcdef01234567890abcd" // crypto.lib.WordArray.random(128 / 8) //.toString()
````

### debug

```` console
npm run dev
````

### build

```` console
npm run build
````

## Debug [iPhone]

### host

```` console
npm run dev -- --host
````


```` console
mkcert -CAROOT
C:\Users\...\AppData\Local\mkcert
````

copy rootCA.pem to iPhone

### iPhone

install rootCA.pem

https://www.ibm.com/docs/en/mpf/7.1.0?topic=certificates-installing-root-ca-ios

1. You have the certificate file on the device, click the file to allow the iOS system to install the certificate.
2. Check that the certificate was properly installed under Settings > General > Profiles > Configuration Profiles.

https://web.dev/articles/codelab-apple-touch-icon

1. Open Safari for iOS.
2. Open the URL of your example app. This is the URL like https://192....../ that you noted earlier.
3. Tap Share Apple Share Button > Add to Home Screen. You'll probably have to swipe left to see this option.
3. Tap Add.
