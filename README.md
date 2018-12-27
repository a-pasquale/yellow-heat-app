# Yellow Heat Ionic App
This Ionic app is part of the Yellow Heat vegetable oil burner monitoring system. The other components in this system are:

- [Yellow Heat Firmware](https://github.com/a-pasquale/yellow-heat)
- [Yellow Heat Firebase Realtime Database Functions](https://github.com/a-pasquale/yellow-heat-firebase-functions)

More information burner technology and installation for Yellow Heat vegetable oil burners is available at https://www.yellowheat.com/

## Ionic Framework

The Ionic framework enables developers to build cross-platform apps in one codebase with the web technologies including Typescript, HTML, and SCSS. More information about Ionic is available at [https://ionicframework.com/](https://ionicframework.com/).

## Getting Started

Install the Ionic framework:
```bash
$ sudo npm install -g ionic cordova
```

Clone this repository:
```bash
$ git clone https://github.com/a-pasquale/yellow-heat-app; cd yellow-heat-app
```

Test the app with:
```bash
$ ionic serve -lc
```

You can view the app in your browser:
![Screenshot](https://github.com/a-pasquale/yellow-heat-app/raw/master/docs/app_screenshot.png)

or using the Ionic Pro DevApp tool.

To build native versions:
```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

To build for Android, substitute ios for android.

