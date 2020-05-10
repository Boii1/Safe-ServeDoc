# Safe-ServeDoc
*Uses `Node.JS` code to serve a document safely and log data securely.*

# Usage
1. Place `file.txt` in `__dirname`.
2. Create `logs` folder in `__dirname`.
3. Run `npm init` in `__dirname` with default settings.
4. Install any requisites needed you don't have installed already. You can check the **requires** in `index.js` for them at the top.
5. Optionally use `nodemon` if you are updating a lot.
6. Optionally change `file.txt` to a file `nodemon` will automatically restart for if you plan to update it often.
7. Run `npm start`.

# Features
 - Allows you to service a document only when user matches credentials list.
 - Has decent logging w/ IP/GeoLocation.
 - IP ties to account if enabled. See `let IPRequired = false;` in file.
 - Denies other requests but still logs them.

# Bugs
 - Will reference `credentials.name` before it can grab the auth data. (It may show up in console).
 - Log sometimes is empty but will be written when someone attempts to log. (May be side effect of above bug).

# Log Entry Example
```
4:19:05 PM:
Username: browserling
Username SHA256: 8b98cf0f130d42d222d49b47138461d0393c44a21e958c9f3e5ce99854407888
Password SHA256: 9f735e0df9a1ddc702bf0a1a7b83033f9f7153a00c29de82cedadc9957289b05
IP: 167.114.101.64
Denied: true
Location: {"range":[2809292032,2809292287],"country":"CA","region":"QC","eu":"0","timezone":"America/Toronto","city":"Montreal","ll":[45.5063,-73.5794],"metro":0,"area":1000}```
