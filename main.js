document.querySelector('#playButton').addEventListener('click', () => playNoise())

// Pink noise filter coefficients (approximated)
// These coefficients are adapted from standard pink noise filter approximations
// Reference: Paul Kellet's pink noise filter
const feedforward = [0.049922035, -0.095993537, 0.050612699, -0.004408786];
const feedback = [1.0, -2.494956002, 2.017265875, -0.522189400];


let currentNoise = undefined
let playing = false

function playNoise() {
  const time = 60 * 60


  if (playing) {
    currentNoise.stop()
    document.querySelector('#playButton').innerHTML = "Start"
    playing = false
    return
  } {
    document.querySelector('#playButton').innerHTML = "Stop"
  }

  const audioContext = new AudioContext();

  const pinkFilter = audioContext.createIIRFilter(feedforward, feedback);

  const bufferSize = audioContext.sampleRate * 1000
  
  const noiseBuffer = new AudioBuffer({
    length: bufferSize,
    sampleRate: audioContext.sampleRate,
  })
  
  const data = noiseBuffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = new AudioBufferSourceNode(audioContext, {
    buffer: noiseBuffer,
  });
  
  currentNoise = noise;
  noise.connect(pinkFilter).connect(audioContext.destination);
  noise.start(0,0,time);
  playing = true
}
