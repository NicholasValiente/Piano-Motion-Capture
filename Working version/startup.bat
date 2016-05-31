@echo off
start ./websocket-relay.pl
sleep 1000
start  chrome localhost/MoVis_modified/MoVis.html
sleep 100
start  chrome "localhost/Midi Server/midiServer.html"
sleep 100
start  chrome "localhost/leap server/leapServer.html"
