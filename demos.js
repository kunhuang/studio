var context;
var bufferLoader;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

function demo1() {
  bufferLoader = new BufferLoader(
    context,
    [
      'sound/demo_1.m4a',
      'sound/demo_2.m4a',
    ],
    finishedLoading
  );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(context.destination);
  source2.connect(context.destination);
  source1.start(0);
  source2.start(0);
}


function demo2(){
  function loadSounds(obj, soundMap, callback) {
    // Array-ify
    var names = [];
    var paths = [];
    for (var name in soundMap) {
      var path = soundMap[name];
      names.push(name);
      paths.push(path);
    }
    bufferLoader = new BufferLoader(context, paths, function(bufferList) {
      for (var i = 0; i < bufferList.length; i++) {
        var buffer = bufferList[i];
        var name = names[i];
        obj[name] = buffer;
      }
      if (callback) {
        callback();
      }
    });
    bufferLoader.load();
  }

  function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    if (!source.start)
      source.start = source.noteOn;
    source.start(time);
  }

  var BUFFERS = {}
  loadSounds(
    BUFFERS, 
    {
      kick: 'sound/kick.wav',
      snare: 'sound/snare.wav',
      hihat: 'sound/hihat.wav',
    },
    playdemo2,
  );

  function playdemo2() {
    var kick = BUFFERS.kick;
    var snare = BUFFERS.snare;
    var hihat = BUFFERS.hihat;

    // We'll start playing the rhythm 100 milliseconds from "now"
    var startTime = context.currentTime + 0.100;
    var tempo = 80; // BPM (beats per minute)
    var eighthNoteTime = (60 / tempo) / 2;

    // Play 2 bars of the following:
    for (var bar = 0; bar < 2; bar++) {
      var time = startTime + bar * 8 * eighthNoteTime;
      // Play the bass (kick) drum on beats 1, 5
      playSound(kick, time);
      playSound(kick, time + 4 * eighthNoteTime);

      // Play the snare drum on beats 3, 7
      playSound(snare, time + 2 * eighthNoteTime);
      playSound(snare, time + 6 * eighthNoteTime);

      // Play the hi-hat every eighthh note.
      for (var i = 0; i < 8; ++i) {
        playSound(hihat, time + i * eighthNoteTime);
      }
    }
  }
};