import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from './Canvas/index';
import $ from 'jquery';
import 'fullpage.js/dist/jquery.fullpage.min.js';
import 'fullpage.js/dist/jquery.fullpage.min.css';
import './style.css';

const ScrollSection = (props) => {
  return (<div className='section'>
    <div id='section'>
      {props.children}
    </div>
  </div>)
};

ReactDOM.render(<div id='app'>
  <div id='canvas-container'/>
  <div id='container'>
    <ScrollSection>
      @tatiyomi_wce
    </ScrollSection>
    <ScrollSection>
      produced
    </ScrollSection>
    <ScrollSection>
      this cite.
    </ScrollSection>
  </div>
</div>, document.getElementById('root'));

const canvas = new Canvas();

$(document).ready(function() {
  $('#container').fullpage({
    onLeave: (index,nextindex,direction) => {
      canvas.changeColor(nextindex);
    },
    loopBottom: true,
    navigation: true,
    navigationPosition: 'right',
    recordHistory: false
  });
});

let timeout;
window.addEventListener('resize', e => {
  if (timeout)
    return;

  timeout = setTimeout(function() {
    timeout = 0;
    canvas.resize();
  }, 500);
});

window.addEventListener('load', e => {
  canvas.mousemove(e.clientX, e.clientY);
});

window.addEventListener('mousemove', e => {
  canvas.mousemove(e.clientX, e.clientY);
});

window.addEventListener('click', e => {
  canvas.click();
});
