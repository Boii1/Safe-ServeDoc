// Requires
const http = require("http");
const connect = require("connect");
const auth = require("basic-auth");
const fs = require("fs");
const requestIp = require("request-ip");
const ip6addr = require("ip6addr");
const geoip = require("geoip-lite");
const CryptoJS = require("crypto-js");

// Connect For Use w/ IP Checker
const app = connect();

// IP Checker Hook
app.use(requestIp.mw());

// Enable IP Whitelisting
const IPRequired = false;

// Global IP Placeholder
let ip;

// Read Sensitive Data To Server But Not Client
let file = fs.readFile("./file.txt", (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	file = data;
});

// List Users (To Be Read From File) [UsernameSHA256, PasswordSHA256, IPv4]
let users = [
	["SHA-256 Username", "SHA-256 Password", "IPv4 Address"],
	["SHA-256 Username", "SHA-256 Password", "IPv4 Address"],
	["SHA-256 Username", "SHA-256 Password", "IPv4 Address"]
];

// Global Variable For Logging
let log = "";

// Log Date Global
let logname = "";

// Serve Data If IP/Username/Password Match
app.use((req, res) => {
	// Parse IP As IPv4
	let addr = ip6addr.parse(req.clientIp);
	ip = addr.toString({
		format: "v4"
	});
	// Locate IP For Logging Purposes
	let loc = JSON.stringify(geoip.lookup(ip));

	// Denied Variable For Logging
	let denied = false;

	// Check Credentials (Optional IP Checking)
	let credentials = auth(req);
	if (!credentials || !check(credentials.name, credentials.pass)) {
		// Auth Failed
		denied = true;
		res.statusCode = 401;
		res.setHeader("WWW-Authenticate", "Basic realm='Login'");
		res.end("Denied");
	} else {
		// Auth Success
		denied = false;

		// Serve Data
		res.end(file);
	}
	// Prep/Write Log
	try {
		let d = new Date();
		logname = "Log-" + (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear() + ".txt";
		// Check If Log Exists
		if (fs.existsSync(logname)) {
			// Read Log To Append To
			log = fs.readFileSync("./logs/" + logname, "utf8");
		} else {
			try {
				// Create Log File Since It Doesn't Exist
				fs.writeFileSync("./logs/" + logname, logname + "\n\n");
			} catch (err) {
				console.log("Can't write file.", err);
			}
		}
		// Append To Log
		log += d.toLocaleTimeString() + ":\nUsername: " + credentials.name + "\nUsername SHA256: " + CryptoJS.SHA256(credentials.name) + "\nPassword SHA256: " + CryptoJS.SHA256(credentials.pass) + "\nIP: " + ip + "\nDenied: " + denied + "\nLocation: " + loc + "\n\n";
		// Write To Log
		fs.writeFileSync("./logs/" + logname, log, "utf8");
	} catch (err) {
		console.error(err);
	}
})

// Auth Check
const check = (name, pass) => {
	// Check Every User Account
	for (let i = 0; i < users.length; i++) {
		// Username/Password
		if (CryptoJS.SHA256(name) == users[i][0] && CryptoJS.SHA256(pass) == users[i][1]) {
			// IP Check Only If IPRequired = true
			if (IPRequired && ip != users[i][2]) {
				// Return False If IP Check Failed
				return false;
			} else {
				// Return True If Username/Password Succeeded And Optional IP Check Succeeded
				return true;
			}
		}
	}
	// One Or More Checks Failed
	return false;
}

// Listen App On Port
http.createServer(app).listen(7071);
