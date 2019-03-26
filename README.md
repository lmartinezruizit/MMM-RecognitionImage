# MMM-RecognitionImage

This a module for the MagicMirror² to recognition images.

## Installation

1. Navigate into your MagicMirror's `~/MagicMirror/modules` folder and execute `git clone https://github.com/lmartinezruizit/MMM-RecognitionImage.git`. A new folder will appear navigate into it.
2. Execute `npm install` in `~/MagicMirror/modules/MMM-RecognitionImage` to install the node dependencies.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'mmmbicimad',
            position: 'top_left',
            config: {
                confidence_threshold: 5,
                useUSBCam: false,
                users: [],
                defaultClass: "default",
                everyoneClass: "everyone"
            },
        }
    ]
}
```
```
In order for this module to do anything useful you have to assign custom classes to your modules. The class default (if you don't change it) is shown if no user is detected or a stranger. The class everyone (if you don't change it) is shown for all users. To specify modules for a certain user, use their name as classname.
```shell
{
    module: 'example_module',
    position: 'top_left',
    //Set your classes here seperated by a space.
    //Shown for all users
    classes: 'default everyone'
},
{
    module: 'example_module2',
    position: 'top_left',
    //Only shown for name1
    classes: 'name1'
}
```
