/** @jsx hJSX */
import Rx from 'rx';
import {hJSX} from '@cycle/dom';
import {markdown} from 'markdown';

export default function editor(responses) {
	function intent(DOM) {
		const keyups$ = DOM.select('#code').events('keyup');
		const delay$ = DOM.select('#delay').events('input').map(e => parseInt(e.target.value, 10)).startWith(500);
		return {
			keyup$: keyups$,
			delay$: delay$
		};
	}

	function model(context, actions) {
		const html$ = actions.delay$.flatMapLatest(d => actions.keyup$.debounce(d))
			.map(e => ({html: markdown.toHTML(document.querySelector('#code').value)}))
			.startWith('');
		return Rx.Observable.combineLatest(html$, actions.delay$, (htmlStream, delay) => ({html: htmlStream.html, delay}));
	}
	
	function view(state$) {
		return state$.map(({html, delay}) =>
			<div className="editor">
				<div className="controls">
					<input type="range" id="delay" min="0" max="1000" step="100" value={delay} />
					<label htmlFor="delay">Result is debounced by {delay}ms</label> 
				</div>
				<div className="panes">
					<textarea id="code"></textarea>
					<div className="result">
						<div id="result-rendered" innerHTML={html}></div>
						<pre id="result-pre">{html}</pre>
					</div>
				</div>
			</div>
		);
	}
	
	let actions = intent(responses.DOM);
	let vtree$ = view(model(responses, actions));
	
	return {
		DOM: vtree$
	};
};
