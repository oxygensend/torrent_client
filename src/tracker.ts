import * as dgram from 'dgram';
import {Buffer} from 'buffer'
import {parse, UrlWithStringQuery} from 'url'
import * as crypto from 'crypto';


export class Tracker {

    private socket: dgram.Socket = dgram.createSocket('udp4');

    public getPeers(torrent: any, callback: Function) {
        const url: string = torrent.annouce.toString();

        // Send a connect request
        this.udpSend(this.buildConnectionRequest(), url);

        this.socket.on('message', response => {

            switch (this.responseType(response)) {
                case 'connect':
                    // Get the connect response and extract the connection id
                    const connectionResponse = this.parseConnectionResponse(response);

                    // Use the connection id to send an announce request - this is where we tell the tracker which files we’re interested in
                    const announceRequest = this.buildAnnounceRequest(connectionResponse.connectionId);
                    this.udpSend(announceRequest, url);
                    break;
                case 'annouce':
                    // Get the announce response and extract the peers list
                    const announceResponse = this.parseAnnounceResponse(response);
                    callback(announceResponse.peers);
            }

        });
    }

    private udpSend(message: Buffer, rawUrl: string, callback = () => {
    }) {
        const url: UrlWithStringQuery = parse(rawUrl);
        this.socket.send(message, 0, message.length, Number(url.port), url.host || undefined, callback);
    }


    private responseType(response: any) {

    }
    // Request schema
    // Offset  Size            Name            Value
    // 0       64-bit integer  connection_id   0x41727101980
    // 8       32-bit integer  action          0 // connect
    // 12      32-bit integer  transaction_id  ? // random
    // 16
    private buildConnectionRequest(): Buffer {

        const buffer: Buffer = Buffer.alloc(16);

        buffer.writeUInt32BE(0x417, 0);
        buffer.writeUInt32BE(0x27101980, 4);

        buffer.writeUInt32BE(0, 8);
        crypto.randomBytes(8).copy(buffer,12);

        return buffer;
    }

    // Response schema
    // Offset  Size            Name            Value
    // 0       32-bit integer  action          0 // connect
    // 4       32-bit integer  transaction_id
    // 8       64-bit integer  connection_id
    // 16
    private parseConnectionResponse(response: any) {

        return {
         action: response.readUint32BE(0),
         transactionId: response.readUint32BE(4),
         connectionId: response.slice(8),  // easier way to read 8 bytes
        };

    }

    private buildAnnounceRequest(connectionId: string) {

    }

    private parseAnnounceResponse(response: any) {

    }
}





