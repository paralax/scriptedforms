import {
  Component, OnInit, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';

import {
  RenderMime, defaultRendererFactories
} from '@jupyterlab/rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import { Kernel } from '@jupyterlab/services';

import { KernelService } from '../kernel.service';

@Component({
  selector: 'code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit, AfterViewInit {

  renderMimeOptions: RenderMime.IOptions
  renderMime: RenderMime
  model: OutputAreaModel
  outputAreaOptions: OutputArea.IOptions
  outputArea: OutputArea

  promise: Promise<Kernel.IFuture>
  future: Kernel.IFuture

  code: string
  @ViewChild('codecontainer') codecontainer: ElementRef
  @ViewChild('outputcontainer') outputcontainer: ElementRef

  constructor(
    private myKernelSevice: KernelService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.code = this.codecontainer.nativeElement.innerHTML
    this.model = new OutputAreaModel()
    this.renderMime = new RenderMime()

    for (let factory of defaultRendererFactories) {
      this.renderMime.addFactory(factory)
    }

    this.outputAreaOptions = {
      model: this.model,
      rendermime: this.renderMime
    }

    this.outputArea = new OutputArea(this.outputAreaOptions)
  }

  runCode() {
    this.promise = this.myKernelSevice.runCode(this.code)
    this.promise.then(future => {
      this.future = future
      this.outputArea.future = this.future
      this.outputcontainer.nativeElement.appendChild(this.outputArea.node)
      this.future.done.then(() => {
        console.log(this.outputArea.model.length)
      })
    })
  }


}
