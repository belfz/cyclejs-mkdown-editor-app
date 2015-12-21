/** @jsx hJSX */
import Rx from 'rx';
import {hJSX} from '@cycle/dom';
import {markdown} from 'markdown';

export default function editor(responses) {
	function intent(DOM) {
		let keyups$ = DOM.select('#code').events('keyup');
		return {
			update$: keyups$.debounce(250)
			
		};
	}

	function model(context, actions) {
		return actions.update$
			.map(e => ({
					html: markdown.toHTML(document.querySelector('#code').value)
				})
			)
			.startWith('');	
	}

	function view(state$) {
		return state$.map(({html}) =>
			<div className="editor">
				<textarea id="code"></textarea>
				<div id="result" innerHTML={html}></div>
			</div>
		);
	}
	
	let actions = intent(responses.DOM);
	let vtree$ = view(model(responses, actions));
	
	return {
		DOM: vtree$
	};
};
