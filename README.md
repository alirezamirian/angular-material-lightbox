# Angular Material Extensions - Lightbox
Lightbox component on top of angular material.

## Demo
https://alirezamirian.github.io/angular-material-lightbox/demo/
## Usage
Add dependency:
``` js
angular.module("yourApp", ['ame.lightbox'])
```
### Service
Use the `ameLightbox` service:
```js
angular.module("yourApp")
  .controller("SomeController", function(ameLightbox){
    var imageList = ['https://placehold.it/350x150', 'https://placehold.it/250x100'];
    var options = {};
    ameLightbox.show(imageList, options);
  });
```
### Directive
TODO

### Options (default values)
```js
{
  initialIndex: 0, // initial image to show
  targetEvent: undefined, // to be passed to $mdDialog
  buttonClass: "", // a list of classes to be added to navigation buttons
  keyboard: true, // keyboard navigation
  showDots: true, // whether to show dots or not
  backdropOpacity: null, // default to $mdDialog defaults
}
```


## Installation
```bash
bower install ame-lightbox --save
```

## Build 
```bash
npm install
gulp build
```

## TODO
- [ ] Add directive
- [ ] make it fullscreen on small screens
- [ ] change dots size and functionality in small screens
