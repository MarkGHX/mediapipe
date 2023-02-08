
build:
	bazel build -c opt --verbose_failures //hello-world:hello-world-simple --config=wasm
run:
	rm -f -r hello-server/public/hello-world-simple.js hello-server/public/hello-world-simple.wasm hello-server/public/hello-world-simple.data
	cp -r bazel-out/wasm-opt/bin/hello-world/hello-world-simple.js hello-server/public/
	cp -r bazel-out/wasm-opt/bin/hello-world/hello-world-simple.wasm hello-server/public/
	cp -r bazel-out/wasm-opt/bin/hello-world/hello-world-simple.data hello-server/public/
	./scripts/runserver.sh
buildtest:
	bazel build -c opt --define MEDIAPIPE_DISABLE_GPU=1 mediapipe/examples/desktop/face_detection:face_detection_full_range_cpu
runtest:
	GLOG_logtostderr=1 bazel-bin/mediapipe/examples/desktop/hand_tracking/hand_tracking_cpu \
  --calculator_graph_config_file=hello-world/face_detection_tflite_test.pbtxt