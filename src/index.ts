'use strict';

import * as fs from "fs";
import * as bencode from "bencode";
import * as dgram from "dgram";
import {parse} from "url";
import {Tracker} from './tracker';

const torrent =  bencode.decode(fs.readFileSync('puppy.torrent'));

const tracker: Tracker = new Tracker();
tracker.getPeers(torrent, (peers: any)  => {
    console.log('list of peers', peers)
});