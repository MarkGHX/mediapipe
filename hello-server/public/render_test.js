import { FACEMESH_TESSELATION } from './config.js';
// import './hello-world-simple.js';


class State {
    constructor() {
        this.canvasCtx = null;
        this.canvasCtxGL = null;
        this.imgPointer = null;
        this.maskPointer = null;
        this.imgSize = 0;
        this.graph = null;
        this.imgChannelsCount = 4;
        this.detectFace = false;
        this.selfieSegmentation = false;
        this.useBackgroundImage = false;
        this.useBackgroundColor = false;
        this.showFaceMesh = false;
        this.maskRawData = null;
        this.maskCtx = null;
        this.background = null;
    }

    getMaskRawData() {
        return this.maskRawData;
    }
};

const state = new State();

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const MASK = {
    FACE_DETECTION: 1,
    SELFIE_SEGMENTATION: 2
};

function runGraph(state, videoElem, Module) {
    // state.canvasGL = document.querySelector("#glCanvas");
    if (!state.graph) {
        // console.log(Module);
        state.graph = new Module.GraphContainer();
    }
    const camera = new Camera(videoElement, {
        onFrame: async () => {
        //   await faceDetection.send({image: videoElement});
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(
                videoElement, 0, 0, canvasElement.width, canvasElement.height);
            
            if (state.imgPointer) {
                    Module._free(state.imgPointer);
            }
    
            const rawData = canvasCtx.getImageData(0, 0, 640, 480);
            const rawDataSize = state.imgChannelsCount * rawData.width * rawData.height;
    
            state.imgSize = rawDataSize;
            state.imgPointer = Module._malloc(state.imgSize);
    
            Module.HEAPU8.set(rawData.data, state.imgPointer);
    
            const ret = state.graph.runWithMask(state.imgPointer, state.imgPointer, state.imgSize);
    
            if (state.graph.boundingBoxes.size() > 0) {
            drawingUtils.drawRectangle(
                canvasCtx, state.graph.boundingBoxes.get(0),
                {color: 'blue', lineWidth: 4, fillColor: '#00000000'});
            // drawingUtils.drawLandmarks(canvasCtx, results.detections[0].landmarks, {
            //     color: 'red',
            //     radius: 5,
            // });
            }
            canvasCtx.restore();
    
    
    
        },
        width: 1280,
        height: 720
    });
    camera.start();
}

window.onload = function () {

    const videoElement = document.getElementById('input_video');

    document.getElementById("btnRunGraph").onclick = function () {
        document.getElementById("btnRunGraph").style.display = "none";
        runGraph(state, videoElement, Module);
    }
}