import { Component, OnInit } from '@angular/core';
import { Transform } from 'stream';

@Component({
  selector: 'app-append-init-vect',
  templateUrl: './append-init-vect.component.html',
  styleUrls: ['./append-init-vect.component.css']
})
export class AppendInitVectComponent extends Transform implements OnInit {

  private initVect;
  private appended;

  constructor(initVect) {
    super();
    this.initVect = initVect;
    this.appended = false;
  }

  _transform(chunk, encoding, cb) {
    if (!this.appended) {
      this.push(this.initVect);
      this.appended = true;
    }
    this.push(chunk);
    cb();
  }
  ngOnInit() {
  }

}
