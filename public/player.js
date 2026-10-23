'use strict';
const $=id=>document.getElementById(id),audio=$('audio'),seek=$('seek'),volume=$('volume'),status=$('status');
let dragging=false,lastVolume=.8;
const time=n=>Number.isFinite(n)?`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`:'--:--';
const paint=(el,p)=>el.style.setProperty('--progress',`${p}%`);
audio.volume=.8;
function refresh(){if(!dragging){seek.value=Number.isFinite(audio.duration)&&audio.duration>0?audio.currentTime/audio.duration*1000:0;$('elapsed').textContent=time(audio.currentTime);paint(seek,seek.value/10);}}
function volumeUI(){const muted=audio.muted||audio.volume===0;$('mute').textContent=muted?'取消静音':'音量';$('mute').setAttribute('aria-pressed',String(muted));$('mute').setAttribute('aria-label',muted?'取消静音':'静音');volume.value=audio.volume;paint(volume,(muted?0:audio.volume)*100);$('volume-value').textContent=muted?'0%':`${Math.round(audio.volume*100)}%`;}
async function play(){try{await audio.play();}catch(e){status.textContent=e.name==='NotAllowedError'?'请点击播放按钮，开始聆听。':'暂时无法播放，请检查网络后重试。';}}
$('play').onclick=()=>audio.paused?play():audio.pause();
audio.addEventListener('loadedmetadata',()=>{$('duration').textContent=time(audio.duration);seek.disabled=!Number.isFinite(audio.duration);});
audio.addEventListener('durationchange',()=>{$('duration').textContent=time(audio.duration);seek.disabled=!Number.isFinite(audio.duration);});
audio.addEventListener('timeupdate',refresh);
audio.addEventListener('play',()=>{$('play-icon').textContent='❚❚';$('play-label').textContent='暂停';$('play').setAttribute('aria-label','暂停音乐');status.textContent='正在播放 · Odd Dice';document.querySelector('.light').classList.add('playing');});
audio.addEventListener('pause',()=>{$('play-icon').textContent='▶';$('play-label').textContent='播放';$('play').setAttribute('aria-label','播放音乐');status.textContent=audio.ended?'播放结束，点击重新聆听。':'已暂停';document.querySelector('.light').classList.remove('playing');});
audio.addEventListener('ended',()=>{status.textContent='播放结束，点击重新聆听。';refresh();});
audio.addEventListener('error',()=>{status.textContent='音频加载失败，请检查网络后刷新页面。';});
audio.addEventListener('waiting',()=>{status.textContent='正在缓冲…';});
audio.addEventListener('playing',()=>{status.textContent='正在播放 · Odd Dice';});
seek.addEventListener('input',()=>{dragging=true;paint(seek,seek.value/10);$('elapsed').textContent=time(seek.value/1000*audio.duration);});
seek.addEventListener('change',()=>{if(Number.isFinite(audio.duration))audio.currentTime=seek.value/1000*audio.duration;dragging=false;refresh();});
volume.addEventListener('input',()=>{const v=Number(volume.value);audio.volume=v;audio.muted=false;if(v>0)lastVolume=v;volumeUI();if(Math.abs(audio.volume-v)>.02)$('volume-note').hidden=false;});
audio.addEventListener('volumechange',volumeUI);
$('mute').onclick=()=>{if(audio.volume===0){audio.volume=lastVolume;audio.muted=false;}else audio.muted=!audio.muted;volumeUI();};
$('back').onclick=()=>{if(Number.isFinite(audio.duration))audio.currentTime=Math.max(0,audio.currentTime-10);};
$('forward').onclick=()=>{if(Number.isFinite(audio.duration))audio.currentTime=Math.min(audio.duration,audio.currentTime+10);};
$('loop').onclick=()=>{audio.loop=!audio.loop;$('loop').setAttribute('aria-pressed',String(audio.loop));status.textContent=audio.loop?'已开启单曲循环':'已关闭单曲循环';};
if(/iPad|iPhone|iPod/.test(navigator.userAgent))$('volume-note').hidden=false;
if('mediaSession' in navigator){navigator.mediaSession.metadata=new MediaMetadata({title:'Odd Dice',album:"Aling’s Music Corner",artwork:[{src:'portrait.png',sizes:'1166x1349',type:'image/png'}]});navigator.mediaSession.setActionHandler('play',play);navigator.mediaSession.setActionHandler('pause',()=>audio.pause());}
volumeUI();
