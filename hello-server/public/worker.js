'use strict';

// /* eslint-disable no-undef */
// importScripts('./webnn-polyfill/webnn-polyfill.js');
self.Module = {
  locateFile: function (s) {
      console.log(s);
      return s;
  },
  // Add this function
  onRuntimeInitialized: function() {
      test();
  }
};
// gets executed when everything is ready.
self.test = function() {
  // we may safely use self.data and self.Module now!
  console.log("loaded!"); // works!
}

importScripts('hello-world-simple.js');

// importScripts('third_party/mediapipe/camera_utils/camera_utils.js');
// var Module = {
//   onRuntimeInitialized: function () {
//     console.log("initialized");
//   }
// };
// importScripts('./tflite_model_runner_cc_simd.js');
// var userAgent = navigator.userAgent.toLowerCase();
// if (userAgent.indexOf(' electron/') > -1) {
//   navigator.isElectron = true
// }
// if(navigator.isElectron){
//   importScripts('../preload.js')
// }

// var modelRunnerResult;
// var modelRunner;
// Receive the message from the main thread
var MPGraph = new Module.GraphContainer();
// var MPGraph;
// const importObject = {
  
// };

onmessage = async (message) => {
  if (message) {
    switch (message.data.task) {
      // case 'loadModule':
      //   console.log("loading wasm module in worker.")
      //   const mod = message.data.mod;
      //   WebAssembly.instantiate(mod, importObject).then((instance)=>{
      //     instance.exports.exported_func();
      //   })
      //   MPGraph = new Module.GraphContainer();
      //   console.log("wasm module successfully loaded in worker.")
      //   break;
      case 'runWithMask':
        var graph = message.data.graph;
        var imagePointer = message.data.imagePointer;
        var maskPointer = message.data.maskPointer;
        var imgSize = message.data.imgSize;
        const ret = graph.runWithMask(imagePointer, maskPointer, imgSize);
        postMessage(ret);
        break;

      // case 'getFaceMeshLandMark':
      //   const result = message.data[1].getFaceMeshLandMark(message.data[2]);
      //   postMessage(result);
      //   break;

    }
  }
};
