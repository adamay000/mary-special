var vid = document.getElementById('videoel');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

//stats = new Stats();
//stats.domElement.style.position = 'absolute';
//stats.domElement.style.top = '0px';
//document.getElementById('container').appendChild( stats.domElement );

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

// check for camerasupport
if (navigator.getUserMedia) {
  // set up stream

  // 接続されているカメラとマイクのMediaStreamオブジェクトを取得する
  navigator.mediaDevices.enumerateDevices().then(function(sourcesInfo) {
  // 取得できたカメラとマイクを含むデバイスからカメラだけをフィルターする
    var videoSourcesArray = sourcesInfo.filter(function(elem) {
           return elem.kind == 'videoinput';
             });
    console.log(videoSourcesArray);
  });

  // 本番で使うカメラのDeviceIDを思いっきり指定
  // もし見つからなければ、FaceTimeなどのデフォルトのカメラが開く
  videoSelector = {
    video: {
      optional: [{
        sourceId: "e4240501252cde8a574050c7b6c8a82b4497d79f1597b4967fb90878abde8cff"
      }]
    },
    audio: false
  }

  navigator.getUserMedia(videoSelector, function( stream ) {
    console.log(stream);
    if (vid.mozCaptureStream) {
      vid.mozSrcObject = stream;
    } else {
      vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    }
    vid.play();
  }, function() {
    alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
  });
} else {
  alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
}

function startVideo() {
  // start video
  vid.play();
  // start tracking
  ctrack.start(vid);
  // start loop to draw face
  drawLoop();
}

// 元のサンプルではボタンを押すと開始だったけど、おもむろに開始する
startVideo();

// var宣言しないでローカルスコープで宣言したほうがいいのかな？
function drawLoop() {
  requestAnimFrame(drawLoop);
  overlayCC.clearRect(0, 0, 400, 300);
  var positions = ctrack.getCurrentPosition();
  if (positions && positions[62] && ctrack.getScore() > 0.5 ) {
    ctrack.draw(overlay);
    var pos = positions[62].concat();
    x = (((1.0 - pos[0] * 2 / vid.videoWidth) - 0.5) * 1.0 + 0.5);
    x = Math.max(Math.min(1, x), 0);
    x = x * window.innerWidth;
    y = ((pos[1] * 2 / vid.videoHeight - 0.5) * 1.0 + 0.5); 
    y = Math.max(Math.min(1, y), 0) * window.innerHeight;

    // 顔の大きさによってscalarの値を変更する
    faceWidth = Math.abs(positions[13][0] - positions[1][0]);
    scalarX = 2.0 + (300.0 - 2.0) * (faceWidth-50) / (200.0-50);
    //parallax.scalar(scalarX, 10);

    // カスタムeventの発火
    var faceMoveEvent = document.createEvent("MouseEvents");
    // https://gist.github.com/callmephilip/3517765
    faceMoveEvent.initMouseEvent("mousemove",
        true,
        false,
        window,
        1,
        x,
        y,
        x,
        y,
        false,
        false,
        false,
        false,
        0,
        null);

    this.dispatchEvent(faceMoveEvent);
  }
}

// update stats on every iteration
//document.addEventListener('clmtrackrIteration', function(event) {
//  stats.update();
//}, false);
