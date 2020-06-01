import { Component, OnInit } from '@angular/core';
import { CheckinService } from '../checkin.service';

import * as faceapi from '../../../assets/face/face-api.js';
@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {
  video : any
  constructor(private checkinService: CheckinService) { }

  ngOnInit(): void {
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('assets/weights'),
  faceapi.nets.faceLandmark68Net.loadFromUri('assets/weights'),
  faceapi.nets.faceRecognitionNet.loadFromUri('assets/weights'),
  faceapi.nets.faceExpressionNet.loadFromUri('assets/weights'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('assets/weights')
]).then(x=>this.startVideo())
    this.video = document.getElementById('video') as HTMLVideoElement;
    this.video.addEventListener('play', setInterval(async () => {
      const detections = await faceapi.detectSingleFace(this.video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceExpressions()
     console.log(detections)
    }, 10000))
  }


  startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => this.video.srcObject = stream,
      err => console.log(err)
    )
  }

  capture() {
    const canvas = document.createElement('canvas'); // create a canvas
    const ctx = canvas.getContext('2d'); // get its context
    canvas.width = this.video.videoWidth; // set its size to the one of the video
    canvas.height = this.video.videoHeight;
    ctx.drawImage(this.video, 0,0); // the video
    console.log(canvas.toDataURL())
    canvas.toBlob(blob=>{
      this.checkinService.verifyPicture(blob as File)
    })
    
  }
}
 