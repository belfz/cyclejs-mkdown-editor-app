/** @jsx hJSX */
import Rx from 'rx';
import Cycle from '@cycle/core';
import {hJSX, makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';
import storageDriver from '@cycle/storage';
import editor from './components/editor';

const content = window.localStorage.getItem('cctext') || '';

function main({DOM, storage}) {
  const editorComponent = isolate(editor)({DOM, storage});
  
  return {
    DOM: Rx.Observable.just(
      <div id="container"> 
        {editorComponent.DOM}
      </div>
      ),
    storage: editorComponent.storage  
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  storage: storageDriver
});
