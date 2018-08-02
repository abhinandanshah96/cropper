import React, { Component } from 'react';
import 'cropperjs/dist/cropper.css';

import Cropper from 'react-cropper';
import download from 'downloadjs'
import printJS from 'print-js'  

const src = '750x90.png';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src,
      cropResult: null,
      maxSize: 1024 *1024,
      error: ''
    };
    this.cropImage = this.cropImage.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCropChange = this.onCropChange.bind(this);
    this.useDefaultImage = this.useDefaultImage.bind(this);
    this.saveImage = this.saveImage.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if(files[0].size > this.state.maxSize){
      this.setState({ error: "Size too much"});
      return
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result, error: '' });
    };
    reader.readAsDataURL(files[0]);
  }

  onCropChange() {
    const data = this.cropper.getData();
    if( data.height > 100) this.cropper.setData({ height: 100 })
    if( data.width > 800) this.cropper.setData({ width: 800 })
  }

  cropImage() {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    console.log(this.cropper.getData(true))
    this.setState({
      cropResult: this.cropper.getCroppedCanvas({
          width: 800,
          height: 100,
          maxWidth: 800,
          maxHeight: 100,
          fillColor: '#f9f9f9',
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'high',
      }).toDataURL(),
    });
  }

  useDefaultImage() {
    this.setState({ src , error: ''});
  }

  saveImage(imageFile) {
    download(this.state.cropResult, "croppedimage.png", "image/png")
    return Promise.resolve("http://lorempixel.com/800/100/cats/");
  }

  render() {
    return (
      <div>
        <div style={{ width: '50%' }}>
          <input type="file" onChange={this.onChange} />
          <button onClick={this.useDefaultImage}>Use default img</button>
          <br />
          <br />
          { !this.state.error ?
          <Cropper
            style={{ height: '300px', width: '50%' }}
            viewMode={1}
            highlight={true}
            background={false}
            preview=".img-preview"
            guides={false}
            src={this.state.src}
            responsive={true}
            ref={cropper => { this.cropper = cropper; }}
            crop={this.onCropChange}
          />
          : <p>{this.state.error}</p>}
        </div>
        <div>
          <div className="box" style={{ width: '50%', float: 'right' }}>
            <h1><span>Preview</span>
              <button onClick={this.cropImage} style={{ float: 'right' }}>
                Crop Image
              </button>
            </h1>
            <div className="img-preview" style={{ width: '100%', float: 'left', height: 300 }} />
          </div>
          { !this.state.cropResult ? undefined :
          <div className="box" style={{ width: '50%', float: 'right' }}>
            <h1>
              <span>Cropped Image:</span>
              <button onClick={this.saveImage} style={{ float: 'right' }}>
                Download Image
              </button>
              <button onClick={() => {printJS(this.state.cropResult, 'image')}} style={{ float: 'right' }}>
                 Print
              </button>
              <br />
            </h1>
            <img style={{ width: '100%' }} src={this.state.cropResult} alt="cropped" />
          </div>
        }
        </div>
        <br style={{ clear: 'both' }} />
      </div>
    );
  }
}