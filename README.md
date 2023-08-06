# OpenNetLab Edu Front End

## Get Started

Install nodejs **v8.12.0** first.

### Linux

```bash
npm install
# we use webpack DllReference to decrease the build time,
# this command only needs execute once unless you upgrade the package in build/webpack.dll.conf.js
export NODE_ENV=development 
npm run build:dll

# the dev-server will set proxy table to your backend
export TARGET=http://Your-backend

# serve with hot reload at localhost:8080
npm run dev
```

### Windows

```bash
npm install
# we use webpack DllReference to decrease the build time,
# this command only needs execute once unless you upgrade the package in build/webpack.dll.conf.js
set NODE_ENV=development 
npm run build:dll

# the dev-server will set proxy table to your backend
set TARGET=http://Your-backend

# serve with hot reload at localhost:8080
npm run dev
```

## LICENSE

[MIT](http://opensource.org/licenses/MIT)
