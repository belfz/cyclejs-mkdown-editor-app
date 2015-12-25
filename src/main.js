/** @jsx hJSX */
import Rx from 'rx';
import Cycle from '@cycle/core';
import {hJSX, makeDOMDriver} from '@cycle/dom';
import editor from './components/editor';

function main({DOM}) {
  return {
    DOM: Rx.Observable.just(
      <div id="container"> 
        <editor />
      </div>
      )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app', {
    'editor': editor
  })
});
