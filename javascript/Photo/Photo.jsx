'use strict'
import React from 'react'
require('react-image-gallery/styles/css/image-gallery.css')
import ImageGallery from 'react-image-gallery'
import Waiting from '../Mixin/Waiting.jsx'

/* global $, require, propertyId, loadPhotos */

export default class Photo extends React.Component {
  constructor() {
    super()
    this.state = {
      photos: null,
      thumbnail: true
    }
    this.toggleScreen = this.toggleScreen.bind(this)
    this.load()
  }

  componentDidMount() {
    loadPhotos.callback = this.load.bind(this)
  }

  load() {
    $.getJSON('./properties/Photo/list', {propertyId: propertyId}).done(function (data) {
      this.setState({photos: data})
    }.bind(this))
  }

  toggleScreen() {
    this.setState({
      thumbnail: !this.state.thumbnail
    })
  }

  imageRender() {
    return null
  }

  render() {
    let images
    if (this.state.photos === null) {
      images = <Waiting label="photos"/>
    } else if (this.state.photos.length > 0) {
      images = (<ImageGallery
        ref={i => this._imageGallery = i}
        items={this.state.photos}
        onScreenChange={this.toggleScreen}
        infinite={true}
        showFullscreenButton={true}
        showPlayButton={true}
        showThumbnails={this.state.thumbnail}
        showIndex={true}
        showNav={true}
        slideInterval={4000}
        slideOnThumbnailHover={true}/>)
    } else {
      images = <div>No photos for this property</div>
    }
    return (
      <div>{images}</div>
    )
  }
}
