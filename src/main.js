/** @jsx hJSX */
import Rx from 'rx';
import Cycle from '@cycle/core';
import {hJSX, makeDOMDriver} from '@cycle/dom';
import editor from './components/editor';

const content = window.localStorage.getItem('cctext') || '';

function main({DOM}) {
  return {
    DOM: DOM.select('#editor-custom-element').events('save').map(({detail}) => window.localStorage.setItem('cctext', detail)).startWith(content).map(v =>
      <div id="container"> 
        <editor id="editor-custom-element" text={content}/>
      </div>
      )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app', {
    'editor': editor
  })
});
