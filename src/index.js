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
      This is tachiyomi portforio.
    </ScrollSection>
    <ScrollSection>
      <div class='intro'>
        <a href='https://iceclicker-server.herokuapp.com/home' target='blank'>
          IceClicker</a><br/>
        IceClickerというゲームの紹介用サイトです<br/>
        C++で作成していて、得点ランキングに参加できます<br/>
        ゲームの遊び方からダウンロードまで色々できます
      </div>
    </ScrollSection>
    <ScrollSection>
      <div class='intro'>
        <a href='https://tachiyomi.github.io/tachiyomi_portforio/' target='blank'>
          Tachiyomi</a><br/>
        Vue.js、Firebase等を使って作成したサイトです<br/>
        簡易なチャットもあります
      </div>
    </ScrollSection>
    <ScrollSection>
      <div class='intro'>
        <a href='https://tachiyomi.github.io/Javascript-tutorial/' target='blank'>
          Javascriptページデザイン</a><br/>
        HTML,CSS,JS初めたてに作成したサイトです<br/>
        GASで翻訳できるのがウリです
      </div>
    </ScrollSection>
    <ScrollSection>
      <div class='intro'>
        <a href='https://wce.jp/works/?tag=%E7%AB%8B%E3%81%A1%E8%AA%AD%E3%81%BF' target='blank'>
          Games</a><br/>
        サークル活動で作成したゲームの一覧が確認できます<br/>
        C++のライブラリを使用して開発していました
      </div>
    </ScrollSection>
    <ScrollSection>
      @tatiyomi_wce
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

window.onload = function(){
  setTimeout(function(){document.getElementById('container')
    .style.display='block';},1200);
}
