// ------ find all ids from html ----- // 

const displayTime = document.getElementById('displaytime');
const startButton = document.getElementById('startbutton');
const lapButton = document.getElementById('lapbutton');
const stopButton = document.getElementById('stopbutton');
const clearButton = document.getElementById('clearbutton');
const times = document.getElementById('timelist');

// ----- initialize variables object ----- //

let data = {
    lapTimes: [],
    animateFrame: 0,
    nowTime: 0,
    diffTime: 0,
    startTime: 0,
    isRunning: false,
}

// ----- function that calculate elapsed time from starting time ----- //

const setSubtractStartTime = (time) => {
    time = typeof time !== 'undefined' ? time : 0;
    data.startTime = Math.floor(performance.now() - time);
};

// ----- function which start stopwatch ----- //

const startTimer = () => {

    setSubtractStartTime(data.diffTime);    // calculate start time

    (loop = () => {
        data.nowTime = Math.floor(performance.now());   // defined current time
        data.diffTime = data.nowTime - data.startTime;  // calculate elapsed time

        displayTimerTime(); // display elapsed time
        data.animateFrame = requestAnimationFrame(loop);    // runs the loop       
    })();

    data.isRunning = true;

}

// ----- function which displays new time ----- //

const displayTimerTime = () => {
    displayTime.textContent = `${computed.hours()}:${computed.minutes()}´${computed.seconds()}´´${computed.milliseconds()}`;
}

// ----- function which stops timer by cancelling loop ----- //

const stopTimer = () => {
    data.isRunning = false;
    cancelAnimationFrame(data.animateFrame); 
}

// ----- function which takes current time and push it to the list, timer continues -----//

const pushTimes = () => {
    data.lapTimes.push({
        hours: computed.hours(),
        minutes: computed.minutes(),
        seconds: computed.seconds(),
        milliseconds: computed.milliseconds()
    });

}

// ----- Clear function which initialize all variables back to start ----- //

const clearAll = () => {
    data.startTime = 0;
    data.nowTime = 0;
    data.diffTime = 0;
    data.lapTimes = [];
    data.animateFrame = 0;
    displayTime.textContent = '00:00´00´´000';
    times.textContent = "";
}

// ------ object methods which calculates current time what has been elapsed ----- //

const computed = {
    hours() {
        return zeroPad(Math.floor(data.diffTime / 1000 / 60 / 60));
    },
    minutes() {
        return zeroPad(Math.floor(data.diffTime / 1000 / 60) % 60);
    },
    seconds() {
        return zeroPad(Math.floor(data.diffTime / 1000) % 60);
    },
    milliseconds() {
        return zeroPad(Math.floor(data.diffTime % 1000), 3);
    }
}

// ----- function which keeps digits in place ----- //

const zeroPad = (value, num) => {
    num = typeof num !== 'undefined' ? num : 2;
    return value.toString().padStart(num, "0");
}

// ----- change buttons active states ----- //

const changeButtons = () => {

    startButton.disabled = data.isRunning ? !startButton.disabled : !startButton.disabled;  
    lapButton.disabled = data.isRunning ? !lapButton.disabled : !lapButton.disabled; 
    stopButton.disabled = data.isRunning ? !stopButton.disabled : !stopButton.disabled;
    clearButton.disabled = data.isRunning ? true : !clearButton.disabled;

}

// ----- next four are event listener for the buttons ----- //

// startbutton start stopwatch
// lapbutton push elapsed time to list and displays it
// stopbutton stop the timer
// clearbutton clears the timer

startButton.onclick = () => {
    
    startTimer();
    changeButtons();
}

lapButton.onclick = () => {

    pushTimes();
    const newlap = document.createElement('li');

    for (const lap of data.lapTimes) {
        newlap.textContent = `${lap.hours}:${lap.minutes}´${lap.seconds}´´${lap.milliseconds}`;
        times.appendChild(newlap);
    }
}

stopButton.onclick = () => {
    startButton.textContent = 'Resume';
    stopTimer();
    changeButtons();
}

clearButton.onclick = () => {
    startButton.textContent = 'Start';
    clearAll();
    clearButton.disabled = true;
}
