const marketNames = { madhur: 'Madhur Bazar', kalyan: 'Kalyan', milan: 'Milan Day', rajdhani: 'Rajdhani Day' };
const recentResults = [
	['Madhur Bazar', '08 Sep', '4', '8', '48'], ['Kalyan', '08 Sep', '1', '6', '16'],
	['Milan Day', '07 Sep', '7', '2', '72'], ['Rajdhani Day', '07 Sep', '3', '9', '39'],
	['Madhur Bazar', '06 Sep', '5', '0', '50']
];
const dateInput = document.querySelector('#draw-date');
const form = document.querySelector('#prediction-form');
const marketInput = document.querySelector('#market');
const signalNumber = document.querySelector('#signal-number');
const resultDate = document.querySelector('#result-date');
const summary = document.querySelector('#signal-summary');
const pulseValue = document.querySelector('#pulse-value');

function localDate() {
	const now = new Date();
	return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function stableSignal(market, date) {
	const source = `${market}:${date}`;
	let hash = 17;
	for (let index = 0; index < source.length; index += 1) hash = (hash * 31 + source.charCodeAt(index)) % 10000;
	const open = (hash * 7 + 3) % 10;
	const close = (hash * 3 + market.length) % 10;
	return { open, close, pulse: 42 + (hash % 49) };
}

function renderSignal() {
	const date = dateInput.value || localDate();
	const market = marketInput.value;
	const signal = stableSignal(market, date);
	signalNumber.innerHTML = `${signal.open}${signal.close} <span>·</span> ${signal.close}${signal.open}`;
	resultDate.textContent = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
	pulseValue.textContent = `${signal.pulse}/100`;
	summary.textContent = `${marketNames[market]} / ${date === localDate() ? 'today' : 'selected date'} / local reference pair`;
}

function renderHistory() {
	document.querySelector('#history-body').innerHTML = recentResults.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td><b>${row[2]}</b></td><td><b>${row[3]}</b></td><td class="jodi">${row[4]}</td></tr>`).join('');
}

function renderNumberMap() {
	document.querySelector('#number-grid').innerHTML = Array.from({ length: 10 }, (_, digit) => `<div class="digit"><span>${digit}</span><small>${digit === 0 ? 'zero' : digit % 2 === 0 ? 'even' : 'odd'}</small></div>`).join('');
}

dateInput.value = localDate();
form.addEventListener('submit', (event) => { event.preventDefault(); renderSignal(); });
marketInput.addEventListener('change', renderSignal);
renderHistory();
renderNumberMap();
renderSignal();
