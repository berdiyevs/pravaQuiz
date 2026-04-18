const monitor = document.querySelector('.progress-monitor');
monitor.innerHTML = ''; 

for (let i = 1; i <= 20; i++) {
    const step = document.createElement('div');
    step.classList.add('step');
    step.innerText = i < 10 ? `0${i}` : i;
    monitor.appendChild(step);
}