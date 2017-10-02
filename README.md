# README #

## INTRODUCTION ##

There are two alternative procedures for building VocBench3: with Maven and with Npm.
We suggest to follow the one with Maven since it does not require Npm to be installed (it is downloaded as a plugin dependency and run by Maven during the building process), requires less interaction steps and the content of its build is a superset of the one built by using Npm.

##	BUILDING WITH MAVEN ##

### Prerequisites ###

Maven installed.

### Building ###

Execute the command
```
mvn clean install
```
from the root of the project (/vocbench3, where the pom.xml file is located). This command will generate three folders: 

*	`/node_modules`: contains the dependencies of the application;
*	`/dist`: contains the static assets of the front-end;
*	`/target`: contains the generated vocbench3-<versionnumber\>.war web archive.

The directory `/dist` is the distribution that contains the static assets of the front-end generated by the npm build procedure. This distribution can be deployed on any http server.
Alternatively, the war file can be deployed on the karaf server embedded with the [Semantic Turkey](http://semanticturkey.uniroma2.it/) system (inside the `/deploy` directory) or on any application server.

##	BUILDING WITH NPM ##

### Prerequisites ###
Required [Node.js and npm](https://nodejs.org/en/download).
Verify that you are running at least node __v6.9.x__ and npm __3.x.x__ by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

### Installing the dependencies ###

Execute the command below:
```
npm install  # or just: npm i
```

### Building ###

After having installed the dependencies, execute `npm run build` to create a `dist` folder, a distribution deployable in any http server (tested with Tomcat 7.0.52 and 8.0.27).
In `config/webpack.prod.js` it is possible to change the name of the produced folder simply by changing the `path` property in the `output` object
```
output: {
    path: helpers.root('dist'),
    ...    
},
```

## DEPLOYING AND RUNNING THE SYSTEM ##

### Prerequisites ###

[Semantic Turkey](http://semanticturkey.uniroma2.it/) is necessary for VocBench to operate. VB3 is actually a web client for ST.

### Different Deployments

In order to run VocBench 3, it is possible to:

* deploy the war file produced through the Maven build procedure inside the `/deploy` directory of the Karaf distribution of Semantic Turkey. Then run Semantic Turkey and access VocBench at `http://localhost:1979/vocbench3`
* deploy the `dist` directory (produced by any of the two described build procedures) on any HTTP server. Run Semantic Turkey and access VocBench at the address/port determined by the chosen HTTP server.
* run without building, as detailed here below (still ST must be running)

In alternative to building a distribution for deployment in a web/application server, after installing the dependencies (as explained above), it is possible to serve the application directly from sources using a Node.js server (webpack-dev-server). 
To accomplish this, after the install command, execute the following command:
```
npm start
```
In this case the application will respond at 
```
http://localhost:8080
```
unless you have changed the port in `package.json` `"start": "webpack-dev-server --inline --progress --port 8080"`



## FURTHER CONFIGURATION ##

### Prerequisites ###
The custom settings below are not possible when running VocBench from inside the Karaf container as in the standalone distribution. You might want to have VocBench installed as a separate web application in a dedicated server, as explained in the previous sections.

In *vbconfis.js* (under *src/* of the source package, or under the root folder of the built distribution) it is possible to configure the *SemanticTurkey* host resolution.
By default *VocBench3* resolves the IP address of the *SemanticTurkey* server dynamically by using the same IP address of the *VocBench* host machine.
This is determined by the configuration property `dynamic_st_host_resolution` (by default set to `true`).
```
/**
 * Tells if the system should use the IP of the machine which is serving the VB3 content to query the ST server.
 * N.B. This can be left to true only if VocBench3 and SemanticTurkey are running on the same machine,
 * otherwise, set this to false and change the value of the st_host parameter
 */
var dynamic_st_host_resolution = true;
```
In case *VocBench3* and *SemanticTurkey* run on two different hosts, it is possible to provide the *SemanticTurkey* IP address statically by setting the previous property to `false` and modifying 
the property `st_host` with the address of the target host (the property `st_host` is ignored if `dynamic_st_host_resolution` is `true`).
```
var dynamic_st_host_resolution = false;
/**
 * IP address/logical host name of the machine which hosts SemanticTurkey.
 * Configure this parameter only if dynamic_st_host_resolution is set to false.
 */
var st_host = "127.0.0.1";
```
It is also possible to change the port where SemanticTurkey is listening (the default is `1979`) by changing `st_port` property.
```
/**
 * Port where SemanticTurkey server is listening
 */
var st_port = "1979";
```