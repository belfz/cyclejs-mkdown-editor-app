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
		const text$ = context.storage.local.getItem('cctext');
		const html$ = text$.merge(
				actions.delay$.flatMapLatest(d => actions.keyup$.debounce(d)).map(e => e.target.value)
			)
			.map(e => ({html: markdown.toHTML(e || '')}))
			.startWith({html: ''});
		
		return Rx.Observable.combineLatest(html$, actions.delay$, text$, (htmlStream, delay, text) => ({html: htmlStream.html, delay, text}));
	}
	
	function view(state$) {
		return state$.map(({html, delay, text}) =>
			<div className="editor">
				<div className="controls">
					<input type="range" id="delay" min="0" max="1000" step="100" value={delay} />
					<label htmlFor="delay">Result is debounced by {delay}ms</label>
				</div>
				<div className="panes">
					<textarea id="code" value={text}></textarea>
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
		DOM: vtree$,
		storage: actions.keyup$.map(e => ({key: 'cctext', value: e.target.value})).debounce(1000)
	};
};
