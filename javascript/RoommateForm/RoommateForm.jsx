'use strict'
import React from 'react'
import InputField from '../Mixin/Form/InputField.jsx'
import {DateField} from 'react-date-picker'
import RoommateObject from '../Mixin/Objects/RoommateObject.js'
import moment from 'moment'
import 'react-date-picker/index.css'
import bindMethods from '../Mixin/Helper/Bind.js'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import ProfileData from './ProfileData.js'
import CheckValues from '../Mixin/Helper/CheckValues.js'
import Message from '../Mixin/Html/Message.jsx'

/* global $ */

export default class RoommateForm extends React.Component {
  constructor(props) {
    super(props)
    let roommate = RoommateObject
    roommate.move_in_date = String(moment().format('X'))
    this.state = {
      roommate: RoommateObject,
      errors: {},
      message: null
    }

    bindMethods([
      'setValue',
      'setError',
      'save',
      'setMoveIn',
      'checkName',
      'checkEmail',
      'checkPhone',
      'checkErrors',
      'checkFacebook',
      'checkInstagram',
      'checkTwitter'
    ], this)
  }

  componentDidMount() {
    this.load()
  }

  load() {
    $.getJSON('./properties/Roommate/self').done(function (data) {
      const roommate = data.roommate
      if (!roommate) {
        return
      }
      this.setState({roommate: roommate})
    }.bind(this))
  }

  checkErrors() {
    let allIsWell = true
    if (!this.checkName()) {
      allIsWell = false
    }
    if (!this.checkEmail()) {
      allIsWell = false
    }
    if (!this.checkPhone()) {
      allIsWell = false
    }
    if (!this.checkFacebook()) {
      allIsWell = false
    }
    if (!this.checkInstagram()) {
      allIsWell = false
    }
    if (!this.checkTwitter()) {
      allIsWell = false
    }
    return allIsWell
  }

  setMessage(text, type) {
    const message = {
      text: text,
      type: type
    }
    this.setState({message: message})
  }

  save() {
    if (this.checkErrors()) {
      const methodName = this.state.roommate.id > 0
        ? 'put'
        : 'post'

      $.ajax({
        url: 'properties/Roommate',
        data: this.state.roommate,
        dataType: 'json',
        method: methodName,
        success: function (data) {
          if (data.error !== undefined) {
            this.setMessage(data.error, 'danger')
          } else {
            window.location.href = './properties/Roommate/' + data.id
          }
        }.bind(this),
        error: function () {
          this.setMessage('A server error prevented this property from saving.', 'danger')
        }.bind(this)
      })
    } else {
      $('html, body').animate({
        scrollTop: 0
      }, 'fast')
    }
  }

  setMoveIn(a) {
    let date = String(moment(a).format('X'))
    this.setValue('move_in_date', date)
  }

  setValue(varname, value) {
    if (value === null) {
      value = ''
    } else if (typeof value === 'object' && value.target !== undefined) {
      value = value.target.value
    }
    this.setError(varname, null)
    let roommate = this.state.roommate
    roommate[varname] = value
    this.setState({roommate})
  }

  setError(varname, value) {
    let errors = this.state.errors
    errors[varname] = value
    this.setState({errors})
  }

  formatDate(datenum) {
    return String(moment(datenum * 1000).format('YYYY-MM-DD'))
  }

  checkEmail() {
    if (CheckValues.isEmpty(this.state.roommate.email)) {
      this.setError('email', 'Email may not be empty')
      return false
    } else if (!CheckValues.isEmail(this.state.roommate.email)) {
      this.setError('email', 'Email not formatted propertly')
      return false
    } else {
      this.setError('email', null)
      return true
    }
  }

  checkName() {
    if (CheckValues.isEmpty(this.state.roommate.name)) {
      this.setError('name', 'Name may not be empty')
      return false
    } else {
      this.setError('name', null)
      return true
    }
  }

  checkPhone() {
    if (CheckValues.isEmpty(this.state.roommate.phone)) {
      this.setError('phone', 'Phone number may not be empty')
      return false
    } else if (!CheckValues.isPhone(this.state.roommate.phone)) {
      this.setError('phone', 'Phone number not formatted propertly')
      return false
    } else {
      this.setError('phone', null)
      return true
    }
  }

  checkFacebook() {
    if (CheckValues.isEmpty(this.state.roommate.facebook)) {
      return true
    } else if (!this.isGoodHost(this.state.roommate.facebook, 'facebook')) {
      this.setError('facebook', 'Please check your Facebook url')
      return false
    } else {
      if (!this.state.roommate.facebook.match(/^https?:\/\//)) {
        let roommate = this.state.roommate
        roommate.facebook = this.prependHttp(roommate.facebook)
        this.setState({roommate: roommate})
      }
      return true
    }
  }

  prependHttp(url) {
    return 'https://' + url
  }

  isGoodHost(value, site) {
    const expression = new RegExp(`(https?:\/\/)?(www\.)?${site}.com`)
    return CheckValues.isUrl(value) && value.match(expression)
  }

  checkInstagram() {
    if (CheckValues.isEmpty(this.state.roommate.instagram)) {
      return true
    } else if (!this.isGoodHost(this.state.roommate.instagram, 'instagram')) {
      this.setError('instagram', 'Please check your Instagram url')
      return false
    } else {
      if (!this.state.roommate.instagram.match(/^https?:\/\//)) {
        let roommate = this.state.roommate
        roommate.instagram = this.prependHttp(roommate.instagram)
        this.setState({roommate: roommate})
      }
      return true
    }
  }

  checkTwitter() {
    if (CheckValues.isEmpty(this.state.roommate.twitter)) {
      return true
    } else if (!this.isGoodHost(this.state.roommate.twitter, 'twitter')) {
      this.setError('twitter', 'Please check your Twitter url')
      return false
    } else {
      if (!this.state.roommate.twitter.match(/^https?:\/\//)) {
        let roommate = this.state.roommate
        roommate.twitter = this.prependHttp(roommate.twitter)
        this.setState({roommate: roommate})
      }
      return true
    }
  }

  render() {
    const {roommate} = this.state
    const saveButton = (
      <div className="text-center">
        <button type="button" className="btn btn-lg btn-primary" onClick={this.save}>
          <i className="fa fa-save"></i>&nbsp;Save</button>
      </div>
    )

    let message
    if (this.state.message !== null) {
      message = <Message
        message={this.state.message.text}
        type={this.state.message.type}
        onClose={this.unsetMessage}/>
    }

    return (
      <div className="roommate-form">
        <p className="alert alert-info">This service is for students looking to meet
          others to share a residence. If you are looking for someone to assume a
          sublease, please use our&nbsp;<strong>
            <a href="./properties/Sublease">sublease section</a>
          </strong>&nbsp;instead.
        </p>
        {message}
        <div className="row marginBottom">
          <div className="col-sm-6">
            <label>Date when you want to move in</label>
            <DateField
              dateFormat="YYYY-MM-DD"
              onChange={this.setMoveIn}
              value={this.formatDate(roommate.move_in_date)}/>
          </div>
          <div className="col-sm-6"></div>
        </div>
        <fieldset>
          <legend>Contact information</legend>
          <div className="marginBottom">
            <i className="fa fa-asterisk text-danger"></i>
            Required information</div>
          <div className="row">
            <div className="col-sm-12">
              <InputField
                name="name"
                label={'Full name'}
                errorMessage={this.state.errors.name}
                value={roommate.name}
                change={this.setValue.bind(this, 'name')}
                required={true}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <InputField
                name="email"
                label={'Email address'}
                errorMessage={this.state.errors.email}
                value={roommate.email}
                change={this.setValue.bind(this, 'email')}
                blur={this.checkEmail}
                required={true}/>
            </div>
            <div className="col-sm-6">
              <InputField
                name="phone"
                label={'Phone number'}
                errorMessage={this.state.errors.phone}
                value={roommate.phone}
                blur={this.checkPhone}
                placeholder="###-###-####"
                change={this.setValue.bind(this, 'phone')}
                required={true}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <InputField
                name="facebook"
                label={'Facebook'}
                errorMessage={this.state.errors.facebook}
                value={roommate.facebook}
                blur={this.checkFacebook}
                change={this.setValue.bind(this, 'facebook')}/>
            </div>
            <div className="col-sm-4">
              <InputField
                name="instagram"
                label={'Instagram'}
                value={roommate.instagram}
                errorMessage={this.state.errors.instagram}
                blur={this.checkInstagram}
                change={this.setValue.bind(this, 'instagram')}/>
            </div>
            <div className="col-sm-4">
              <InputField
                name="twitter"
                label={'Twitter'}
                blur={this.checkTwitter}
                errorMessage={this.state.errors.twitter}
                value={roommate.twitter}
                change={this.setValue.bind(this, 'twitter')}/>
            </div>
          </div>
          <p className="alert alert-info">Contact information will be shown to other
            logged in students only. If you wish for people to have contact information
            without logging in, put it in the "About me" section below.</p>
          {saveButton}
        </fieldset>
        <fieldset>
          <legend>About me</legend>
          <p className="alert alert-info">The information you enter below will help people
            with similar interests find you. Nothing below is required.</p>
          <div className="row">
            <div className="col-sm-12 marginBottom">
              <label>My focus while attending college is
              </label>
              <Select
                name="focus"
                value={this.state.roommate.focus}
                options={ProfileData.listFocus()}
                placeholder="Select from below or leave blank"
                simpleValue={true}
                onChange={this.setValue.bind(this, 'focus')}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 marginBottom">
              <InputField
                name="major"
                label={'My major'}
                placeholder="Enter your current major or leave empty"
                value={roommate.major}
                change={this.setValue.bind(this, 'major')}/>
            </div>
            <div className="col-sm-6 marginBottom">
              <label>In my free time I like to...</label>
              <Select
                name="free_time"
                value={this.state.roommate.free_time}
                options={ProfileData.listFreeTime()}
                placeholder="Select from below or leave blank"
                simpleValue={true}
                onChange={this.setValue.bind(this, 'free_time')}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 marginBottom">
              <label>Hobbies</label>
              <Select
                name="hobbies"
                value={this.state.roommate.hobbies}
                options={ProfileData.listHobbies()}
                placeholder="Pick all that apply or leave blank"
                multi={true}
                simpleValue={true}
                onChange={this.setValue.bind(this, 'hobbies')}/>
            </div>
            <div className="col-sm-6 marginBottom">
              <label>Personal politics</label>
              <Select
                name="politics"
                value={this.state.roommate.politics}
                options={ProfileData.listPolitics()}
                simpleValue={true}
                placeholder="Select from below or leave blank"
                onChange={this.setValue.bind(this, 'politics')}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 marginBottom">
              <label>Music preferences</label>
              <Select
                name="music"
                value={this.state.roommate.music}
                options={ProfileData.listMusic()}
                placeholder="Pick all that apply or leave blank"
                multi={true}
                simpleValue={true}
                onChange={this.setValue.bind(this, 'music')}/>
            </div>
            <div className="col-sm-6 marginBottom">
              <label>Spoken languages</label>
              <Select
                name="languages"
                value={this.state.roommate.languages}
                options={ProfileData.listLanguages()}
                placeholder="Pick all that apply or leave blank"
                multi={true}
                simpleValue={true}
                onChange={this.setValue.bind(this, 'languages')}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 marginBottom">
              <label>Compared to most people
              </label>
              <Select
                name="loudness"
                value={this.state.roommate.loudness}
                options={ProfileData.listLoudness()}
                placeholder="Select from below or leave blank"
                simpleValue={true}
                onChange={this.setValue.bind(this, 'loudness')}/>
            </div>
            <div className="col-sm-6 marginBottom">
              <label>I keep my living area
              </label>
              <Select
                name="cleanliness"
                value={this.state.roommate.cleanliness}
                options={ProfileData.listCleanliness()}
                simpleValue={true}
                placeholder="Select from below or leave blank"
                onChange={this.setValue.bind(this, 'cleanliness')}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 marginBottom">
              <label>Smoking
              </label>
              <Select
                name="smoking"
                value={this.state.roommate.smoking}
                options={ProfileData.listSmoking()}
                simpleValue={true}
                placeholder="Select from below or leave blank"
                onChange={this.setValue.bind(this, 'smoking')}/>
            </div>
            <div className="col-sm-6 marginBottom">
              <label>Pets
              </label>
              <Select
                name="pets"
                value={this.state.roommate.pets}
                options={ProfileData.listPets()}
                simpleValue={true}
                placeholder="Select from below or leave blank"
                onChange={this.setValue.bind(this, 'pets')}/>
            </div>
          </div>
          <div className="row marginBottom">
            <div className="col-sm-12">
              <label>Other information</label>
              <textarea
                placeholder="Any other public information you wish to share should be entered here"
                className="form-control"
                onChange={this.setValue.bind(this, 'description')}
                value={roommate.description}
                name="description"/>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>My schedule</legend>
          <div className="row">
            <div className="col-sm-6 col-lg-3 marginBottom">
              <label>I wake up around</label>
              <Select
                name="wake_time"
                value={this.state.roommate.wake_time}
                options={ProfileData.listWakeTimes()}
                simpleValue={true}
                placeholder="Select from below or leave blank"
                onChange={this.setValue.bind(this, 'wake_time')}/>
            </div>
            <div className="col-sm-6 col-lg-3 marginBottom">
              <label>And go to sleep around</label>
              <Select
                name="sleep_time"
                value={this.state.roommate.sleep_time}
                options={ProfileData.listSleepTimes()}
                simpleValue={true}
                placeholder="Select from below or leave blank"
                onChange={this.setValue.bind(this, 'sleep_time')}/>
            </div>
            <div className="col-sm-6 col-lg-3 marginBottom">
              <label>I tend to study</label>
              <Select
                name="study_time"
                value={this.state.roommate.study_time}
                options={ProfileData.listStudyTimes()}
                placeholder="Select from below or leave blank"
                onChange={this.setValue.bind(this, 'study_time')}/></div>
            <div className="col-sm-6 col-lg-3 marginBottom">
              <label>I have overnight guests</label>
              <Select
                name="overnighter"
                value={this.state.roommate.overnighter}
                options={ProfileData.listOvernighter()}
                simpleValue={true}
                placeholder="Select from below or leave blank"
                onChange={this.setValue.bind(this, 'overnighter')}/>
            </div>
          </div>
          {saveButton}
        </fieldset>
      </div>
    )
  }
}

RoommateForm.propTypes = {}
