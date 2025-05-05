function mapRange(value, oldMin, oldMax, newMin, newMax) {
	return ((value - oldMin) * (newMax - newMin) / (oldMax - oldMin)) + newMin;
  }

if (localStorage.key('volume')) {
	document.querySelector('#volume').value = localStorage.getItem('volume')
}
if (localStorage.key('lowpass')) {
	document.querySelector('#lowpass').value = localStorage.getItem('lowpass')
}

document.querySelector('#playButton').addEventListener('click', () => playNoise())

document.querySelector('#volume').addEventListener('change', () => {
	const value = parseInt(document.querySelector('#volume').value)
	localStorage.setItem('volume', value.toString())
	if (gain) {
		gain.gain.value = mapRange(value, 0, 100, 0, 2)
	}
})

document.querySelector('#lowpass').addEventListener('change', () => {
	const value = parseInt(document.querySelector('#lowpass').value)
	localStorage.setItem('lowpass', value.toString())
	if (lowpass) {
		lowpass.frequency.value = value
	}
})
// Pink noise filter coefficients (approximated)
// These coefficients are adapted from standard pink noise filter approximations
// Reference: Paul Kellet's pink noise filter
const feedforward = [0.049922035, -0.095993537, 0.050612699, -0.004408786];
const feedback = [1.0, -2.494956002, 2.017265875, -0.522189400];

let currentNoise = undefined
let playing = false

let lowpass = undefined
let gain = undefined

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

  lowpass = audioContext.createBiquadFilter();
  lowpass.type = 'lowpass'
  
  if (!localStorage.key('lowpass')) {
    localStorage.setItem('lowpass', '150')
  }
  
  lowpass.frequency.value = parseInt(localStorage.getItem('lowpass'))
  
  if (!localStorage.key('gain')) {
    localStorage.setItem('volume', '50')
  }
  
  gain = audioContext.createGain()
  gain.value = mapRange(parseInt(localStorage.getItem('volume')), 0, 100, 0, 2)
  
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
  noise.connect(pinkFilter).connect(lowpass).connect(gain).connect(audioContext.destination);
  noise.start(0,0,time);
  playing = true
  

}
