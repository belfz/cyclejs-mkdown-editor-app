/** @jsx hJSX */
import Rx from 'rx';
import Cycle from '@cycle/core';
import {hJSX, makeDOMDriver} from '@cycle/dom';
import storageDriver from '@cycle/storage';
import editor from './components/editor';

const content = window.localStorage.getItem('cctext') || '';

function main({DOM, storage}) {
  return {
    DOM: storage.local.getItem('cctext').startWith('').map(content =>
      <div id="container"> 
        <editor id="editor-custom-element" text={content}/>
      </div>
      ),
    storage: DOM.select('#editor-custom-element').events('save').map(({detail}) => ({key: 'cctext', value: detail}))  
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app', {
    'editor': editor
  }),
  storage: storageDriver
});
