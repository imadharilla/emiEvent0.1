import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventsService } from '../events.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { mimeTypeImage } from '../event-create/mime-type.validator';
import * as faceapi from '../../../assets/face/face-api.js';

@Component({
  selector: 'app-event-confirm',
  templateUrl: './event-confirm.component.html',
  styleUrls: ['./event-confirm.component.scss']
})
export class EventConfirmComponent implements OnInit {
  isLoading=false
  eventId;
  eventTitle = 'Event Title'
  eventDescription = 'Event Description'
  eventDate ;
  eventLocation;
  attendeeId;
  private modal : NgbModalRef;
  form: FormGroup;
  imagePreview : string;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private _modalService: NgbModal,
    ) { }

  ngOnInit(): void {
    faceapi.nets.tinyFaceDetector.loadFromUri('assets/weights')
    faceapi.nets.faceLandmark68Net.loadFromUri('assets/weights');
    faceapi.nets.tinyFaceDetector.loadFromUri('assets/weights');
    this.form = new FormGroup({
      'image' : new FormControl(null,
       { validators:[],
      asyncValidators:[mimeTypeImage]})
    });


    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('eventId')) {
        this.eventId = paramMap.get('eventId');
        this.eventService.getEvent(this.eventId).subscribe(event=>{
          this.eventTitle = event.title;
          this.eventDescription = event.description;
          this.eventLocation = event.location;
          this.eventDate = event.startDate;
        })
      }
      if(paramMap.has('attendeeId')) {
        this.attendeeId = paramMap.get('attendeeId')
      }
    })
  }


  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image' : file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  openForm(content) {
    this.modal = this._modalService.open(content)
  }

  async onSaveForm(){
    this.isLoading = true;
    let image = document.getElementById('imageFace') as HTMLImageElement;
    let detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
    if (detection == undefined) {
      alert('no face')
      return 
    }
    console.log(detection)
    this.modal.close('Ok click');
    this.eventService.confirmEvent(this.attendeeId, this.eventId ,this.form.value.image );

  }

}
   