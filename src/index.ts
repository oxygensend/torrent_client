'use strict';

import * as fs from "fs";
import * as bencode from "bencode";
import * as dgram from "dgram";
import {parse} from "url";


const torrent =  bencode.decode(fs.readFileSync('puppy.torrent'));
const url = parse(torrent.announce.toString());
const socket: dgram.Socket = dgram.createSocket('udp4');

const myMsg: Buffer =  Buffer.from("hello?");

socket.send(myMsg, 0, myMsg.length, Number(url.port), url.host || undefined, () => { console.log('wyslaem')});
console.log(myMsg.length);
socket.on('message', msg => {
    console.log('message is', msg)}
)
